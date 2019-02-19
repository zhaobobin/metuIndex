import React from 'react';
import { Modal } from 'antd';
import styles from './ArticleAlert.less'

export default class ArticleAlert extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      visible: false,
    }
  }

  componentDidMount(){
    this.props.Refs = this;
  }

  show = () => {
    this.setState({
      visible: true
    })
  };

  close = () => {
    this.setState({
      visible: false
    })
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  render(){

    const {visible} = this.state;
    const {title, content} = this.props;

    return(
      <Modal
        title={title}
        centered={true}
        visible={visible}
        autoFocusButton={null}
        onCancel={this.handleCancel}
        className={styles.modalArticleAlert}
      >
        <div className={styles.ArticleDetail} dangerouslySetInnerHTML={{__html: content}}/>
      </Modal>
    )
  }

}
