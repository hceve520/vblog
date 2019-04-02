import React ,{ Component } from 'react'
import {observer, inject} from 'mobx-react'
import Sider from '../../components/Sider'
import { Row ,Col,Card,Icon} from 'antd'

@inject('UI')
@observer
export default class About extends Component{

    render(){
        return <div>
        <Row style={{marginTop: 10,marginBottom:10}}>
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
                className="about-wrapper"
                lg={{ span: 16, offset: 1 }}
                md={{ span: 16, offset: 1 }}
                xs={{ span: 24 }}
            >
                <Card bordered={false} style={{ marginBottom: 10 }} title="关于我">
                    <p>你好，我是Owen，本站站长。</p>
                    <p>本站目前由个人维护， 主要记录个人日志。</p>
                    <p>从事前端开发近一年，目前打杂。本站基于开源hc-bee的脚手架开发。</p>
                </Card>
                <Card bordered={false}  title="联系我">
                    <p><Icon type="mail" /> 邮箱： 651691638@qq.com</p>
                    <p><Icon type="github" /> Github： <a href="https://github.com/hceve520/vblog">hceve520</a></p>
                </Card>
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