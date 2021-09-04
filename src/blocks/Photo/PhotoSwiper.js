/*
 * 图片切换 - 纯展示组件，接收图片数组，返回当前图片信息
 * list：接收的数组
 * key：当前图片索引值，默认0
 * callback：返回当前图片信息
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Row, Col, Icon, Spin} from 'antd';
import { goBack } from '@/utils/utils';

import styles from './PhotoSwiper.less';

const screenfull = require('screenfull');

@connect(state => ({
  global: state.global,
}))
export default class PhotoSwiper extends PureComponent {

  constructor(props){
    super(props);
    this.scrollFlag = true;
    this.state = {
      loading: true,
      list: this.props.list,
      photoTotal: this.props.list.length,							    //图片总数
      thumbLen: this.props.list.length - 1,						    //thumb长度，从0开始计算
      currentPhoto: this.props.list[this.props.currentKey],			//当前图片信息
      currentKey: this.props.currentKey,		                      //thumb当前key
      currentIndex: 1,												            //thumb当前索引
      translate: -58 - this.props.currentKey * 116,							//thumb位移
      screenfull: false,
      screenfullType: 'arrows-alt',
      swiperClass: styles.photoSwiper,
    };
  }

  componentDidMount(){

    let _this = this;

    //监听键盘
    document.onkeydown = (event) => {
      let e = event || window.event || arguments.callee.caller.arguments[0];
      if(!e) return;
      //console.log(e.keyCode)
      if(e.keyCode===37 || e.keyCode===100){//左
        this.prevPhoto()
      }
      if(e.keyCode===39 || e.keyCode===102){//右
        this.nextPhoto()
      }
    };

    //监控全屏切换
    if(screenfull.enabled){
      document.addEventListener(screenfull.raw.fullscreenchange, function() {
        _this.setState({
          screenfull: screenfull.isFullscreen,
          screenfullType: screenfull.isFullscreen ? 'arrows-alt' : 'shrink',
          swiperClass: screenfull.isFullscreen ? styles.photoSwiper+" "+styles.fullscreen : styles.photoSwiper
        });
      });
    }

  }

  //取消事件监听
  componentWillUnmount(){
    document.removeEventListener('DOMMouseScroll', this.scrollFunc, false);
    window.onmousewheel = document.onmousewheel = null;
  }

  //监控鼠标进入
  mouseEnter(){
    //监听鼠标滚轮
    if(document.addEventListener) document.addEventListener('DOMMouseScroll', this.scrollFunc, false);	//W3C
    window.onmousewheel = document.onmousewheel = this.scrollFunc;									//IE/Opera/Chrome
  }
  //监控鼠标离开
  mouseLeave(){
    document.removeEventListener('DOMMouseScroll', this.scrollFunc, false);
    window.onmousewheel = document.onmousewheel = null;
  }

  //判断鼠标滚动方向
  scrollFunc = (e) => {

    if(!this.scrollFlag) return;
    this.scrollFlag = false;

    e = e || window.event;
    if(e.wheelDelta){						  //IE/Opera/Chrome
      if(e.wheelDelta === 120){		//向上
        this.prevPhoto()
      }
      if(e.wheelDelta === -120){		//向下
        this.nextPhoto()
      }
    }
    else if(e.detail){						//Firefox
      if(e.detail === -3){					//向上
        this.prevPhoto()
      }
      if(e.detail === 3){					//向下
        this.nextPhoto()
      }
    }
    setTimeout(() => { this.scrollFlag = true }, 300);
  }

  //加载优化、img下载完成后再渲染组件
  loaded = () => {
    this.setState({ loading: false });
  };

  //thumb切换
  photoHandle = (key) => {
    this.thumbAnimate(key);
  };
  //上一张
  prevPhoto = () => {
    let key = this.state.currentKey;
    if(key === 0) return;
    key -= 1;
    this.thumbAnimate(key);
  };
  //下一张
  nextPhoto = () => {
    let key = this.state.currentKey;
    if(key === this.state.thumbLen) return;
    key += 1;
    this.thumbAnimate(key);
  };
  //上四张
  prevThumb = () => {
    let key = this.state.currentKey;
    if(key === 0) return;
    key -= 4;
    if(key < 0) key = 0;
    this.thumbAnimate(key);
  };
  //下四张
  nextThumb = () => {
    let key = this.state.currentKey;
    if(key === this.state.thumbLen) return;
    key += 4;
    if(key > this.state.thumbLen) key = this.state.thumbLen;
    this.thumbAnimate(key);
  };
  //thumb位移动画
  thumbAnimate(key){
    let translate = -58 -  key * 116,
      currentPhoto = this.state.list[key];
    this.props.callback(currentPhoto);
    this.setState({
      loading: true,
      currentKey: key,
      currentIndex: key + 1,
      translate: translate,
      currentPhoto: currentPhoto
    });
  };

  //全屏切换
  onChangeFullscreen = () => {
    if (!screenfull.enabled) return false;
    let screenFull = this.refs.screenFull;
    screenfull.toggle(screenFull);
  };

  // 阅读模式
  toggleReadModel = () => {
    let { readModel } = this.props.global;
    readModel = readModel === 'black' ? 'white' : 'black';
    this.props.dispatch({
      type: 'global/changeReadModel',
      payload: {
        readModel
      }
    })
  }

  //返回
  goBack = () => {
    goBack()
  };

  render(){

    const { theme } = this.props;
    const { loading, list, currentPhoto, currentKey, swiperClass } = this.state;
    const { readModel } = this.props.global
    //console.log(this.props.currentKey)

    //thumb初始位移
    const thumbStyle = {
      width: this.state.photoTotal * 116,
      transform: 'translateX('+ this.state.translate +'px)'
    };

    //缩略图列表 - 加载完毕时渲染
    const thumbList = list.length > 0 ?
      list.map((topic, index) => (
        <div
          key={index}
          className={styles.thumbItem + " " + (index === currentKey ? styles.current : null)}
          onClick={() => this.photoHandle(index)}
          style={{backgroundImage: 'url('+ topic.url + '?x-oss-process=style/thumb_s)'}}
        />
      ))
      :
      null;

    return(

      <div className={swiperClass + " " + styles[theme]} ref="screenFull">

        <Row className={styles.swiperHeader}>
          <Col span={2}>
            <a className={styles.full} title="全屏显示" onClick={this.onChangeFullscreen}>
              <Icon type={this.state.screenfullType} />
            </a>
            <a className={styles.read} title="阅读模式" onClick={this.toggleReadModel}>
              <Icon type="bulb" theme={readModel === 'black' ? 'filled' : null} />
            </a>
          </Col>
          <Col span={20}>
            <span>{this.state.currentIndex}/{this.state.photoTotal}</span>
          </Col>
          <Col span={2}><a className={styles.close} title="关闭" onClick={this.goBack}><Icon type="close" /></a></Col>
        </Row>

        {
          currentPhoto ?
            <div className={styles.detailSwiper}>

              <div className={styles.scene}>
                <div className={styles.sceneContainer}>
                  <div className={styles.spin}><Spin spinning={loading} size="large" /></div>
                  <img className={styles.currentPhoto} src={currentPhoto.url + '?x-oss-process=style/cover'} alt="current"/>
                  {/*<img className={styles.currentPhoto} onLoad={this.loaded} src={currentPhoto.url + '?x-oss-process=style/cover'} alt="photo"//>*/}
                </div>
                <a className={styles.mask} onClick={this.onChangeFullscreen}><i/></a>
                <a className={styles.arrow+" "+styles.prev} title="上一张" onClick={this.prevPhoto}><Icon type="left" /></a>
                <a className={styles.arrow+" "+styles.next} title="下一张" onClick={this.nextPhoto}><Icon type="right" /></a>
              </div>

              <div className={styles.thumb}>
                <div className={styles.thumbContainer} style={thumbStyle}>
                  {thumbList}
                </div>
                <a className={styles.arrow+" "+styles.prev} title="上四张" onClick={this.prevThumb}><Icon type="double-left" /></a>
                <a className={styles.arrow+" "+styles.next} title="下四张" onClick={this.nextThumb}><Icon type="double-right" /></a>
              </div>

            </div>
            : null
        }

      </div>

    )

  }

}
