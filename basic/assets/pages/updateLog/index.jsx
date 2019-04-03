import React,{Component} from 'react'
import { observer, inject } from 'mobx-react'
import { Row ,Col} from 'antd'
import UpdateTimeline from '../../components/UpdateTimeline'
import Sider from '../../components/Sider'

@inject('UI')
@observer
export default class UpdateLog extends Component{

    componentDidMount() {
        console.log('----Demo componentDidMount-----');
        }

        render() {
            return<div>
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
                    <Col  lg={{ span: 16, offset: 1 }}
                        md={{ span: 16, offset: 1 }}
                        style={{paddingTop:20}}
                        xs={{ span: 24 }}
                    >
                        <UpdateTimeline />
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