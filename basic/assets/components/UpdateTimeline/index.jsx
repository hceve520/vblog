import React,{Component} from 'react'
import {Timeline,Icon} from 'antd'
import './index.less'

export default class UpdateTimeline extends Component{
    render(){
        return <Timeline  mode="alternate" pending="to be continued..." reverse>
                <Timeline.Item>脚手架搭建 2019-03-21</Timeline.Item>
                <Timeline.Item dot={<Icon style={{ fontSize: '16px' }} type="home" />}>首页构建 2019-03-23</Timeline.Item>
                <Timeline.Item dot={<Icon style={{ fontSize: '16px' }} type="user" />} >首页个人信息栏 2019-03-29</Timeline.Item>
                <Timeline.Item color="green" dot={<Icon style={{ fontSize: '16px' }} type="clock-circle" />} >更新日志时间轴 2019-04-01</Timeline.Item>
                <Timeline.Item color="green" dot={<Icon style={{ fontSize: '16px' }} type="team" />} >关于页 2019-04-02</Timeline.Item>
            </Timeline>
    }
}