/*
 * 评论列表
 * url：查询路径
 * theme：主题配色 black、white
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon, Input } from 'antd';
import styles from './CommentList.less';

import { Toast } from '@/components'
import SignAuth from '@/blocks/Auth/SignAuth'
import CommentForm from './CommentForm'
import CommentModal from './CommentModal'
import CommentItem from './CommentItem'

@connect(state => ({
  global: state.global,
}))
export default class CommentList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

      loading: true,
      category: '',
      detail_id: '',

      page: 1,
      per_page: 10,

      list: [],
      total: 0,
      hasMore: false,

    };
  }

  componentDidMount(){
    const { category, detail_id } = this.props;
    this.queryCommentList(category, detail_id, {
      page: this.state.page,
      per_page: this.state.per_page
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.detail_id !== this.props.detail_id){
      const { category, detail_id } = nextProps
      this.queryCommentList(category, detail_id, {
        page: 1,
        per_page: this.state.per_page
      });
    }
  }

  // 查询评论列表
  queryCommentList = (category, detail_id, query) => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/request',
      url: `/${category}/${detail_id}/comments`,
      method: 'GET',
      payload: query,
      callback: (res) => {
        if(res.code === 0){
          this.setState({
            loading: false,
            category,
            detail_id,
            list: res.data.list,
            total: res.data.count,
            hasMore: res.data.hasMore,
          })
        }
        setTimeout(() => {this.ajaxFlag = true}, 500)
      }
    });
  };

  // 刷新评论列表
  refreshCommentList = () => {
    const { category, detail_id } = this.state
    this.queryCommentList(category, detail_id, {
      page: 1,
      per_page: this.state.per_page
    })
  }

  queryMoreComment = () => {
    const { category, detail_id, page, per_page } = this.state
    this.queryCommentList(category, detail_id, {
      page: page + 1,
      per_page
    });
  }

  // 表单回调
  formCallback = () => {
    this.refreshCommentList()
  }

  modalCallback = (data) => {
    this.refreshCommentList()
  }

  // 点赞评论
  favor = (item) => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    if (!this.signAuth.check()) return false;

    const { list, category, detail_id } = this.state;

    this.props.dispatch({
      type: 'global/request',
      url: `/${category}/${detail_id}/comments/favoring/${item._id}`,
      method: item.favoring_state ? 'DELETE' : 'PUT',
      payload: {},
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500)
        if(res.code === 0){
          for(let i in list){
            if(list[i]._id === item._id) {
              list[i].favoring_state = res.data.favoring_state
              list[i].favor_number = res.data.favor_number
            }
          }
          this.setState({
            list
          })
        } else {
          Toast.info(res.message, 2)
        }
      }
    });
  }

  // 回复
  reply = (item) => {
    const { category, detail_id } = this.state
    this.commentModal.show({
      category,
      detail_id,
      root_comment_id: item._id,
      reply_to: item.author._id,
      placeholder: `回复：${item.author.nickname}`
    })
  }

  // 举报评论
  report = (id) => {
    this.props.dispatch({
      type: 'global/request',
      url: '',
      method: 'POST',
      payload: {

      },
      callback: (res) => {
        if(res.status === 1){

        }else{

        }
      }
    });
  }

  // 查询回复列表
  queryReplyList = (topic) => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'comment/replyList',
      payload: {
        _id: topic._id,           //被回复的评论_id
        ids: topic.reply,
        currentPage: topic.currentPage
      },
      callback: () => {
        setTimeout(() => {this.ajaxFlag = true}, 500)
      }
    });
  }

  render(){

    const { loading, category, detail_id, list, total, hasMore } = this.state;
    const { currentUser } = this.props.global;
    const theme = this.props.theme ? styles[this.props.theme] : styles.white;

    return(

      <>
        {
          loading ?
            null
            :
            <div className={styles.comment + ' '+ theme}>

              <div className={styles.title}>
                {
                  total > 0 ?
                    <p><span>{total}</span> 条评论</p>
                    :
                    <p>暂无评论</p>
                }
              </div>

              <div className={styles.form}>
                <CommentForm
                  onRef={e => this.commentForm = e}
                  category={category}
                  detail_id={detail_id}
                  callback={this.formCallback}
                  theme={theme}
                />
              </div>

              <div className={styles.list}>

                {
                  total > 0 ?
                    list.map((item, index) => (
                      <CommentItem
                        item={item}
                        key={index}
                        userId={currentUser._id}
                        theme={theme}
                        action={{
                          report: this.report,
                          reply: this.reply,
                          favor: this.favor,
                        }}
                      />
                    ))
                    : null
                }

                {
                  hasMore ?
                    <a className={styles.moreComment} onClick={this.queryMoreComment}>查看更多评论</a>
                    :
                    null
                }

              </div>

              <SignAuth onRef={ref => this.signAuth = ref} />

              <CommentModal
                onRef={ref => this.commentModal = ref}
                callback={this.modalCallback}
              />

            </div>
        }
      </>

    )

  }

}
