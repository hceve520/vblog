import React,{ Component } from 'react'
import {observer,inject} from 'mobx-react'
import ReactQuill, { Quill } from 'react-quill';
import { ImageDrop } from 'quill-image-drop-module';
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/imageDrop', ImageDrop);
ImageDrop.prototype.handlePaste = function(evt) {
  if (evt.clipboardData && evt.clipboardData.items && evt.clipboardData.items.length) {
      this.readFiles(evt.clipboardData.items, dataUrl => {
          const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
          if (userAgent.indexOf('Firefox') > -1) {
              const selection = this.quill.getSelection();
              if (selection) {
                // we must be in a browser that supports pasting (like Firefox)
                // so it has already been placed into the editor
              } else {
                // otherwise we wait until after the paste when this.quill.getSelection()
                // will return a valid index
                setTimeout(() => this.insert(dataUrl), 0);
              }
         } else {
             setTimeout(() => this.insert(dataUrl), 0);
         }
      });
  }
}


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