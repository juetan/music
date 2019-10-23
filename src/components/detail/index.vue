<template>
    <transition name="slide">
       <m-list :title='title' :bgImage='bgImg' :songs="songs"></m-list>
    </transition>
</template>
<script>
import {mapGetters} from 'vuex'
import {singer,getSongVkey} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import musicList from '@/components/music-list'
export default {
    data() {
        return {
            songs: []
        }
    },
    computed: {
        title() {
            return this.singer.name
        },
        bgImg() {
            return this.singer.avatar
        },
        ...mapGetters([
            'singer'
        ])
    },
    created() {
        this._getSingerDetail()
    },
    methods: {
        _getSingerDetail() {
            if(!this.singer.id) {
                this.$router.push('./singer')
                return
            }
            singer(this.singer.id).then((res)=>{
                if(res.code == ERR_OK) {
                    this.songs = this._normalizeSongs(res.data.list)
                }
            })
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((item)=>{
                let {musicData} = item
                //三处改动 [1]scr/api/singer.js;  [2]这里;  [3]scr/common/song.js
                getSongVkey(musicData.songmid).then((res)=>{
                    let vkey = res.data.items[0].vkey
                    if(musicData.songid && musicData.albummid) {
                        ret.push(createSong(musicData,vkey))
                    }
                })
                
            })
            return ret
        }
    },
    components: {
        'm-list': musicList
    }
}
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable' 
    .singer-detail
        position: fixed
        z-index: 100
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: $color-background
    .slide-enter-active, .slide-leave-active
        transition: all 1s
    .slide-enter, .slide-leave-to
        transform: translate3d(100%,0,0)
</style>

