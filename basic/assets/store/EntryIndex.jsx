//import { message } from 'antd'
import api from '../api';
import { observable, action, configure,runInAction,toJS } from 'mobx'

configure({ enforceActions: 'observed' })

class EntryIndex {
  @observable selected = 'area_330212'

  @action setSelected=(selected)=>{
    this.selected = selected
  }

  @observable speed = {}

  @observable flow = {}

  @observable saturation = {}

  @observable service = {}

  @observable imbalance = {}

  @action qryAreaIndex = async () => {
    const{isError,data} = await api.get(`${reqPrefix}/entryService/qryAreaIndex`,{
      'areaId':this.selected
    })
    if(!isError){
      runInAction(()=>{
        this.speed = data.speed
        this.flow = data.flow
        this.saturation = {}
        this.service = {}
        this.imbalance = {}
        data.saturation.map((item)=>{
          let temp = this.formatSaturation(item.intersection_satur)
          this.saturation[temp]?this.saturation[temp]=this.saturation[temp]+1:this.saturation[temp]=1
          this.service[item.service_index]?this.service[item.service_index]=this.service[item.service_index]+1:this.service[item.service_index]=1
        })
        data.imbalance.map((item)=>{
          let temp = this.formatImbalance(item.imbalance_level)
          this.imbalance[temp]?this.imbalance[temp]=this.imbalance[temp]+1:this.imbalance[temp]=1
        })
      })
    }
  }

  formatSaturation = (item) =>{
    if(item>=0 && item<0.4){
      return 'low'
    }else if(item>=0.4 && item<0.8){
      return 'middle'
    }else{
      return 'high'
    }
  }

  formatImbalance = (item) =>{
    if(item=='A' || item=='B'){
      return 'low'
    }else if(item=='C' || item=='D'){
      return 'middle'
    }else{
      return 'high'
    }
  }

  @observable startIndex = 0

  @observable endIndex = 4
}

const entryIndex = new EntryIndex()

export default entryIndex
