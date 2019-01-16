/*
* 图片裁剪
* https://github.com/fengyuanchen/cropperjs#aspectratio
* src： 图片路径
* maxWidth：最大尺寸
* option：配置参数
* callback：返回base64
* example：
  <PhotoCrop src={base64}
    callback={this.photoCropResult}
    option={
      {
        style: {
          width: '100%',
          height: '382px',
        },
        dragMode: "move",                             //裁剪方式
        viewMode: 3,                                  //视图模式
        autoCropArea: 1,                              //裁剪区域
        aspectRatio: 16 / 4,                          //裁剪比例
        guides: false,                                //裁剪框虚线
        center: false,                                //显示裁剪框中心的加号
        cropBoxResizable: false,                      //裁剪框能否缩放
        toggleDragModeOnDblclick: false,              //能否切换裁剪方式
        highlight: false,                             //裁剪框高亮
        background: false,                            //显示画布背景
      }
    }
  />
* */
import React, { PureComponent } from 'react';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

export default class PhotoCrop extends PureComponent{

  state = {
    id: this.props.id,
    src: this.props.src ? this.props.src : null,                    //图片源
    option: this.props.option ? this.props.option : null,           //配置参数
    maxWidth: this.props.maxWidth ? this.props.maxWidth : null,     //最大尺寸
    cropResult: null,                                               //裁剪结果
  };

  _crop = () => {
    let dataUrl = this.refs.cropper.getCroppedCanvas({
      maxWidth: this.state.maxWidth,
      imageSmoothingQuality: 'high',
    }).toDataURL('image/jpeg');
    this.props.callback(dataUrl);
  };

  render(){

    return(
      <Cropper
        {...this.state.option}
        ref='cropper'
        src={this.state.src}
        crop={this._crop}
      />
    )
  }

}
