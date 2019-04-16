'use strict'

const Tools = {
  // ajax (param, suc, err) { //test
  //   const startTime = new Date().getTime()
  //   return apimapAjax(param, suc, err).then((res) => {
  //     const endTime = new Date().getTime()
  //     if (res.code === 200) { // 默认接口请求成功的判断条件，可以自行修改,也可以按照自己约定来做判断
  //       this.log(param.api, true, endTime - startTime, `接口${param.api}调用成功！`)
  //     } else { // 在这里可以统一自定义错误返回码异常处理
  //       this.log(param.api, false, endTime - startTime, `接口${param.api}调用返回码错误！`)
  //       // TODO:接口统一异常处理
  //     }
  //     return res
  //   }).catch((error) => { // 接口异常处理，返回response.status 非20x或者1223时会进入这里
  //     const endTime = new Date().getTime()
  //     this.log(param.api, false, endTime - startTime, `接口${param.api}调用失败！服务端异常！`)
  //     throw new Error(`接口${param.api}调用失败！服务端异常！${error.message}`)
  //   })
  // },
  log (apiName, isSucess, timeDelay, msg) {
    if (window.openRetcode) {
      window.__WPO && window.__WPO.retCode(apiName, isSucess, timeDelay, msg)
    }
  },
  getToken () {
    const $token = document.getElementsByName('_tb_token_')
    return $token.length ? $token[0].value : ''
  },
  isLocal () {
    const host = window.location.host
    return host.indexOf('127.0.0.1') > -1 || host.indexOf('localhost') > -1
  },
  getUrlParam (name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
    const r = decodeURIComponent(window.location.search.substr(1)).match(reg)
    if (r != null) return unescape(r[2])
    return null
  },
  extend (target, source) {
    target = target || {}
    source = source || {}
    for (const key in source) {
      target[key] = source[key]
    }
    return target
  },
  namespace (name) {
    return function (v) {
      return `${name}-${v}`
    }
  },
  getCookie(name){
    var arr,reg=new RegExp('(^| )'+name+'=([^;]*)(;|$)');
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
  
  }
}

export const nameSpace = Tools.namespace.bind(Tools)
export default Tools
