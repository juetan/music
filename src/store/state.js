import {playMode} from 'common/js/config'
const state = {
    singer: {},
    //播放器状态
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1
}
export default state