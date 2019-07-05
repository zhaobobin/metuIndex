/**
 * 文档 - 代码块
 */
import React from 'react';
import { Form } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'

class CodeBlock extends React.PureComponent {
  render() {
    const { value } = this.props;

    return (
      <SyntaxHighlighter language="" style={style}>
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default Form.create()(CodeBlock);
