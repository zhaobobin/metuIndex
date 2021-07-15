/*
 * 文章详情
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, notification } from 'antd';
import { goBack } from '@/utils/utils';
import { ENV } from '@/utils';
import styles from './ArticleDetail.less';

import Loading from '@/components/Common/Loading';
import ArticleDetailShow from '@/blocks/Article/ArticleDetailShow';
import CommentList from '@/blocks/Comments/CommentList';

@connect(state => ({
  global: state.global,
}))
export default class ArticleDetail extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      detail: '',													                                      //文章详情
    };
  }

  componentDidMount(){
    let id = this.props.match.params.id;
    this.queryArticleDetail(id);
  }

  //处理用户登录、退出时，重新渲染文章数据
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.match.params.id !== this.props.match.params.id){
      let id = nextProps.match.params.id;
      this.queryArticleDetail(id);
    }
  }

  queryArticleDetail = (id) => {
    this.props.dispatch({
      type: 'global/request',
      url: `/articles/${id}`,
      method: 'GET',
      payload: {},
      callback: (res) => {
        if(res.code === 0){
          window.scrollTo(0, 0);
          let data = res.data;
          document.title = data.title + " - " + data.author.nickname + " - " + ENV.info.appname;
          if(data.tags && typeof(data.tags) === 'string') data.tags = data.tags.split(',');
          this.setState({
            detail: data
          });
        }else{
          notification.error({message: '提示', description: res.message});
          goBack();
        }
      }
    });
  }

  render(){

    const { detail } = this.state;

    return(

      <Row>
        <Col xs={0} sm={0} md={6} lg={6} />

        <Col xs={24} sm={24} md={12} lg={12}>
          {
            detail ?
              <div className={styles.detail}>

                <ArticleDetailShow detail={detail}/>

                <div className={styles.comment}>
                  {
                    detail.allow_comment === 0 ?
                      null
                      :
                      <CommentList url={`/articles/${detail._id}/comments`} />
                  }
                </div>

              </div>
              :
              <Loading/>
          }
        </Col>

        <Col xs={0} sm={0} md={6} lg={6} />

      </Row>

    )

  }

}
