import React from 'react';
import { connect } from 'dva';
import Storage from '@/utils/storage';
import { hasErrors, getImgSize, file2base64 } from '@/utils/utils';

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

@connect(state => ({
  global: state.global,
  oss: state.oss,
  publish: state.publish,
}))
export default class ArticleEditor extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      editorState: EditorState.createEmpty(),
    }
  }

  componentDidMount(){

  }

  //监控富文本变化
  onEditorStateChange = (editorState) => {
    this.props.dispatch({
      type: 'publish/saveArticleContent',
      payload: {
        content: draftToHtml(convertToRaw(editorState.getCurrentContent()))
      }
    });
    this.setState({
      editorState: editorState,
      help: ''
    });
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
