import {mapGetters} from 'vuex'
export const playListMixin = {
    computed: {
        ...mapGetters(['playList'])
    },
    mounted() {
        this.handlePlayList(this.playList)
    },
    activeaed() {
        this.handlePlayList(this.playList)
    },
    watch: {
        playList(newVal) {
            this.handlePlayList(newVal)
        }
    },
    methods: {
        handlePlayList() {
            throw new Error('Juetan Error')
        }
    }
}