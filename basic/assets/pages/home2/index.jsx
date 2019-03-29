/*
 * @Author: Begisen
 * @Date: 2018-07-30 16:54:47
 * @Content：todo
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { injectIntl, intlShape } from 'react-intl'
import Login from '../../components/Login'

import './style/index.less'

@inject('UI')
@observer
class Home2 extends Component {
    componentDidMount() {
    console.log('----Demo componentDidMount-----');
    }

    render() {
        return this.props.UI.isLogin?<Login/>:null
    }
}
Home2.propTypes={
    intl: intlShape.isRequired
}
export default injectIntl(Home2)