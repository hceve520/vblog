import React,{Component} from 'react'
import { observer, inject } from 'mobx-react'
import { Row ,Col} from 'antd'
import UpdateTimeline from '../../components/UpdateTimeline'

@inject('UI')
@observer
export default class UpdateLog extends Component{

    componentDidMount() {
        console.log('----Demo componentDidMount-----');
        }
    
        render() {
            return <Row>
                    <Col
                            lg={{ span: 12, offset: 1 }}
                            md={{ span: 12, offset: 1 }}
                            xs={{ span: 0 }}
                        >
                        <UpdateTimeline />
                    </Col>
                    <Col
                            lg={{ span: 0 }}
                            md={{ span: 0 }}
                            xs={{ span: 24 }}
                        >
                        <UpdateTimeline />
                    </Col>
                </Row>
        }
}