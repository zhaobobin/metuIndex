/**
 * 文档
 */
import React from 'react';
import 'github-markdown-css';

import DocContent from '~/blocks/Doc/DocContent'

export default function Doc (props) {

  let pathname = props.location.pathname;
  let keyword = pathname.split('/')[2];
  let url = `src/pages/Doc/${keyword}.md`;

  return(
    <DocContent url={url} />
  )

}
