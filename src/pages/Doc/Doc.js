/**
 * 文档
 */
import React from 'react';
import DocContent from '~/blocks/Doc/DocContent'

export default function Doc (props) {

  let pathname = props.location.pathname;
  let keyword = pathname.split('/').slice(1).join('.');
  console.log(keyword)

  let url = `./markdown/${keyword}.md`;

  return(
    <DocContent url={url} />
  )

}
