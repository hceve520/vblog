/*
 * @Author: Begisen
 * @Date: 2018-07-30 16:54:47
 * @Content：todo
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import Sider from '../../components/Sider'
import { Row ,Col} from 'antd'

@inject('UI')
@observer
class Home extends Component {
    componentDidMount() {
    console.log('----Demo componentDidMount-----');
    }

    render() {
        return <Row>
                    <Col
                        lg={{ span: 6, offset: 1 }}
                        md={{ span: 6, offset: 1 }}
                        xs={{ span: 0 }}
                    >
                        <Sider />
                    </Col>
                </Row>
    }
}

export default Home