'use strict'

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { injectIntl, intlShape } from 'react-intl'
//import cx from 'classnames'
import './index.less'
import {
  Form, Input,Modal
} from 'antd';
import { runInAction } from 'mobx';
import CodeMirror from 'react-codemirror'

require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript');


@inject('UI','EntryIndex')
@observer
class ApiForm extends Component {

  constructor(props){
    super(props)
    this.state={
      num:1
    }
  }

  handleOk = (e) => {
    console.log(e);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if(this.props.EntryIndex.clickPath2){
          values.id = this.props.EntryIndex.clickPath2.id
        }
        this.props.form.resetFields()
        this.props.EntryIndex.addPath2(values)
      }
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.props.form.resetFields()
    runInAction(()=>{
      this.props.EntryIndex.clickPath2 = {}
      this.props.EntryIndex.showForm = false
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };

    return (
      <Modal
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          title="Basic Api"
          visible={this.props.EntryIndex.showForm}
      >
      <div className="apiForm">
        {/* <CodeMirror value={this.state.code} onChange={this.updateCode} options={{lineNumbers:true,mode:'javascript'}}  /> */}
        <Form {...formItemLayout}>
          <Form.Item key={1} label="一级路径">
            {getFieldDecorator('path1', {initialValue:this.props.EntryIndex.clickMenu.prefix
            })(<Input disabled/>)}
          </Form.Item>
          <Form.Item key={2} label="二级路径">
            {getFieldDecorator('path2', {initialValue:this.props.EntryIndex.clickPath2.path2?this.props.EntryIndex.clickPath2.path2:'',
              rules: [{ required: true, message: 'path2 is required!' }]
            })(<Input />)}
          </Form.Item>
          <Form.Item key={3} label="接口名称">
            {getFieldDecorator('name', {initialValue:this.props.EntryIndex.clickPath2.name?this.props.EntryIndex.clickPath2.name:''
            })(<Input />)}
          </Form.Item>
          <Form.Item key={4} label="执行语句">
            {getFieldDecorator('statement', {initialValue:this.props.EntryIndex.clickPath2.statement?this.props.EntryIndex.clickPath2.statement:'',
              rules: [{ required: true, message: 'statement is required!' }]
            })(<CodeMirror options={{lineNumbers:true,mode:'javascript'}}   />)}
          </Form.Item>
          <Form.Item key={5} label="数据处理">
            {getFieldDecorator('pre', {initialValue:this.props.EntryIndex.clickPath2.pre?this.props.EntryIndex.clickPath2.pre:'',
              rules: [{ required: true, message: 'pre is required!' }]
            })( <CodeMirror options={{lineNumbers:true,mode:'javascript'}}  />)}
          </Form.Item>
        </Form>
    </div>
    </Modal>

    )
  }
}

ApiForm.propTypes={
  intl: intlShape.isRequired
}

const WrappedNormalApiForm = Form.create({ name: 'normal_login' })(ApiForm);

export default injectIntl(WrappedNormalApiForm)
