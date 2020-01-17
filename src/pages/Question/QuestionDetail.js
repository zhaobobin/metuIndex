import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './QuestionDetail.less';

@connect(state => ({
  global: state.global,
}))
export default class QuestionDetail extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: true,
      id: '',
      detail: '',
    };
  }

  componentDidMount(){
    window.scrollTo(0, 0);
    let id = this.props.match.params.id;
    this.queryQuestionDetail(id);
  }

  //处理用户登录、退出时，重新渲染文章数据
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.match.params.id !== this.props.match.params.id){
      let id = nextProps.match.params.id;
      this.queryQuestionDetail(id);
    }
  }

  queryQuestionDetail(id){
    this.props.dispatch({
      type: 'global/request',
      url: `/questions/${id}`,
      method: 'GET',
      payload: {},
      callback: (res) => {
        if(res.code === 0) {
          this.setState({
            id,
            loading: false,
            detail: res.data
          })
        }
      }
    })
  }

  render(){

    const { loading } = this.state;

    return(

      <>

      {
        loading ?
          null
          :
          <div className={styles.content}>
            <Row>
              <Col xs={0} sm={0} md={2} lg={3} xl={5} />

              <Col xs={24} sm={24} md={14} lg={12} xl={10}>
                QuestionDetail
              </Col>

              <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                <div className={styles.slide}>

                </div>
              </Col>

              <Col xs={0} sm={0} md={2} lg={3} xl={5} />
            </Row>
          </div>
      }

      </>

    )
  }

}
