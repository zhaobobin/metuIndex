import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './Course.less';

import ArticleSearch from '~/containers/Article/ArticleSearch'
import ArticleListQuery from '~/containers/Article/ArticleListQuery'
import ArticleRank from '~/containers/Article/ArticleRank'
import TagsRank from '~/containers/Tags/TagsRank'

@connect(state => ({
  global: state.global,
}))
export default class Course extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      keyword: "教程",
    }
  }

  render(){

    const {keyword} = this.state;
    const {category} = this.props.global;

    let currentCate = "教程";
    for(let i in category){
      if(keyword === category[i].name){
        currentCate = category[i]._id
      }
    }

    const queryOption = {
      category: currentCate,
      itemsPerPage: 10,                 //每页数量
    };

    return(
      <div className={styles.container}>
        <Row>
          <Col xs={0} sm={0} md={3} lg={5} />

          <Col xs={24} sm={24} md={18} lg={14}>

            <Row className={styles.bg}>
              <Col xs={24} sm={24} md={24} lg={17}>

                <div className={styles.content}>

                  <ArticleSearch/>

                  <ArticleListQuery {...queryOption} />
                </div>

              </Col>
              <Col xs={24} sm={24} md={24} lg={7}>

                <div className={styles.slide}>
                  <ArticleRank/>
                  <TagsRank/>
                </div>

              </Col>
            </Row>

          </Col>

          <Col xs={0} sm={0} md={3} lg={5} />
        </Row>
      </div>
    )
  }

}
