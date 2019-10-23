<template>
  <div class="recommend">
      <m-scroll class="scroll" :data="list" ref="scroll">
        <div>
          <m-slider v-if="imgs">
            <div v-for="(item,index) in imgs" :key="index">
                <img :src="item.picUrl" alt="">
            </div>
          </m-slider>
          <div class="list">
              <h1 class="title">热门歌单推荐</h1>
              <ul>
                <li class="item" v-for="(item,key) in list" :key="key">
                  <div class="icon">
                    <img v-lazy="item.imgurl" @load="imgLoaded" alt="" width="60" height="60">
                  </div>
                  <div class="text">
                    <h2 class="name">{{item.creator.name}}</h2>
                    <p class="description">{{item.dissname}}</p>
                  </div>
                </li>
              </ul>
              <m-loading v-if="!list"></m-loading>
          </div>
        </div>
      </m-scroll>
  </div>
</template>
<script>
//导入获取数据的函数
import { getRecommend , getDiscList} from "api/recommend"
//导入获取数据的函数
import { ERR_OK } from "api/config"
//导入轮播图
import slider from 'base/slider'
import scroll from 'base/scroll'
import loading from 'base/loading'
export default {
  data() {
    return {
      name: "绝弹音乐",
      imgs: null,
      list: null
    };
  },
  //实例创建后的钩子函数
  created() {
    this._getRecommend();
    this._getDiscList()
  },
  //实例方法
  methods: {
    _getRecommend() {
      getRecommend().then((res)=>{
          if(res.code == ERR_OK) {
              this.imgs = res.data.slider
          }
      })
    },
    _getDiscList() {
      getDiscList().then((res)=>{
          if(res.code == ERR_OK) {
              setTimeout(()=>{
                this.list = res.data.list
              },2000)
          }
      })
    },
    imgLoaded() {
      if(!this.checkloaded) {
        this.$refs.scroll.refresh()
        this.checkloaded = true
      }
    }
  },
  components: {
      'm-slider': slider,
      'm-scroll': scroll,
      'm-loading': loading
  }
};
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'

.recommend
  .scroll
    height: 90vh
    overflow: hidden
    .list
      .title
        height: 65px
        line-height: 65px
        text-align: center
        color: $color-theme
        background: $font-size-medium
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          margin-right: 20px
          border-radius: 2px
          overflow: hidden
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text-d
          .description
            color: $color-text-i

</style>



