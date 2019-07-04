/**
 * 文档 - 内容
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';
// import codeBlock from './CodeBlock';
import 'github-markdown-css';

export default class DocContent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      detail: ''
    }
  }

  componentDidMount(){
    let url = this.props.url;
    this.getMarkdown(url);
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.url !== this.props.url){
      let url = nextProps.url;
      this.getMarkdown(url);
    }
  }

  getMarkdown(url){
    fetch(url)
    .then(res => res.text())
    .then(text => {
      this.setState({ detail: text })
    });
  }

  render(){

    const { detail } = this.state;

    return(
      <ReactMarkdown
        className="markdown-body"
        source={detail}
        escapeHtml={false}
        // renderers={{
        //   code: codeBlock,
        // }}
      />
    )
  }

}
