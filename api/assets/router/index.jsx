import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import React from 'react'
import Layout from 'components/Layout'

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

    const apiForm=(location, cb) => {
      require.ensure([], require => {
        cb(null, require('components/ApiForm').default)
      }, 'scene_')
    }

    return (
      <LocaleProvider locale={returnLanguage() === 'zh-cn' ? zhCN : enUS}>
        <Router history={browserHistory}>
          <Route component={Layout} path="/entry">
            {/* <IndexRoute getComponent={home} /> */}
            {routerItem}
          </Route>
        </Router>
      </LocaleProvider>
    )
  }
}
