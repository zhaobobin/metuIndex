import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Affix, Menu } from 'antd'
import { FormattedMessage } from 'react-intl';
import { ENV } from "@/utils/index";
import { getUrlParams } from "@/utils/utils"
import styles from './CircleDetail.less'

import SignAuth from '@/blocks/Auth/SignAuth';
import { Toast } from '@/components'

import CircleDetailHead from '@/containers/Circle/CircleDetailHead'
import CircleDetailGood from './CircleDetailGood'
import CircleDetailDiscuss from './CircleDetailDiscuss'
import CircleDetailMember from './CircleDetailMember'
import CircleDetailContest from './CircleDetailContest'
import CircleDetailAlbum from './CircleDetailAlbum'

@connect(state => ({
  global: state.global,
}))
export default class CircleDetail extends React.Component {

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
    this.queryCircleDetail(id);
  }

  // 处理用户登录、退出时，重新渲染文章数据
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.match.params.id !== this.props.match.params.id){
      let id = nextProps.match.params.id;
      this.queryCircleDetail(id);
    }
  }

  queryCircleDetail(id){
    this.props.dispatch({
      type: 'global/request',
      url: `/circles/${id}`,
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

  renderContent = (tab) => {
    let content;
    switch(tab) {
      case 'good': content = <CircleDetailGood/>; break;
      case 'discuss': content = <CircleDetailDiscuss/>; break;
      case 'member': content = <CircleDetailMember/>; break;
      case 'contest': content = <CircleDetailContest/>; break;
      case 'album': content = <CircleDetailAlbum/>; break;
      default: content = <CircleDetailGood/>; break;
    }
    return content;
  }

  // 加入圈子
  handleClickCircleJoinBtn = async () => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    const { detail } = this.state;
    const circleId = this.props.match.params.id;
    if (!this.signAuth.check()) {
      return false;
    }
    this.props.dispatch({
      type: 'global/request',
      url: detail.following_state ? `/circles/exit/${circleId}` : `/circles/join/${circleId}`,
      method: detail.following_state ? 'DELETE' : 'PUT',
      payload: {},
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500);
        Toast.info(res.message, 2);
        if (res.code === 0) {
          this.setState({
            detail: {
              ...this.state.detail,
              ...res.data
            }
          })
        }
      }
    })
  };

  render(){

    const { loading, id, detail } = this.state;

    const params = getUrlParams();
    const tab = params.t || 'good';

    const menu = [
      { key: "good", id: "menu.community.circle.good", name: "精选" },
      { key: "discuss", id: "menu.community.circle.discuss", name: "讨论" },
      { key: "member", id: "menu.community.circle.member", name: "成员", number: detail.member_number },
      { key: "contest", id: "menu.community.circle.contest", name: "活动", number: detail.activity_number },
      { key: "album", id: "menu.community.circle.album", name: "影集", number: detail.photo_number },
    ]

    return(

      <>

      {
        loading ?
          null
          :
          <div className={styles.container}>

            <CircleDetailHead detail={detail} handleClickCircleJoinBtn={this.handleClickCircleJoinBtn} />

            <Affix>
              <div className={styles.menu}>
                <Row>

                  <Col xs={0} sm={0} md={3} lg={5} />

                  <Col xs={24} sm={24} md={18} lg={14}>

                    <Menu
                      mode="horizontal"
                      selectedKeys={[tab]}
                    >
                      {
                        menu.map((item, index) => (
                          <Menu.Item key={item.key}>
                            <Link to={`/community/circle/detail/${id}?t=${item.key}`}>
                              <FormattedMessage id={item.id}/>
                              <span className={styles.number}>{item.number !== null ? item.number : ''}</span>
                            </Link>
                          </Menu.Item>
                        ))
                      }
                    </Menu>

                  </Col>

                  <Col xs={0} sm={0} md={3} lg={5} />

                </Row>
              </div>
            </Affix>

            <div className={styles.content}>

              <Row>

                <Col xs={0} sm={0} md={3} lg={5} />

                <Col xs={24} sm={24} md={18} lg={14}>

                  {
                    this.renderContent(tab)
                  }

                </Col>

                <Col xs={0} sm={0} md={3} lg={5} />

              </Row>

            </div>

            <SignAuth onRef={ref => this.signAuth = ref} />

          </div>
      }

      </>

    )
  }

}
