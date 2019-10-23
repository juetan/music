import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
    constructor({id,mid,singer,name,album,duration,image,url}) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.album = album
        this.name = name
        this.image = image 
        this.url = url
        this.duration = duration
    }
    getlyric() {
        if(this.lyric) return  Promise.resolve(this.lyric)
        return new Promise((resolve,reject)=>{
            getLyric(this.mid).then((res)=>{
                if(res.code === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    console.log(this)
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })
    }
}
export function createSong(musicData,vkey) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        name: musicData.songname,
        singer: filterSinger(musicData.singer),
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
    })
    
}

function filterSinger(singer) {
    let ret = []
    if(!singer) {
        return ''
    }
    singer.forEach((s)=>{
        ret.push(s.name)
    })
    return ret.join('/')
}

