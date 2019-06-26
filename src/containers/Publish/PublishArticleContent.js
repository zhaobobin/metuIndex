/**
 * doc: https://draftjs.org/
 * demo: https://jpuri.github.io/react-draft-wysiwyg/#/demo
 */
import React from 'react';
import { connect } from 'dva';
import {Storage, hasErrors, getImgSize, file2base64} from '~/utils/utils';

import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

@connect(state => ({
  global: state.global,
  oss: state.oss,
  publish: state.publish,
}))
export default class PublishArticleContent extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      editorState: EditorState.createEmpty(),
    }
  }

  componentDidMount(){
    this.initContent();
  }

  // 初始化内容
  initContent = () => {
    const { content } = this.props;
    if(!content) return;
    const blocksFromHtml = htmlToDraft(content);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);
    this.setState({
      editorState
    })
  };

  //匹配文章缩略图
  filterImages = str => {
    let images = '';
    let imgReg = /<img.*?(?:>|\/>)/gi;
    let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;  //匹配src属性
    let arr = str.match(imgReg);

    if(arr) images = arr[0].match(srcReg)[1];      //获取图片src
    return images;
  };

  // 监控富文本变化
  onEditorStateChange = (editorState) => {
    let thumb = '',
      content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    if(convertFromHTML(content).contentBlocks === null) content = '';             // 判断内容是否为空
    // console.log(convertFromHTML(content))
    if(content) thumb = this.filterImages(content);

    this.props.dispatch({
      type: 'publish/saveArticleContent',
      payload: {
        content,
        thumb,
      }
    });
    this.setState({
      editorState: editorState,
      help: ''
    });
  };

  // 上传图片
  editorImageUpload = () => {

  }

  uploadImageCallback = (file) => {
    console.log(file);
    let key = this.props.global.currentUser._id + '/photo_' + new Date().getTime() + '.' + file.name.split('.')[1];
    console.log(key)
    return new Promise(
      (resolve, reject) => {
        this.props.dispatch({
          type: 'oss/upload',
          payload: {
            key: key,
            file: file
          },
          callback: (res) => {
            if(res){
              let formDate = {
                data: {link: res}
              }
              resolve(formDate)
            }else{
              reject()
            }
          }
        })
      }
    )
  }

  render(){

    const { editorState } = this.state;

    const height = window.innerHeight - 150;

    return(
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="wysiwyg-wrapper"
          toolbarClassName="home-toolbar"
          editorClassName="home-editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            options: ['inline', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove', 'history'],
            image: {
              previewImage: true,
              alignmentEnabled: true,
              uploadCallback: this.uploadImageCallback,
              inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            }
          }}
          placeholder="请输入正文..."
          spellCheck
          localization={{ locale: 'zh' }}
        />
        <style>
          {`
            .wysiwyg-wrapper * { box-sizing: content-box; }
            .home-toolbar a{
              color: #333;
            }

            .home-editor{
              height: ${height}px;
              padding:0 20px;
            }
            .home-editor img{max-width:100%;width:auto;height:auto;}
            .rdw-link-modal{height: auto}
          `}
        </style>
      </div>
    )
  }

}
