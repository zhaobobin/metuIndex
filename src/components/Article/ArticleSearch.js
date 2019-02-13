import React from 'react';
import { Input } from 'antd';
import styles from './ArticleSearch.less'

const Search = Input.Search;

export default class ArticleSearch extends React.Component {

  render(){
    return(
      <div className={styles.container}>
        <Search
          placeholder="搜索你需要的教程"
          onSearch={value => console.log(value)}
          size="large"
          style={{ width: '100%' }}
        />
      </div>
    )
  }

}
