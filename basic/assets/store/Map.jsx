import { observable, action, configure } from 'mobx'
//import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
//import { observer, inject } from 'mobx-react'
//import { message } from 'antd'

//import api from './../api'

configure({ enforceActions: 'observed' })

class Map {
    @observable mapCenter = '';
    // 设置当前选中菜单
    @action setMapCenter = (mapCenter) => {
      this.mapCenter = mapCenter
    }
}

const map = new Map()

export default map
