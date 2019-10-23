<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bg">
            <div class="play-wrapper">
              <div class="play" v-show="songs.length > 0" ref="randomPlay" @click="random">
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
              </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <m-scroll :data="songs" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll" class="list" ref="list">
            <m-songs :songs="songs" @select="select"></m-songs>
            <div class="loading-container" v-show="!songs.length">
              <m-loading></m-loading>
            </div>
        </m-scroll>
    </div>
</template>
<script>
import Scroll from 'base/scroll'
import songList from 'base/song-list'
import {prefixStyle} from 'common/js/dom'
import loading from 'base/loading'
import {mapActions} from 'vuex'
import {playListMixin} from 'common/js/mixin'
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
    mixins: [playListMixin],
    props: {
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true

    },
    data() {
      return {
        scrollY: 0
      }
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      select(item,index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ]),
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.minY,newY)
        let zindex = 0
        let scale = 1
        let blur = 0
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        const percent = Math.abs(newY / this.imageHeight)
        if(newY > 0) {
          scale = 1 + percent
          zindex = 10
        } else {
          blur = Math.min(20 * percent, 20)
        }
        if(newY < this.minY) {
          zindex = 10
          this.$refs.bg.style.paddingTop = 0
          this.$refs.bg.style.height = '40px'
          this.$refs.randomPlay.style.display = 'none'
        } else {
          this.$refs.bg.style.paddingTop = '70%'
          this.$refs.bg.style.height = 0
          this.$refs.randomPlay.style.display =''
        }
        this.$refs.bg.style.zIndex = zindex
        this.$refs.bg.style[transform] = `scale(${scale})`
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      }
    },
    computed: {
        bgStyle() {
            return `background-image: url(${this.bgImage})`
        }
    },
    mounted() {
        this.imageHeight = this.$refs.bg.clientHeight
        this.minY = -this.imageHeight + 40
        this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    components: {
        'm-scroll': Scroll,
        'm-songs': songList,
        'm-loading': loading
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: #fff
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
