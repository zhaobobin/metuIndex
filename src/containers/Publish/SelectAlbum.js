import React from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Button, Modal, Pagination } from 'antd';
import styles from './SelectAlbum.less'

@connect(state => ({
  global: state.global,
  oss: state.oss,
  publish: state.publish,
}))
export default class SelectAlbum extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user_id: this.props.global.currentUser._id,
      visible: false,

      page: 1,
      per_page: 10,

      loading: true,
      imagesList: [],
      total: 0,
    }
  }

  show = () => {
    this.setState({
      visible: true
    });
    this.importAlbum({
      page: this.state.page,
      per_page: this.state.per_page
    })
  }

  hide = () => {
    this.setState({
      visible: false
    })
  }

  importAlbum = (query) => {
    const { user_id } = this.state;
    this.props.dispatch({
      type: 'global/request',
      url: `/users/${user_id}/images`,
      method: 'GET',
      payload: query,
      callback: (res) => {
        if(res.code === 0) {
          this.setState({
            loading: false,
            imagesList: res.data.list,
            total: res.data.count,
          })
        }
      }
    })
  }

  //分页
  onChange = (current) => {
    this.importAlbum({
      page: current,
      per_page: this.state.per_page
    });
  };

  onShowSizeChange = (current, pageSize) => {
    let {url} = this.state;
    this.importAlbum({
      page: current,
      per_page: pageSize
    });
  };

  selectPhoto = (index) => {
    console.log(index)
  }

  render(){

    const { visible, loading, imagesList, total } = this.state;

    return(
      <div>
        <Button size="large" onClick={this.show}>从相册导入</Button>
        <Modal
          title="从相册中选择"
          width={600}
          visible={visible}
          centered={true}
          maskClosable={false}
          onCancel={this.hide}
          wrapClassName={styles.selectAlbum}
        >
          <p>从相册中选择</p>
          {
            loading ?
              null
              :
              <Row>
                {
                  imagesList.map((item, index) => (
                    <Col
                      span={6}
                      key={index}
                      className={styles.item}
                      onClick={() => this.selectPhoto(index)}
                    >
                      <img src={`${item.url}?x-oss-process=style/thumb_m`} alt={item.title} />
                    </Col>
                  ))
                }
              </Row>
          }
          <Pagination
            defaultCurrent={1}
            total={total}
            hideOnSinglePage={true}
            showSizeChanger={true}
            showQuickJumper={true}
            onChange={this.onChange}
            onShowSizeChange={this.onShowSizeChange}
          />
        </Modal>
      </div>
    )
  }

}
