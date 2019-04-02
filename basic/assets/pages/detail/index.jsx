import React,{ Component } from 'react'
import {observer,inject} from 'mobx-react'

@inject('UI')
@observer
export default class Detail extends Component{
    render(){
        return <div>
                {this.props.params.id}
        </div>
    }
}