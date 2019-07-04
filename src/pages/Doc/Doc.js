/**
 * 文档
 */
import React from 'react';
import 'github-markdown-css';

import DocContent from '~/blocks/Doc/DocContent'

export default function Doc (props) {

  let pathname = props.location.pathname;
  let keyword = '';
  if(pathname.split('/').length === 3){
    keyword = pathname.split('/')[2]
  }else{
    keyword = pathname.split('/')[2] + '.' + pathname.split('/')[3]
  }
  // console.log(keyword)

  let url = `./markdown/${keyword}.md`;

  return(
    <DocContent url={url} />
  )

}
