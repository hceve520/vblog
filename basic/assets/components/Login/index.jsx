'use strict'

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { injectIntl, intlShape } from 'react-intl'
//import cx from 'classnames'
import './index.less'
import {
  Form, Icon, Input, Button, Checkbox
} from 'antd';
import QueueAnim from 'rc-queue-anim';

@inject('UI')
@observer
class Login extends Component {

  constructor(props){
    super(props)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.UI.updateContent('isLogin',false)
      }
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
        <Form className="login-form" onSubmit={this.handleSubmit}>
           <QueueAnim className="queue-simple"  delay={300}
               ease={['easeOutQuart', 'easeInOutQuart']} type={['right', 'left']}
           >
              <Form.Item key="a" >
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Please input your username!' }]
                })(
                  <Input placeholder="Username" prefix={<Icon style={{ color: 'rgba(0,0,0,.25)' }} type="user" />} />
                )}
              </Form.Item>
              <Form.Item key="b" >
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }]
                })(
                  <Input placeholder="Password" prefix={<Icon style={{ color: 'rgba(0,0,0,.25)' }} type="lock" />} type="password" />
                )}
              </Form.Item>
              <Form.Item key="c" >
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true
                })(
                  <Checkbox className="rememberMe">Remember me</Checkbox>
                )}
                <a className="login-form-forgot" href="">Forgot password</a>
                <Button className="login-form-button" htmlType="submit" type="primary">
                  Log in
                </Button>
                Or <a href="">register now!</a>
              </Form.Item>
          </QueueAnim>
      </Form>
    )
  }
}

Login.propTypes={
  intl: intlShape.isRequired
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

export default injectIntl(WrappedNormalLoginForm)
