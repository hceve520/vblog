/*
 * @Author: Begisen
 * @Date: 2018-07-26 09:07:27
 * @Content：todo
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { injectIntl, intlShape } from 'react-intl'
import {Link} from 'react-router'
//import cx from 'classnames'

import './index.less'
//import imgSrcTest from 'public/img/test.png'
// import api from '../../api'

@inject('UI')
@observer
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPressed: false,
      isHovered:false
    }
	
	// 通过代理调用后台java服务
    // api.get(`${reqPrefix}/api/singleCycle/listSingleCycle`, {}, null, null).then(result => {
    //   if (result.data.result) {
    //   }
    // })
  }
  componentDidMount() {
    //console.log('sssss:'+reqPrefix);
  }

  render() {
    // var btnClass = cx({
    //   'btn': true,
    //   'btn-pressed':this.state.isPressed ,
    //   'btn-over': !this.state.isPressed && this.state.isHovered
    // });
    return <div className="homeContainer">
      Hello world!
      <Link to="/dot/home2">点击跳转</Link>
    </div>;
  }
}
Home.propTypes={
  intl: intlShape.isRequired
}
export default injectIntl(Home)