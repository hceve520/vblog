import { message  as ms } from 'antd'
import api from '../api';
import { observable, action, configure,runInAction,toJS } from 'mobx'

configure({ enforceActions: 'observed' })

class EntryIndex {
  @observable showForm = false

  @observable showPrefixForm = false

  @observable showTestApiForm = false

  @observable path1 = []

  @observable clickMenu = {}

  @action getPath1 = async() =>{
    const { code , data,message  } = await api.get(`${apiPrefix}/api/get_path1`)
    if(code=="SUCCESS"){
      runInAction(()=>{
        this.path1 = data
      })
    }
  }

  @action addPath1 = async(param) =>{
    const { code , data,message } = await api.get(`${apiPrefix}/api/add_path1`,param)
    if(code=="SUCCESS"){
      runInAction(()=>{
        this.showPrefixForm = false
        this.getPath1()
      })
    }else{
      ms.error(message)
    }
  }

  @action addPath2 = async(param) =>{
    const { code , data,message } = await api.post(`${apiPrefix}/api/add_path2`,param)
    if(code=="SUCCESS"){
      runInAction(()=>{
        this.showForm = false
        this.clickPath2 = {}
        this.getPath2()
      })
    }else{
      ms.error(message)
    }
  }

  @action deletePath2 = async(id) =>{
    const { code , data,message } = await api.get(`${apiPrefix}/api/delete_path2`,{
      'id':id
    })
    if(code=="SUCCESS"){
      runInAction(()=>{
        this.getPath2()
      })
    }else{
      ms.error(message)
    }
  }

  @observable path2List = []

  @action getPath2 = async() =>{

    const { code , data,message } = await api.get(`${apiPrefix}/api/get_path2`,{
      'path1':this.clickMenu.prefix
    })

    if(code=="SUCCESS"){
      runInAction(()=>{
        this.path2List = data
        // this.getPath1()
      })
    }else{
      ms.error(message)
    }
  }

  @observable clickPath2 = {}
}

const entryIndex = new EntryIndex()

export default entryIndex
