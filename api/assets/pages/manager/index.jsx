'use strict'

import React, { Component } from 'react';
import { runInAction } from 'mobx'
import { observer, inject } from 'mobx-react'
import { injectIntl, intlShape } from 'react-intl'
//import cx from 'classnames'
import './index.less'
import ApiTable from '../../components/ApiTable'
import ApiForm from '../../components/ApiForm'
import PrefixForm from '../../components/PrefixForm'
import TestApiForm from '../../components/TestApiForm'

import {
    Layout, Menu, Breadcrumb, Icon,Button,message
  } from 'antd';


  const {
    Header, Content, Footer, Sider
  } = Layout;
  const SubMenu = Menu.SubMenu;


@inject('UI','EntryIndex')
@observer
class Manager extends Component {
      constructor(props){
        super(props)
        this.state = {
          collapsed: false
        };
      }

      componentDidMount(){
        this.props.EntryIndex.getPath1()
      }


      onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
      }

      handleAdd = () => {
        if(Object.keys(this.props.EntryIndex.clickMenu).length==0){
          message.error('先选择左侧一级路径')
          return
        }
        runInAction(()=>{
          this.props.EntryIndex.showForm=true
        })
      }

      handlePathAdd = () => {
        runInAction(()=>{
          this.props.EntryIndex.showPrefixForm=true
        })
      }

      clikcMenu = (item) => {
        runInAction(()=>{
          this.props.EntryIndex.clickMenu = item
          this.props.EntryIndex.getPath2()
        })
      }

      render() {

        const { path1 } = this.props.EntryIndex

        let menuList = []
        const _this = this;
        path1.map((item,index)=>{
          menuList.push(
            <Menu.Item key={index} onClick={_this.clikcMenu.bind(this,item)}>
              <Icon type="desktop" />
              <span>{item.name}</span>
            </Menu.Item>
          )
        })

        const PandaSvg = () => (
          <svg fill="currentColor" height="1em" viewBox="0 0 1024 1024"
              width="1em"
          >
            <path d="M99.096 315.634s-82.58-64.032-82.58-132.13c0-66.064 33.032-165.162 148.646-148.646 83.37 11.91 99.096 165.162 99.096 165.162l-165.162 115.614zM924.906 315.634s82.58-64.032 82.58-132.13c0-66.064-33.032-165.162-148.646-148.646-83.37 11.91-99.096 165.162-99.096 165.162l165.162 115.614z" fill="#6B676E"  />
            <path d="M1024 561.548c0 264.526-229.23 429.42-512.002 429.42S0 826.076 0 561.548 283.96 66.064 512.002 66.064 1024 297.022 1024 561.548z" fill="#FFEBD2"  />
            <path d="M330.324 842.126c0 82.096 81.34 148.646 181.678 148.646s181.678-66.55 181.678-148.646H330.324z" fill="#E9D7C3"  />
            <path d="M644.13 611.098C594.582 528.516 561.55 512 512.002 512c-49.548 0-82.58 16.516-132.13 99.096-42.488 70.814-78.73 211.264-49.548 247.742 66.064 82.58 165.162 33.032 181.678 33.032 16.516 0 115.614 49.548 181.678-33.032 29.18-36.476-7.064-176.93-49.55-247.74z" fill="#FFFFFF"  />
            <path d="M611.098 495.484c0-45.608 36.974-82.58 82.58-82.58 49.548 0 198.194 99.098 198.194 165.162s-79.934 144.904-148.646 99.096c-49.548-33.032-132.128-148.646-132.128-181.678zM412.904 495.484c0-45.608-36.974-82.58-82.58-82.58-49.548 0-198.194 99.098-198.194 165.162s79.934 144.904 148.646 99.096c49.548-33.032 132.128-148.646 132.128-181.678z" fill="#6B676E"  />
            <path d="M512.002 726.622c-30.06 0-115.614 5.668-115.614 33.032 0 49.638 105.484 85.24 115.614 82.58 10.128 2.66 115.614-32.944 115.614-82.58-0.002-27.366-85.556-33.032-115.614-33.032z" fill="#464655"  />
            <path d="M330.324 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z" fill="#464655"  />
            <path d="M693.678 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z" fill="#464655"  />
          </svg>
        );

        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => { console.log(broken); }}
                onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
            >
              <div className="sider_logo" >
                <Icon component={PandaSvg} style={{ fontSize: '20px' }} />
              </div>
              <Menu mode="inline" theme="dark">
                {menuList}
              </Menu>
              <div className="plus_button">
                <Button onClick={this.handlePathAdd} ><Icon type="plus"/></Button>
              </div>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }} />
              <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>gua</Breadcrumb.Item>
                  <Breadcrumb.Item>{this.props.EntryIndex.clickMenu.prefix}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                  <Button onClick={this.handleAdd} style={{ marginBottom: 16 }} type="primary">
                    Add a row
                  </Button>
                  <ApiTable/>
                  <ApiForm visible={this.props.EntryIndex.showForm}/>
                  <PrefixForm visible={this.props.EntryIndex.showPrefixForm}/>
                  <TestApiForm visible={this.props.EntryIndex.showTestApiForm}/>
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                Gua Api ©2019 Created by TryHec
              </Footer>
            </Layout>
          </Layout>
        );
      }
}


Manager.propTypes={
    intl: intlShape.isRequired
}

export default injectIntl(Manager)