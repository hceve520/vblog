import React,{ Component } from 'react'
import {observer,inject} from 'mobx-react'
import ReactQuill, { Quill } from 'react-quill';
import { ImageDrop } from 'quill-image-drop-module';
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/imageDrop', ImageDrop);

@inject('UI')
@observer
export default class Detail extends Component{
    constructor(props) {
        super(props)
        this.state = { text: '' } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
        this.modules = {
            toolbar: {
              container:  [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote','code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image'],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
              ]
            },
            imageDrop: true
          }
      }
    handleChange(value) {
        this.setState({ text: value })
      }

    render(){
        return <div>
                {this.props.params.id}
                <ReactQuill modules={this.modules}
                    onChange={this.handleChange} value={this.state.text}
                />
        </div>
    }
}