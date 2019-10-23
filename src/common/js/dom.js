export function addClass(el,classname) {
    if(hasClass(el,classname)) {
        return
    }
    let newClass = el.className.split(' ')
    newClass.push(classname)
    el.className = newClass.join(' ')
}
export function hasClass(el,classname) {
    let reg= new RegExp('(^/\\s)' + classname + '(\\s/$)')
    return reg.test(el.className)
}

export function getData(el,name,value) {
    const prefix = 'data-'
    name = prefix + name
    if(value) {
        return el.setAttribute(name,value)
    } else {
        return el.getAttribute(name)
    }
}

//能力检测
let elementStyle = document.createElement('div').style
let vendor = (()=>{
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'Otransform',
        ms: 'msTransform',
        standard: 'transform'
    }
    for(let key in transformNames) {
        if(elementStyle[transformNames[key]] != undefined) {
            return key
        }
    }
    return false
})()

export function prefixStyle(style) {
    if(vendor == false) {
        return false
    }
    if(vendor === 'standard') {
        return style
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}