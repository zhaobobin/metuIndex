import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Spin} from 'antd';
import { getImgSize } from '~/utils/utils';

import styles from './HomeBanner.less';

@connect(state => ({
  global: state.global
}))
export default class HomeBanner extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: '',
      imgStyle: '?x-oss-process=style/thumb_m'
    };
  }

  componentDidMount(){
    this.queryPhotoWel();
  }

  queryPhotoWel(){
    this.props.dispatch({
      type: 'global/post',
      url: '/api/HomeSwiper',
      payload: {},
      callback: (res) => {
        if(res.status === 1){
          this.setState({
            data: res.data
          })
        }
      }
    });
  }

  //加载优化、img下载完成后再渲染组件
  onLoad = () => {
    this.setState({
      imgStyle: '?x-oss-process=style/cover'
    })
  };

  render(){

    const {data, imgStyle} = this.state;

    const bgImg = data ?
      {
        backgroundImage: `url(${data.thumb.url}${imgStyle})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
      } : {};

    return(

      <div className={styles.container} style={bgImg}>
        {
          data ?
            <div className={styles.item}>
              <img className={styles.hidden} src={data.thumb.url+'?x-oss-process=style/cover'} onLoad={this.onLoad} />
              {
                data.uid ?
                  <p className={styles.info}>
                    <Link to={`/photos/${data._id}/${data.title}-by-${data.uid.nickname}`}>{data.title}</Link>
                    <span>by</span>
                    <Link to={`/u/${data.uid.username}`}>{data.uid.nickname}</Link>
                  </p>
                  : null
              }
            </div>
            :
            <Spin className={styles.loading} size="large" delay={300} />
        }
      </div>

    )
  }

}
