'use strict'

import React, { Component } from 'react';
import './index.less'
import gravatar from 'gravatar'
import { Card,Tag } from 'antd'

class Sider extends Component{
    render(){
        const unsecureUrl = gravatar.url('651691638@qq.com', {s: '150', r: 'x', d: 'retro'}, false);

        return(
        <div className="sider_container">
            <div className="user_info">
                <img className="user_pic" src={unsecureUrl}/>
                <p className="user_name">Owen</p>
                <p className="user_desc">活在天朝，有理想的程序员</p>
            </div>
            <div className="user_tag">
                <Card bordered={false} title="标签">
                    <div className="tags-content">
                        <Tag color="blue">90后</Tag>
                        <Tag color="purple">技术宅</Tag>
                    </div>
                </Card>
            </div>
        </div>
        )
    }
}

export default Sider