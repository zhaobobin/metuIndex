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
      per_page: 8,

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
    let { imagesList } = this.state;
    imagesList[index].selected = !imagesList[index].selected;
    this.setState({
      imagesList
    })
  }

  onOk = () => {
    const { imagesList } = this.state;
    const { images, thumb } = this.props.publish.photo;
    let selectedList = []
    for(let i in imagesList) {
      if(imagesList[i].selected) selectedList.push(imagesList[i])
    }

    const photoList = selectedList.concat(images);
    const payload = {
      images: photoList,
    }
    if(!thumb) {
      payload.thumb = {
        url: selectedList[0].url,
        width: selectedList[0].width,
        height: selectedList[0].height,
      }
    }
    this.props.dispatch({
      type: 'publish/savePhoto',
      payload
    });
    this.hide();
  }

  render(){

    const { visible, per_page, loading, imagesList, total } = this.state;

    return(
      <div>
        <Button size="large" onClick={this.show}>从相册导入</Button>
        <Modal
          title="从相册中选择"
          width={700}
          visible={visible}
          centered={true}
          maskClosable={false}
          onOk={this.onOk}
          onCancel={this.hide}
          wrapClassName={styles.selectAlbum}
        >
          {
            loading ?
              null
              :
              <div className={styles.content}>
                <Row gutter={10}>
                  {
                    imagesList.map((item, index) => (
                      <Col
                        span={6}
                        key={index}
                        className={styles.item}
                      >
                        <div className={styles.imgBox} onClick={() => this.selectPhoto(index)}>
                          <img src={`${item.url}?x-oss-process=style/thumb_m`} alt={item.title} />
                          {
                            item.selected ?
                              <p className={styles.check}>
                                <Icon type="check"/>
                              </p>
                              :
                              null
                          }
                        </div>
                      </Col>
                    ))
                  }
                </Row>
                <Pagination
                  defaultCurrent={1}
                  total={total}
                  pageSize={per_page}
                  hideOnSinglePage={true}
                  onChange={this.onChange}
                  onShowSizeChange={this.onShowSizeChange}
                />
              </div>
          }
        </Modal>
      </div>
    )
  }

}
