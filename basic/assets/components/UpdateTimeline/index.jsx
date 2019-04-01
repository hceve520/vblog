import React,{Component} from 'react'
import {Timeline,Icon} from 'antd'
import './index.less'

export default class UpdateTimeline extends Component{
    render(){
        return <Timeline  pending="to be continued..." mode="alternate" reverse>
                <Timeline.Item>脚手架搭建 2019-03-21</Timeline.Item>
                <Timeline.Item dot={<Icon type="home" style={{ fontSize: '16px' }} />}>首页构建 2019-03-23</Timeline.Item>
                <Timeline.Item dot={<Icon type="user" style={{ fontSize: '16px' }} />} >首页个人信息栏 2019-03-29</Timeline.Item>
                <Timeline.Item dot={<Icon type="clock-circle" style={{ fontSize: '16px' }} />} color="green" >更新日志时间轴 2019-04-01</Timeline.Item>
            </Timeline>
    }
}