<template>
    <m-scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll"> 
        <ul>
            <li class="list-group" v-for="(group,key) in data" :key="key" ref="listgroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li class="list-group-item" v-for="(item,index) in group.data" :key="index" @click="selectItem(item)">
                        <img class="avatar" v-lazy="item.avatar" alt="">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li class="item" :class="{'current': currentIndex == index}" v-for="(item,index) in menu" :key="index" :data-index="index" >{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <div class="fixed-title">{{fixedTitle}}</div>
        </div>
    </m-scroll>
</template>
<script>
    import scroll from 'base/scroll'
    import {getData} from 'common/js/dom'
    const HEIGHT = 18
    export default {
        data() {
            return {
                scrollY: -1,
                currentIndex: 0,
                diff: -1
            }
        },
        props: {
            data: {type: Array, default: []}
        },
        created() {
            this.touch = {},
            this.probeType = 3,
            this.listenScroll = true
            this.heightList = []
        },
        computed: {
            menu() {
                return this.data.map((group)=>{
                    return group.title.substr(0,1)
                })
            },
            fixedTitle() {
                if(this.scrollY > 0) return undefined
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : undefined
            }
        },
        methods: {
            selectItem(item) {
                this.$emit('select',item)
            },
            onShortcutTouchStart(e) {
                let index = getData(e.target,'index')
                this.touch.y1 = e.touches[0].pageY
                this.touch.index = index
                this._scrollTo(index)
            },
            onShortcutTouchMove(e) {
                this.touch.y2 = e.touches[0].pageY
                let delta = (this.touch.y2 - this.touch.y1) / HEIGHT | 0
                let index = parseInt(this.touch.index) + delta
                this._scrollTo(index)
            },
            _scrollTo(index) {
                if(!index && index !=0) return
                if(index < 0) {
                    index = 0
                } else if(index > this.heightList.length -2) {
                    index = this.heightList.length -2
                }
                this.scrollY = -this.heightList[index]
                this.$refs.listview.scrollToElement(this.$refs.listgroup[index],0)
            },
            scroll(pos) {
                this.scrollY = pos.y
            },
            refresh() {  
                this.$refs.listview.refresh()
            },
            _calculateHeight() {
                var height = 0
                this.heightList.push(height)
                for(let i=0; i<this.$refs.listgroup.length; i++) {
                    height += this.$refs.listgroup[i].clientHeight
                    this.heightList.push(height)
                }
            }
        },
        watch: {
            data() {
                setTimeout(()=>{
                    this._calculateHeight()
                },20)
            },
            scrollY(newY) {
                if(newY > 0) {
                    this.currentIndex = 0
                    return
                }
                for(let i=0; i<this.heightList.length; i++) {
                    let height1 = this.heightList[i]
                    let height2 = this.heightList[i+1]
                    if(-newY >= height1 && -newY < height2) {
                        this.currentIndex = i
                        this.diff = height2 + newY
                        return
                    }
                }
                this.currentIndex = this.heightList.length - 2
            },
            diff(newVal) {
                let fixedTop = (newVal>0 && newVal<30) ? newVal - 30 : 0
                if(this.fixedTop == fixedTop) return
                this.fiexedTop = fixedTop
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
        },
        components: {
            'm-scroll': scroll
        }
    }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 90vh
    overflow: hidden
    background: $color-background
    //[1] 歌手列表
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        //color: $color-text-l
        color: #fff
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    //[2]歌手索引
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        //color: $color-text-l
        color: #fff
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>


