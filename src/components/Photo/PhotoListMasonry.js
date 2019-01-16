/*
 * 图片列表 - 瀑布流
 * data： 数组
 * type：展示类型，默认album
 * <PhotoListMasonry data={list} type="album" />
 */
import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import {Row, Col} from 'antd';
import styles from './PhotoList.less';
import logo from '~/assets/logo.png';

import Masonry from 'react-masonry-component';		        //瀑布流
const masonryOptions = {
  transitionDuration: 500
};

export default class PhotoListMasonry extends PureComponent {

  render(){

    const {data, type} = this.props;

    const photoList = data.length > 0 ?
      data.map((topic, index) => (
        <Col key={index} xs={12} sm={12} md={8} lg={6} className={styles.photoItem}>
          {
            topic.modelType === 'article' ?
              <Link className={styles.article} to={`/${topic.modelType}/${topic._id}/${topic.title}-by-${topic.uid.nickname}`}>
                {
                  topic.thumb ?
                    <img src={`${topic.thumb.url}?x-oss-process=style/thumb`} alt={topic.title} />
                    :
                    <span className={styles.logo} style={{backgroundImage:'url('+ logo +')'}} />
                }
                <p className={styles.info}><span className={styles.title}>{topic.title}</span></p>
              </Link>
              :
              <Link className={styles.photo} to={`/${type}/${topic._id}/${topic.title}-by-${topic.uid.nickname}`}>
                <img className={styles.thumb} src={`${topic.thumb.url}?x-oss-process=style/thumb`} alt={topic.title} />
                <p className={styles.cover}><span className={styles.title}>{topic.title}</span></p>
              </Link>
          }
        </Col>
      ))
      : <div>暂无数据！</div>;

    return(
      <Row>

        <Col xs={0} sm={0} md={1} lg={1} />

        <Col xs={24} sm={24} md={22} lg={22}>

          <Masonry
            className={styles.photoList}
            elementType={'div'}
            options={masonryOptions}
            disableImagesLoaded={false}
            updateOnEachImageLoad={false}
          >
            {photoList}
          </Masonry>

        </Col>

        <Col xs={0} sm={0} md={1} lg={1} />

      </Row>
    )
  }

}
