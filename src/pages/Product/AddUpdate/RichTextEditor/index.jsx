import React, { Component } from 'react' 
import { EditorState, convertToRaw, ContentState } from 'draft-js' 
import { Editor } from 'react-draft-wysiwyg' 
import draftToHtml from 'draftjs-to-html' 
import htmlToDraft from 'html-to-draftjs' 
import PropsTypes from 'prop-types'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.less'


export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropsTypes.string
  }

  // state = {
  //   editorState: EditorState.createEmpty(),
  // }

  constructor(props) {
    super(props)
    const html = this.props.detail
    if(html) {
      const contentBlock = htmlToDraft(html)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState,
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty()
      }
    }
  }

 

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  } 

  uploadImgCallback = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:5000/manage/img/upload');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          const url = response.data.url  // 得到图片地址
          resolve({data: {link: url}});
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }


  // 返回输入数据的html格式的文本
  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  render() {
    const { editorState } = this.state 
    return (
      <>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {uploadCallback: this.uploadImgCallback, alt: {present: true, mandatory: true}}
          }}
        />
        </>
    ) 
  }
}