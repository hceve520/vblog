import React,{Component} from 'react'
import {injectIntl,intlShape} from 'react-intl'
import {Input,Row, Col} from 'antd'
import Editor from '../../components/Editor'
import UploadPic from '../../components/UploadPic'

class Write extends Component{
    render(){
        return <div>
                    <Row>
                        <Col
                            lg={{ span: 10, offset: 7 }}
                            md={{ span: 10, offset: 7 }}
                            xs={{ span: 24 }}
                        >
                            <UploadPic/>
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            lg={{ span: 10, offset: 7 }}
                            md={{ span: 10, offset: 7 }}
                            xs={{ span: 24 }}
                        >
                            <Input placeholder="请输入标题（最多 50 个字）" size="large" style={{background:'#f0f2f5',height:'60px', fontSize: '32px'}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            lg={{ span: 10, offset: 7 }}
                            md={{ span: 10, offset: 7 }}
                            xs={{ span: 24 }}
                        >
                            <Editor/>
                        </Col>
                    </Row>

                </div>
    }
}

Write.propTypes = {intl: intlShape.isRequired}
export default injectIntl(Write)
