'use strict'

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { injectIntl, intlShape } from 'react-intl'
//import cx from 'classnames'
import './index.less'
import {
  Modal,Divider,message as ms
} from 'antd';
import { runInAction } from 'mobx';
import CodeMirror from 'react-codemirror'
import api from '../../api'

require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/display/placeholder');

@inject('UI','EntryIndex')
@observer
class TestApiForm extends Component {

  handleOk = async (e) => {
    const param = this.refs.param.getCodeMirror()
    const result = this.refs.result.getCodeMirror()
    let params = {}
    try{
      params = param.getValue()
      if(params.replace(/(^\s*)|(\s*$)/g, '')==''){
        params='{}'
      }
      const { code,data,message } = await api.get(`${apiPrefix}/api/${this.props.EntryIndex.runPath2.path1}/${this.props.EntryIndex.runPath2.path2}`,eval('('+params+')'))
      if(code=='SUCCESS'){
        result.setValue(JSON.stringify(data,null,2))
      }else{
        ms.error(message)
      }
    }
    catch(err)
    {
      ms.error('参数错误')
    }

  }

  handleCancel = (e) => {
    console.log(e);
    const param = this.refs.param.getCodeMirror()
    const result = this.refs.result.getCodeMirror()
    param.setValue('')
    result.setValue('')
    runInAction(()=>{
      this.props.EntryIndex.showTestApiForm = false
      this.props.EntryIndex.runPath2 = {}
    })
  }

  render () {

    return (
      <Modal
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          title="Test Api"
          visible={this.props.EntryIndex.showTestApiForm}
      >
         <CodeMirror options={{lineNumbers:true,placeholder:'测试入参,默认为{}'}} ref="param" value="{}"  />
         <Divider />
         <CodeMirror options={{lineNumbers:true,placeholder:'结果列表',readOnly:true}} ref="result"  />
    </Modal>

    )
  }
}

TestApiForm.propTypes={
  intl: intlShape.isRequired
}

export default injectIntl(TestApiForm)
