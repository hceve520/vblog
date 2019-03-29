'use strict'

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { injectIntl, intlShape } from 'react-intl'
//import cx from 'classnames'
import './index.less'
import {
  Form, Icon, Input, Button, Checkbox,Modal
} from 'antd';
import { runInAction } from 'mobx';


@inject('UI','EntryIndex')
@observer
class PrefixForm extends Component {

  handleOk = (e) => {
    console.log(e);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.EntryIndex.addPath1(values)
      }
    });
  }

  handleCancel = (e) => {
    console.log(e);
    runInAction(()=>{
      this.props.EntryIndex.showPrefixForm = false
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
          visible={this.props.EntryIndex.showPrefixForm}
      >
        {/* <CodeMirror value={this.state.code} onChange={this.updateCode} options={{lineNumbers:true,mode:'javascript'}}  /> */}
        <Form {...formItemLayout}>
          <Form.Item label="path1">
            {getFieldDecorator('path1', {
              rules: [{ required: true, message: 'path1 is required!' }]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'name is required!' }]
            })(<Input />)}
          </Form.Item>
        </Form>
    </Modal>

    )
  }
}

PrefixForm.propTypes={
  intl: intlShape.isRequired
}

const WrappedNormalPrefixForm = Form.create({ name: 'normal_login' })(PrefixForm);

export default injectIntl(WrappedNormalPrefixForm)
