<template>
    <div class="song-list">
        <ul>
            <li class="item" v-for="(song,key) in songs" :key="key" @click="selectItem(song,key)">
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        songs: {
            type: Array,
            default: []
        }
    },
    methods: {
        getDesc(song) {
            return `${song.singer} - ${song.album}`
        },
        selectItem(item,index) {
            this.$emit('select',item,index)
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'

    .song-list
        .item
            dipslay: flex   
            align-items: center
            box-sizing: border-box
            height: 64px
            font-size: $font-size-medium
            padding: 20px 30px
            .content
                flex: 1
                line-height: 20px
                overflow: hidden
                .name
                    no-wrap()
                    color: $color-text
                    font-size: 16px
                .desc
                    no-wrap()
                    margin-top: 4px
                    color: #999
</style>

