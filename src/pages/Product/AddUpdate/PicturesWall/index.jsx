import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../../../api';
import {BASE_IMG_URL} from '../../../../untils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {

  static propTypes = {
    imgs: PropTypes.array
  }


  constructor (props) {
    super(props)
    let fileList = []
    //如果传入了imgs属性
    const {imgs} = this.props
    if(imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: 'img',
        status: 'done', // 图片状态
        url: BASE_IMG_URL + img
      })
      )
    }
    // 初始化状态
    this.state = {
      previewVisible: false, // 标识大图预览Modal
      previewImage: '', // 大图的url
      fileList,  // 所有已上传图片的数组
    };

  }

  //获取所有已上传文件名的数组
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  // 显示指定file对应的大图
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  //flie:当前操作的图片文件(上传/删除)
  handleChange = async ({file, fileList }) => {
    // 一旦上传成功, 将当前上传的信息修正(name, url)
    if(file.status === 'done') {
      const result = file.response
      if(result.status === 0) {
        message.success('图片上传成功')
        const {name, url} = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('图片上传失败')
      }
    } else if(file.status === 'removed') {
      const name = file.name
      const result = await reqDeleteImg(name)
      if(result.status === 0) {
        message.success('图片删除成功')
      } else {
        message.error('图片删除失败')
      }
    }

    // 在操作过程中更新fileList状态
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          accept='image/*' // 只接收图片格式
          action="http://120.55.193.14:5000/manage/img/upload" // 上传图片的接口地址
          name='image'  //请求参数名
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
