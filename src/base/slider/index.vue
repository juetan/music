<template>
  <div class="slider" ref="slider" >
    <div class="slider-group" ref="sliderGroup">
      <slot> </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: current == index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  //导入添加样式的函数
  import {addClass} from 'common/js/dom'
  //导入better-scroll
  import Scroll from 'better-scroll'

  export default {
    name: 'slider',
    data() {
        return {
            dots: null,
            current: 0,
            children: null
        }
    },
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        autoplay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 4000
        }
    },
    mounted() {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if(this.autoplay) {
          this._play()
        }
        window.addEventListener('resize',()=>{
          if(!this.slider) return
          this._setSliderWidth(true)
          this.slider.refresh()
        })
    },
    methods: {
        _setSliderWidth(isResize) {
            this.children = this.$refs.sliderGroup.children

            let width = 0
            let sliderWidth = this.$refs.slider.clientWidth
            for(let i=0; i<this.children.length; i++) {
                let child = this.children[i]
                addClass(child,'slider-item')
                child.style.width = sliderWidth + 'px'
                width += sliderWidth
            }
            if(this.loop && !isResize) {
                width += 2*sliderWidth
            }
            this.$refs.sliderGroup.style.width = width + 'px'
        },
        _initDots() {
            this.dots = new Array(this.children.length)
        },
        _initSlider() {
            
            this.slider = new Scroll(this.$refs.slider,{
                scrollX: true,
                scrollY: false,
                momentum: false,
                //此处变动，需改为数组的形式
                snap: {
                    loop: this.loop,
                    threshold: 0.3,
                    speed: 400
                },
                click: true
            })
            this.slider.on('scrollEnd',()=>{
                this.current = this.slider.getCurrentPage().pageX
                if(this.autoplay) {
                  clearTimeout(this.timer)
                  this._play()
                }
            })
        },
        _play() {
          var next = (this.current + 1) > 4 ? 0 : this.current + 1
          this.timer = setTimeout(()=>{
            this.slider.goToPage(next,0,400)
          },this.interval)
        }
    },
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
        background: $color-text-ll
</style>


