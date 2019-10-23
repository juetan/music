<template>
    <div class="player" v-show="playList.length>0">
        <transition name="normal" >  
        <!-- [1] 全屏播放器 -->
        <div class="normal-player" v-show="fullScreen">
            <!-- 播放器背景 -->
            <div class="background" ref="Gbg"> <img width="100%" height="100%" :src="currentSong.image" > </div>
            <!-- 播放器顶部 -->
            <div class="top">
                <div class="back" @click="hidden"> <i class="icon-back"></i> </div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle" @touchstart.prevent="touchstart" @touchmove.prevent="touchmove" @touchend="touchend">
                <div class="middle-l" ref="middleL">
                    <div class="cd-wrapper" ref="cdWrapper" >
                      <div class="cd" ref="Sbg" :class="cdCls">
                          <img class="image" :src="currentSong.image">
                      </div>
                    </div>
                    <div class="playing-lyric-wrapper">
                      <div class="playing-lyric">{{playingLyric}}</div>  
                    </div>
                </div>
                <m-scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
                    <div class="lyric-wrapper" >
                      <div class="playing-lyric" v-if="currentLyric">
                        <p class="text" v-for="(line,index) in currentLyric.lines" :key="index" ref="lyricLine" :class="{'current':currentLineNum===index}">{{line.txt}}</p>
                      </div>
                    </div>
                </m-scroll>
            </div>
            <div class="bottom">
                <div class="dot-wrapper">
                    <span class="dot" :class="{'active': currentShow ==='cd'}"></span>
                    <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                </div>
                <div class="progress-wrapper">
                    <span class="time time-l">{{format(currentTime)}}</span>
                    <div class="progress-bar-wrapper">
                      <m-progress :percent="percent" @percentChange="onProgressChange"></m-progress>
                    </div>
                    <span class="time time-r">{{format(currentSong.duration)}}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left" > <i :class="iconMode" @click="changeMode"></i> </div>
                    <div class="icon i-left" :class="disableCls"> <i class="icon-prev" @click="prev"></i> </div>
                    <div class="icon i-center" :class="disableCls"> <i  @click="togglePlay" :class="playIcon"></i> </div>
                    <div class="icon i-right" :class="disableCls"> <i class="icon-next" @click="next"></i> </div>
                    <div class="icon i-right"> <i class="icon icon-not-favorite"></i> </div>
                </div>
            </div>
        </div>
        </transition>
        <transition name="mini">
        <!-- [2] 迷你播放器 -->
        <div class="mini-player" v-show="!fullScreen" @click="show">
            <div class="icon" >
                <img :class="cdCls" width="40" height="40" :src="currentSong.image">
            </div>
            <div class="text">
                <h2 class="name" v-html="currentSong.name"></h2>
                <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div class="control">
                <m-circle :percent="percent">
                  <i :class="miniIcon" @click.stop="togglePlay" class="icon-mini"></i>
                </m-circle>
            </div>
            <div class="control">
                <i class="icon-playlist"></i>
            </div>
        </div>
        </transition>
        <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>
