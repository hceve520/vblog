/*
 * @Author: Begisen
 * @Date: 2018-07-30 16:54:47
 * @Content：todo
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import Sider from '../../components/Sider'
import Article from '../../components/Article'
import { Row ,Col} from 'antd'

@inject('UI')
@observer
class Home extends Component {
    componentDidMount() {
    console.log('----Demo componentDidMount-----');
    }

    render() {
        return <div>
                <Row style={{marginTop: 20}}>
                <Col
                    lg={{ span: 0 }}
                    md={{ span: 0 }}
                    xs={{ span: 24 }}
                >
                    <Sider />
                </Col>
                </Row>
                <Row>
                    <Col
                        lg={{ span: 16, offset: 1 }}
                        md={{ span: 16, offset: 1 }}
                        xs={{ span: 24 }}
                    >
                        <Article />
                    </Col>
                    <Col
                        lg={{ span: 6, offset: 1 }}
                        md={{ span: 6, offset: 1 }}
                        xs={{ span: 0 }}
                    >
                        <Sider />
                    </Col>
                </Row>
            </div>
    }
}

export default Home