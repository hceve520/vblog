'use strict'

import React, { Component } from 'react';
import './index.less'
import { List, Avatar, Icon } from 'antd'
import {Link} from 'react-router'
import gravatar from 'gravatar'


class Article extends Component{
    render(){

        const listData = [];

        const unsecureUrl = gravatar.url('651691638@qq.com', {s: '150', r: 'x', d: 'retro'}, false);

        for (let i = 0; i < 23; i++) {
        listData.push({
            href: `/entry/detail/${i}`,
            title: `ant design part ${i}`,
            avatar: unsecureUrl,
            description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
            content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
        });
        }

        const IconText = ({ type, text }) => (
        <span>
            <Icon style={{ marginRight: 8 }} type={type} />
            {text}
        </span>
        );

        return <List
            dataSource={listData}
            itemLayout="vertical"
            renderItem={item => (
          <List.Item
              actions={[<IconText key={1} text="156" type="star-o" />, <IconText key={2} text="156" type="like-o" />, <IconText key={3} text="2" type="message" />]}
              extra={<img alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" width={272} />}
              key={item.title}
          >
            <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                description={item.description}
                title={<Link to={item.href}>{item.title}</Link>}
            />
            {item.content}
          </List.Item>
        )}
            size="large"
               />
    }
}

export default Article