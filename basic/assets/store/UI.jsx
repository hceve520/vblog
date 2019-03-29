//import { message } from 'antd'
//import api from '../api';
import { observable, action, configure } from 'mobx'

configure({ enforceActions: 'observed' })

class UI {
  // 菜单
  // 设置当前选中菜单
  @action setMenu = (menuId) => {
    this.menuId = menuId
  }

  // 通用的更新数据方法
  @action updateContent = (key, val) => {
    this[key] = val
  }

  @observable isLogin = true
}

const ui = new UI()

export default ui
