import Ojsonp from 'jsonp'

export default function(url,data,option) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + encoded(data)
    return new Promise((resolve,reject)=>{
        Ojsonp(url,option,(err,data)=>{
            if(!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}
function encoded(data) {
    var url = ''
    for(let key in data) {
        let value = data[key] !== 'undefine' ? data[key] : ''
        url += `&${key}=${encodeURIComponent(value)}`

        //url += '&' + key + '=' + encodeURIComponent(value)
    }
    return url ? url.substring(1) : ''
}