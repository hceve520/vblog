import React,{Component} from 'react'
import {Timeline,Icon} from 'antd'
import './index.less'

export default class UpdateTimeline extends Component{
    render(){
        return <Timeline  mode="alternate" pending="to be continued..." reverse>
                <Timeline.Item>脚手架搭建 2019-03-21</Timeline.Item>
                <Timeline.Item dot={<Icon style={{ fontSize: '16px' }} type="home" />}>首页构建 2019-03-23</Timeline.Item>
                <Timeline.Item dot={<Icon style={{ fontSize: '16px' }} type="user" />} >新增个人信息栏 2019-03-29</Timeline.Item>
                <Timeline.Item color="green" dot={<Icon style={{ fontSize: '16px' }} type="clock-circle" />} >新增日志时间轴 2019-04-01</Timeline.Item>
                <Timeline.Item color="green" dot={<Icon style={{ fontSize: '16px' }} type="team" />} >新增关于页 2019-04-02</Timeline.Item>
                <Timeline.Item color="green" dot={<Icon style={{ fontSize: '16px' }} type="tool" />} >引入nprogress 2019-04-02</Timeline.Item>
                <Timeline.Item color="green" dot={<Icon style={{ fontSize: '16px' }} type="tool" />} >新增富文本 2019-04-04</Timeline.Item>
            </Timeline>
    }
}