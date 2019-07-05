/**
 * 文档
 */
import React from 'react';
import DocContent from '~/blocks/Doc/DocContent'

export default function Doc (props) {

  let pathname = props.location.pathname;
  let keyword = pathname.split('/').slice(1).join('.');

  let url = `/markdown/${keyword}.md`;
  // console.log(url)
  return(
    <DocContent url={url} />
  )

}
