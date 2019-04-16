import { Router, Route, browserHistory } from 'react-router'
import React from 'react'
import Layout from 'components/Layout'
import NotFound from '../public/img/404.jpg'

import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd';




import routeConfig from '../resource/config_route.json'

export default class extends React.Component {
  UNSAFE_componentWillMount(){
    console.log('router 即将挂载');
    this.initRouteHandler();
  }
  initRouteHandler(){
    console.log('初始化参数');
  }
  render () {
    console.log(routeConfig);
    //构造route列表
     const routerItem=[];
     for(let i=0,il=routeConfig.appList.length;i<il;i++){
       let pItem=routeConfig.appList[i];
       let pComponent=(location, cb) => {
          require.ensure([], require => {
            cb(null, require('pages/'+pItem['component']).default)
          }, 'scene_')
        }
       routerItem.push(<Route getComponent={pComponent} key={`routeItem${i}`} path={pItem['path']}/>);
    }

    const getCookie = name => {
      var arr,reg=new RegExp('(^| )'+name+'=([^;]*)(;|$)');
      if(arr && arr==document.cookie.match(reg))
      return unescape(arr[2]);
      else
      return null;
    }

    const returnLanguage = () => {
      let language;
      if(getCookie('et_lang')){
        language = getCookie('et_lang');
      } else if (navigator.languages[0] === 'en'){
        language = 'en-us'
      } else if(navigator.languages[0] === 'zh-CN'){
        language = 'zh-cn'
      } else {
        language = 'zh-cn'
      }
      return language
    }

    const notFound = ()=>(
      <div style={{width: '100%',
        height: '100%',
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center'}}>
        <img style={{    width: '100%',
          maxWidth: '1024px'}}src={NotFound}/>
      </div>
    )

    return (
      <LocaleProvider locale={returnLanguage() === 'zh-cn' ? zhCN : enUS}>
        <Router history={browserHistory}>
        <Route path="/entry">
          <Route component={Layout}>
              {routerItem}
          </Route>
          <Route component={notFound} path="*"/>
        </Route>
        </Router>
      </LocaleProvider>
    )
  }
}
