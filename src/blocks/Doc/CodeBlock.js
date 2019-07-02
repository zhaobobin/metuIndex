/**
 * 文档 - 代码块
 */
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Form } from 'antd';

class CodeBlock extends React.PureComponent {
  render() {
    const { value } = this.props;

    return (
      <SyntaxHighlighter language="" style={github}>
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default Form.create()(CodeBlock);
