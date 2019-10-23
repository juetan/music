<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="touchstart" @touchmove.prevent="touchmove" @touchend="touchend">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'
  const transform = prefixStyle('transform')

  export default {
    props:  {
        percent: {
            type: Number,
            default: 0
        }
    },
    created() {
        this.touch = {}
    },
    methods: {
        touchstart(e) {
            this.touch.initiated = true
            this.touch.startX = e.touches[0].pageX
            this.touch.left = this.$refs.progress.clientWidth
        },
        touchmove(e) {
            if(!this.touch.initiated) return
            const deltaX = e.touches[0].pageX - this.touch.startX
            const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - 16,Math.max(0,this.touch.left + deltaX))
            this._offset(offsetWidth)
        },
        touchend(e) {
            this.touch.initiated = false
            this._triggerPercent()
        },
        _offset(offsetWidth) {
            this.$refs.progress.style.width = offsetWidth + 'px'
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        },
        _triggerPercent() {
            let barWidth = this.$refs.progressBar.clientWidth - 16
            const percent = this.$refs.progress.clientWidth / barWidth
            this.$emit('percentChange',percent)
        },
        progressClick(e) {
            const rect = this.$refs.progressBar.getBoundingClientRect()
            const offsetWidth = e.pageX - rect.left
            this._offset(offsetWidth)
            this._triggerPercent()
        }
    },
    watch: {
        percent(newPercent) {
            if(newPercent >=0 && !this.touch.initiated) {
                //let barWidth = this.$refs.progressBar.clientWidth - 16
                let barWidth = window.innerWidth * 0.8 - 60 - 16
                let btnWidth = barWidth * newPercent
                this._offset(btnWidth)
            }
        }   
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid #fff
          border-radius: 50%
          background: $color-theme
</style>