<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex'
    import animations from 'create-keyframe-animation'
    import progress from 'base/progress'
    import circle from 'base/circle'
    import {playMode} from 'common/js/config'
    import {shuffle} from 'common/js/util'
    import Lyric from 'lyric-parser'
    import scroll from 'base/scroll'
    import {prefixStyle} from 'common/js/dom'
    const transform = prefixStyle('transform')
    const transitionDuration = prefixStyle('transitionDuration')
    export default {
        data() {
          return {
            songReady: false,
            currentTime: 0,
            currentLyric: null,
            currentLineNum: 0,
            currentShow: 'cd',
            playingLyric: ''
          }
        },
        computed: {
            ...mapGetters([
                'fullScreen',
                'playList',
                'currentSong',
                'playing',
                'currentIndex',
                'mode',
                'sequenceList'
            ]),
            iconMode() {
              return this.mode === 0 ? 'icon-sequence' : this.mode === 1 ? 'icon-loop' : 'icon-random'
            },
            playIcon() {
              return this.playing ? 'icon-pause' : 'icon-play'
            },
            miniIcon() {
              return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
            },
            cdCls() {
              return this.playing ? 'play' : 'play pause'
            },
            disableCls() {
              return this.songReady ? '' : 'disable'
            },
            percent() {
              return this.currentTime / this.currentSong.duration
            }
        },
        created() {
          this.touch = {}
        },
        mounted() {
            //this.$refs.Gbg.style.background = `url(${this.currentSong.image}) 100% 100%/100% 100%`
            //this.$refs.Sbg.style.background = `url(${this.currentSong.image}) 100% 100%/100% 100%`
        },
        methods: {
            hidden() {
                this.setFullScreen(false)
            },
            show() {
                this.setFullScreen(true)
            },
            ...mapMutations({
                setFullScreen:'SET_FULL_SCREEN',
                setPlayingState: 'SET_PLAYING_STATE',
                setCurrentIndex: 'SET_CURRENT_INDEX',
                setPlayMode: 'SET_MODE',
                setPlayList: 'SET_PLAY_LIST'
            }),
            ready() {
                this.songReady = true
            },
            error() {
                this.songReady = true
            },
            end() {
              if(this.mode === 1) {
                this.loop()
              } else {
                this.next()
              }
            },
            loop() {
              this.$refs.audio.currentTime = 0
              this.$refs.audio.play()
              if(this.currentLyric) {
                this.currentLyric.seek(0)
              }
            },
            togglePlay() {
              if(!this.songReady) return false
              this.setPlayingState(!this.playing)
              if(this.currentLyric) {
                this.currentLyric.togglePlay()
              }
            },
            prev() {
              if (!this.songReady) {
                return
              }
              if (this.playList.length === 1) {
                this.loop()
                return
              } else {
                let index = this.currentIndex - 1
                if (index === -1) {
                  index = this.playList.length - 1
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                  this.togglePlaying()
                }
              }
              this.songReady = false
            },
            next() {
              if(!this.songReady) return
              if(this.playList.length === 1) {
                this.loop() 
              } else {
                let index = this.currentIndex + 1
                if(index === this.playList.length) {
                  index = 0
                }
                this.setCurrentIndex(index)
                if(!this.playing) this.togglePlay()
              }
              this.songReady = false
            },
            updateTime(e) {
              this.currentTime = e.target.currentTime
            },
            format(interval) {
              interval = interval | 0
              const minute = interval/60 | 0 
              const second = this._pad(interval%60)
              return `${minute}:${second}`
            },
            _pad(num,n=2) {
              let len = num.toString().length
              while(len < n) {
                num = '0' + num
                len++
              }
              return num
            },
            onProgressChange(percent) {
              this.$refs.audio.currentTime = this.currentSong.duration * percent
              if(!this.playing) {
                this.togglePlay()
              }
              const currentTime = this.currentSong.duration * percent 
              if(this.currentLyric) {
                this.currentLyric.seek(currentTime * 1000)
              }
            },
            changeMode() {
              let mode = (this.mode + 1) % 3
              this.setPlayMode(mode)
              let list = null
              if(mode === 2) {
                 list = shuffle(this.sequenceList)
              } else {
                 list = this.sequenceList
              }
              this._resetCurrentIndex(list)
              this.setPlayList(list)

            },
            _resetCurrentIndex(list) {
              let index = list.findIndex((item)=>{
                return item.id == this.currentSong.id
              })
              this.setCurrentIndex(index)
            },
            getLyric() {
              this.currentSong.getlyric().then((lyric)=>{
                this.currentLyric = new Lyric(lyric,this.handleLyric)
                if(this.playing) {
                  this.currentLyric.play()
                }
              }).catch(()=>{
                this.currentLyric = null
                this.playingLyric = ''
                this.currentLineNum = 0
              })
            },
            handleLyric({lineNum,txt}) {
              this.currentLineNum = lineNum
              if(lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum-5]
                this.$refs.lyricList.scrollToElement(lineEl,1000)

              } else {
                this.$refs.lyricList.scrollTo(0,0,1000)
              }
              this.playingLyric =txt
            },
            touchstart(e) {
              this.touch.initiated = true
              this.touch.startX = e.touches[0].pageX
              this.touch.startY = e.touches[0].pageY
            },
            touchmove(e) {
              if(!this.touch.initiated) return
              let deltaX = e.touches[0].pageX - this.touch.startX
              let deltaY = e.touches[0].pageY - this.touch.startY
              if(Math.abs(deltaY)>Math.abs(deltaX)) return
              const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
              const width = Math.min(0,Math.max(-window.innerWidth,left+deltaX))
              this.touch.percent = Math.abs(width/window.innerWidth)
              this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`
              this.$refs.lyricList.$el.style[transitionDuration] = 0
              this.$refs.middleL.style.opacity = 1 - this.touch.percent
              this.$refs.middleL.style[transitionDuration] = 0
            },
            touchend() {
              let width
              let opacity
              if(this.currentShow === 'cd') {
                if(this.touch.percent > 0.1) {
                  width = -window.innerWidth
                  opacity = 0
                  this.currentShow = 'lyric'
                } else {
                  width = 0
                }
              } else {
                if(this.touch.percent < 0.9) {
                  width = 0
                  this.currentShow = 'cd'
                  opacity = 1
                } else {
                  width = -window.innerWidth
                }
              }
              this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`
              this.$refs.lyricList.$el.style[transitionDuration] = '300ms'
              this.$refs.middleL.style.opacity = opacity
              this.$refs.middleL.style[transitionDuration] = '300ms'
            }
            
        },
        watch: { 
          currentSong(newSong,oldSong) {
            if(!newSong.id) return
            if(newSong.id === oldSong.id) return
            if(this.currentLyric) {
              this.currentLyric.stop()
              this.currentTime = 0
              this.playingLyric = ''
              this.currentLineNum = 0
            }
            clearTimeout(this.timer)
            this.timer=setTimeout(()=>{
              this.$refs.audio.play()
              this.getLyric()
            },1000)
          },
          playing(state) {
            this.$nextTick(()=>{
              state ? this.$refs.audio.play() : this.$refs.audio.pause()
            })
          },
          mode() {

          }
        },
        components: {
          'm-progress': progress,
          'm-circle': circle,
          'm-scroll': scroll
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'
    @import '../../common/stylus/icon.css'
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: #e78848
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: #fff
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text
              font-size: $font-size-medium
              &.current
                color: #fff
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: #fff
        .desc
          no-wrap()
          font-size: $font-size-small
          color: #999
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>

