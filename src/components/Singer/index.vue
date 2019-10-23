<template>
    <div class="singer" ref="singer">
        <m-list :data="singers" @select="selectSinger" ref="list"></m-list>
        <router-view></router-view>
    </div>
</template>
<script>
import {getSinger} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import listview from 'base/listview'
import {mapMutations} from 'vuex'
import {playListMixin} from 'common/js/mixin'
export default {
    mixins: [playListMixin],
    data() {
        return {
            singers: []
        }
    },
    created() {
        this._getSingerList()
        
    },
    methods: {
        selectSinger(singer) {
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        _getSingerList() {
            getSinger().then((res)=>{
                if(res.code == ERR_OK) { this.singers= this._normalizeSinger(res.data.list) }
            })
        },
        _normalizeSinger(list) {
            var map = {
                hots: {
                    title: '热门',
                    data: []
                }
            }
            list.forEach((item,index)=>{
                if(index < 10) {
                    map.hots.data.push(new Singer(item.Fsinger_mid,item.Fsinger_name))
                }
                if(!map[item.Findex]) {
                    map[item.Findex] = {
                        title: item.Findex,
                        data: []
                    }
                }
                map[item.Findex].data.push(new Singer(item.Fsinger_mid,item.Fsinger_name))
            })
            
            //序列化数据
            var hots = []
            var list = []
            for(let key in map) {
                let item = map[key]
                if(/[a-zA-Z]/.test(item.title)) {
                    list.push(item)
                } else if(item.title == '热门') {
                    hots.push(item)
                }
            }
            list.sort((a,b)=>{
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hots.concat(list)
        },
        handlePlayList(playList) {
            const bottom = playList.length > 0 ? '60px' : ''
            console.log(this.$refs.singer)
            this.$refs.singer.style.bottom = bottom
            this.$refs.list.refresh()
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    },
    components: {
        'm-list': listview
    }
}
</script>
<style lang="stylus" scoped>
    .singer
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
</style>