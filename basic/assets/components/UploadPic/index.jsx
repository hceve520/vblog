import React,{Component} from 'react'
import {injectIntl,intlShape} from 'react-intl'
import { Upload, Icon, message } from 'antd';
import './index.less'
import utils from '../../utils'

class UploadPic extends Component{

    constructor(props){
        super(props)
        this.state = {
            loading: false
        }
    }

    getBase64 = (img, callback) =>{
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload = (file) =>{
        // image/png, image/jpeg, image/jpg
        const isJPG = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg';
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            message.error('Image must smaller than 5MB!');
        }
        return isJPG && isLt2M;
    }

        handleChange = (info) => {
            if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
            }
        }

      handleSuccess = (res,file) => {
        this.getBase64(file, imageUrl => this.setState({
            imageUrl,
            loading: false
          }));
      }


    render(){
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">添加题图</div>
            </div>
          );
          const imageUrl = this.state.imageUrl;
          const data = {
            token: utils.getCookie('qntoken')
          }
        return <Upload
            accept="image/png, image/jpeg, image/jpg"
            action="http://upload-z2.qiniup.com"
            beforeUpload={this.beforeUpload}
            className="uploader"
            data={data}
            listType="picture-card"
            onChange={this.handleChange}
            onSuccess={this.handleSuccess}
            showUploadList={false}
               >
        {imageUrl ? <img alt="题图" src={imageUrl} style={{width:'100%'}} /> : uploadButton}
      </Upload>
    }
}

UploadPic.propTypes = {intl:intlShape.isRequired}
export default injectIntl(UploadPic)