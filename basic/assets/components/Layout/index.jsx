/*
 * @Author: Begisen
 * @Date: 2018-07-26 09:07:27
 * @Content：todo
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { injectIntl, intlShape } from 'react-intl'
import HeaderContainer from '../../components/HeaderContainer'
import { Layout } from 'antd'

import './index.less'

const {Content,Footer} = Layout

@inject('UI')
@observer
class Home extends Component {

  render() {
    const contentHeight = document.body.clientHeight - 64 -69
    return <div className="homeContainer">
      <Layout>
        <HeaderContainer/>
        <Layout>
          <Content style={{padding: 24, margin: 0, minHeight:contentHeight}}>
            {this.props.children}
          </Content>
        </Layout>
        <Footer style={{ textAlign: 'center' }}>
          Gua Life ©2019 Created by TryHec
        </Footer>
      </Layout>
    </div>;
  }
}
Home.propTypes={
  intl: intlShape.isRequired
}
export default injectIntl(Home)