'use strict'

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react'
import { injectIntl, intlShape } from 'react-intl'
//import cx from 'classnames'
import './index.less'
import {
  Table, Divider, Popconfirm,Icon
} from 'antd';
import { runInAction } from 'mobx';

@inject('UI','EntryIndex')
@observer
class ApiTable extends Component {


  runPath2 = (record) => {
    runInAction(()=>{
      this.props.EntryIndex.runPath2 = record
      this.props.EntryIndex.showTestApiForm = true
    })
  }

  editPath2 = (record) => {
    runInAction(()=>{
      this.props.EntryIndex.clickPath2 = record
      this.props.EntryIndex.showForm = true
    })
  }

  render () {
    const columns = [{
      title: '一级路径',
      dataIndex: 'path1',
      key: 'path1'
    }, {
      title: '二级路径',
      dataIndex: 'path2',
      key: 'path2'
    }, {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '执行操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={this.runPath2.bind(this,record)} title="run">
          <Icon type="caret-right" />
          </a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={this.editPath2.bind(this,record)} title="edit">
            <Icon type="edit"/>
          </a>
          <Divider type="vertical" />
          <Popconfirm cancelText="No" okText="Yes" onConfirm={this.props.EntryIndex.deletePath2.bind(this,record.id)}
              title="Are you sure delete this api?"
          >
          <a href="javascript:;" title="delete">
            <Icon type="delete"/>
          </a>
          </Popconfirm>
        </span>
      )
    }];

    const { path2List } = this.props.EntryIndex
    let data = []
    path2List.map((item,index)=>{
      item.key = index
      data.push(item)
    })

    return (
      <Table columns={columns} dataSource={data} />
    )
  }
}

ApiTable.propTypes={
  intl: intlShape.isRequired
}

export default injectIntl(ApiTable)
