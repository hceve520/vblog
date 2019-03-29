import React from 'react'
import { Menu, Icon } from 'antd'
import {Link} from 'react-router'


const renderMenu = ({key,link,title,icon,...props}) =>
    <Menu.Item
        key={key||link}
        {...props}
    >
        <Link to={link}>
            {icon && <Icon type={icon} />}
            <span className="nav-text">{title}</span>
        </Link>
    </Menu.Item>


// eslint-disable-next-line react/no-multi-comp
const renderSubMenu = ({key,link,title,icon,sub,...props}) =>
    <Menu.SubMenu
        key={key||link}
        title={
            <span>
                {icon && <Icon type={icon} />}
                <span className="nav-text">{title}</span>
            </span>
        }
        {...props}
    >
    {sub&&sub.map(item=>renderMenu(item))}
    </Menu.SubMenu>


// eslint-disable-next-line react/no-multi-comp
export default ({menus,...props})=>
    <Menu
        {...props} defaultSelectedKeys={[menus[0].key]}
    >
    {menus&&menus.map(item =>
        item.sub&&item.sub.length?renderSubMenu(item):renderMenu(item)
    )}
    </Menu>
