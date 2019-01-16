import React from 'react';
import { connect } from 'dva';
import {Storage, hasErrors, getImgSize, file2base64} from '~/utils/utils';
import styles from './ArticleEditor.less'

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import draftToMarkdown from 'draftjs-to-markdown';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

@connect(state => ({
  global: state.global,
  oss: state.oss,
}))
export default class ArticleEditor extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      editorState: EditorState.createEmpty(),
    }
  }

  componentsDidMount(){

  }

  //监控富文本变化
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState: editorState,
      help: ''
    });
  };

  //检查富文本内容
  checkArticleContent = () => {

  };

  render(){

    const { editorState } = this.state;

    const height = window.innerHeight - 140;

    return(
      <div>
        <Editor
          editorState={editorState}
          toolbarClassName="home-toolbar"
          editorClassName="home-editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              previewImage: true,
              alignmentEnabled: true,
              uploadCallback: this.editorImageUpload,
              inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            }
          }}
          placeholder="请输入正文..."
          spellCheck
          onBlur={this.checkArticleContent}
          localization={{ locale: 'zh' }}
        />
        <style>
          {`
            .home-editor{
              height:${height}px;
              padding:0 20px;
            }
            .home-editor img{max-width:100%;width:auto;height:auto;}
            .rdw-link-modal{height: auto}
            @media screen and (max-width: 1024px){
              .home-editor{height: 400px}
            }
          `}
        </style>
      </div>
    )
  }

}
