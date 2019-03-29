'use strict'

import React, { Component } from 'react';
import { Layout,Row, Col ,Button,Dropdown,Icon} from 'antd'
import Menu from '../Menu'
import { menus } from '../../constants/menus'
import './index.less'

const { Header } = Layout

class HeaderContainer extends Component{
    constructor(props) {
        super(props)
        this.state = {
          login: false,
          register: false,
          nav: '首页'
        }
    }
    menuClick({key}) {
        this.setState({
          nav: key
        })

      }

    render () {
        const navigator = (
            <Menu
                menus={menus}
                onClick={this.menuClick}
                style={{width: 90, borderRadius: '5%'}}
            />
          )

        return(
            <Header className="header_container">
                <Row>
                    <Col lg={4}  md={4} xs={0}>
                        <div className="logo"></div>
                    </Col>
                    <Col lg={16}  md={16} xs={0} >
                        <Menu menus={menus} mode="horizontal"/>
                    </Col>
                    <Col
                        className="drop-down"
                        lg={{span: 0}}
                        md={{span: 0}}
                        xs={{span: 10}}
                    >
                    <Dropdown overlay={navigator} trigger={['click']}>
                        <div>
                        <Button ghost style={{border: 'none'}} type="primary">
                            {this.state.nav}<Icon type="caret-down" />
                        </Button>
                        </div>
                    </Dropdown>
                    </Col>
                    <Col lg={4} md={4} xs={14} >
                        <div className="button_container">
                        <Button
                            ghost
                            size="small"
                            style={{marginRight: 20}}
                            type="primary"
                        >
                            登录
                        </Button>
                        <Button
                            ghost
                            size="small"
                            type="danger"
                        >
                            注册
                        </Button>
                        </div>
                    </Col>
                </Row>
            </Header>
            )
    }
}

export default HeaderContainer