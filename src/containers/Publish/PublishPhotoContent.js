import React from "react";
import { connect } from "dva";
import { Row, Col, Button, Icon, Upload, Modal, Tooltip } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { file2base64, createRandomId } from "@/utils/utils";
import styles from "./PublishPhotoContent.less";

import { Alert } from "@/components/Dialog/Dialog";
import SelectAlbum from "./SelectAlbum";

@connect((state) => ({
  global: state.global,
  oss: state.oss,
  publish: state.publish,
}))
export default class PublishPhotoContent extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      user_id: this.props.global.currentUser._id,
      modalVisible: false,
      // photoList: this.props.photoList || [],
      currentPhotoIndex: 0, //默认选择的图片索引值
    };
  }

  //图片上传前检查
  beforeUpload = (file) => {
    const isImg =
      file.type.split("/")[1] === "jpeg" || file.type.split("/")[1] === "png";
    if (!isImg) {
      Alert({
        title: "只能上传jpg、png图片文件!",
        callback: () => {},
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 50;
    if (!isLt2M) {
      Alert({
        title: "图片文件的大小不能超过50MB!",
        callback: () => {},
      });
    }
    return isImg && isLt2M;
  };

  //上传图片到oss
  handleUploadPhoto = ({ file }) => {
    // console.log(file)
    let { user_id } = this.state;
    const { images, thumb } = this.props.publish.photo;

    for (let i in images) {
      if (images[i].name === file.name) {
        //阻止上传与列表图片雷同的文件
        Alert({
          title: "已存在雷同的图片!",
          callback: () => {},
        });
        return false;
      }
    }

    let option = {
      category: "photo",
      name: file.name.split(".")[0],
      //unix: new Date().getTime(),
      id: createRandomId(),
      type: file.name.split(".")[1],
    };
    let key = user_id + "/" + option.id + "." + option.type;

    // 根据key查询图片是否已上传

    file2base64(file, (base64) => {
      let imgData = {
        loading: true, //加载状态
        key, //对应oss中的键值
        name: option.name, //完整文件名
        title: file.name.replace(/(.*\/)*([^.]+).*/gi, "$2"), //文件标题
        description: "", //描述
        base64: base64, //用于显示上传时的缩略图
        width: base64.width, //图片宽度
        height: base64.height, //图片高度
        exif: "", //图片源数据
        camera: "", //相机型号
        lens: "", //镜头型号
        url: "", //oss图片路径，用于显示
      };
      images.push(imgData);
      this.props.dispatch({
        type: "publish/savePhoto",
        payload: {
          images,
        },
      });
    });

    this.props.dispatch({
      type: "oss/upload",
      payload: {
        key: key,
        file: file,
      },
      callback: (url) => {
        // console.log(url)

        // 查询exif
        this.props.dispatch({
          type: "oss/exif",
          payload: {
            url,
          },
          callback: (exif) => {
            // console.log(exif)
            for (let i in images) {
              if (images[i].name === option.name) {
                images[i].loading = false;
                images[i].url = url;
                images[i].exif = exif ? JSON.stringify(exif) : "";
                if (exif) {
                  //相机
                  images[i].camera = exif.Model
                    ? {
                        brand: exif.Model.value.split(" ")[0],
                        brandName: exif.Model.value.split(" ")[0].toLowerCase(),
                        model: exif.Model.value,
                        modelName: exif.Model.value
                          .replace(/\s+/g, "-")
                          .toLowerCase(),
                      }
                    : "";
                  //镜头
                  images[i].lens = exif.LensModel
                    ? {
                        brand: exif.LensModel.value.split(" ")[0],
                        brandName: exif.LensModel.value
                          .split(" ")[0]
                          .toLowerCase(),
                        model: exif.LensModel.value,
                        modelName: exif.LensModel.value
                          .replace(/\s+/g, "-")
                          .toLowerCase(),
                      }
                    : "";
                  //曝光
                  images[i].exposure = {
                    FNumber: exif.FNumber
                      ? exif.FNumber.value.split("/")[0]
                      : "", // 光圈
                    ExposureTime: exif.ExposureTime
                      ? exif.ExposureTime.value
                      : "", // 速度
                    ISOSpeedRatings: exif.ISOSpeedRatings
                      ? exif.ISOSpeedRatings.value
                      : "", // iso
                  };
                }
              }
            }

            const payload = {
              images,
            };
            if (!thumb) {
              payload.thumb = {
                url: images[0].url,
                width: images[0].width,
                height: images[0].height,
              };
            }
            this.props.dispatch({
              type: "publish/savePhoto",
              payload,
            });
          },
        });
      },
    });
  };

  //删除图片 - 仅删除暂存图片列表
  delPhoto = (index) => {
    let { images, thumb } = this.props.publish.photo;
    let changeThumb = false;
    if (images[index].url === thumb.url) changeThumb = true;
    images.splice(index, 1);
    const payload = {
      images,
    };
    if (images.length > 0 && changeThumb) {
      payload.thumb = {
        url: images[0].url,
        width: images[0].width,
        height: images[0].height,
      };
    }
    this.props.dispatch({
      type: "publish/savePhoto",
      payload,
    });
  };

  // 切换当前图片
  changeCover = (index) => {
    const { images } = this.props.publish.photo;
    this.props.dispatch({
      type: "publish/savePhoto",
      payload: {
        thumb: {
          url: images[index].url,
          width: images[index].width,
          height: images[index].height,
        },
      },
    });
  };

  renderPhotoItem = (item, index, thumb) => (
    <div className={styles.imgBox}>
      <p className={styles.url}>
        <img
          src={
            item.base64
              ? item.base64.url
              : `${item.url}?x-oss-process=style/thumb`
          }
          alt={item.title}
        />
        {item.loading ? (
          <span className={styles.loading}>
            <Icon type="loading" />
          </span>
        ) : (
          ""
        )}
      </p>
      {item.url === thumb.url ? <p className={styles.border} /> : null}
      <p className={styles.action} onClick={() => this.changeCover(index)}>
        <span className={styles.imageTitle}>{item.title}</span>
        <span className={styles.del} onClick={() => this.delPhoto(index)}>
          <Icon type="close" />
        </span>
      </p>
    </div>
  );

  // reordering the images result
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // 图片拖拽
  onDragEnd = (result) => {
    console.log(result);
    if (!result.destination) {
      return;
    }
    const images = this.reorder(
      this.props.publish.photo.images,
      result.source.index,
      result.destination.index
    );
    this.props.dispatch({
      type: "publish/savePhoto",
      payload: {
        images,
      },
    });
  };

  render() {
    const { images, thumb } = this.props.publish.photo;

    const getListStyle = (isDraggingOver) => ({
      // background: isDraggingOver ? '#e6f7ff' : 'transparent',
      // display: "flex",
      width: "100%",
      height: "auto",
      overflow: "hidden",
    });
    const getItemStyle = (isDragging, draggableStyle) => ({
      // some basic styles to make the items look a bit nicer
      float: "left",
      padding: "5px",
      width: "25%",
      height: "auto",
      position: "relative",
      userSelect: "none",
      // change background colour if dragging
      // background: isDragging ? "#91d5ff" : "#fff",
      // styles we need to apply on draggables
      opecity: isDragging ? 0.5 : 1,
      ...draggableStyle,
    });

    return (
      <div className={styles.container}>
        <Row>
          <Col span={12}>
            <SelectAlbum />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            {images.length <= 30 ? (
              <Upload
                name="photo"
                accept=".jpg,.png"
                className={styles.upload}
                multiple={true}
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                customRequest={this.handleUploadPhoto}
              >
                <Tooltip placement="bottom" title={"最多可上传30张图片，文件大小不超过50MB"}>
                  <Button size="large">
                    <Icon type="plus" />
                    <span>上传图片</span>
                  </Button>
                </Tooltip>
              </Upload>
            ) : null}
          </Col>
        </Row>

        <div className={styles.content}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    ...getListStyle(snapshot.isDraggingOver),
                  }}
                >
                  {images.map((item, index) => {
                    return (
                      <Draggable
                        key={index}
                        draggableId={"Draggable" + index}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              ),
                            }}
                          >
                            {this.renderPhotoItem(item, index, thumb)}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {images.length === 0 ? (
            <div className={styles.uploadWrapper}>
              <Upload
                name="photo"
                accept=".jpg,.png"
                listType="picture-card"
                className={styles.upload}
                multiple={true}
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                customRequest={this.handleUploadPhoto}
              >
                <Icon type="plus" />
                <p>
                  最多可上传30张图片 <br /> 文件大小不超过50MB
                </p>
              </Upload>
            </div>
          ) : null}
        </div>

        <Modal />
      </div>
    );
  }
}
