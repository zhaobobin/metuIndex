/**
 * 【作废】上传图片列表
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Row, Col, Card, InputNumber, Select, Table, Divider, Upload, Modal, Popconfirm, notification } from 'antd';
import { Storage } from '@/utils';
import { checkRole, hasErrors, file2base64 } from '@/utils/utils';
import styles from './UploadPhotoList.less'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { Option } = Select;

const keys = ['category', 'title', 'tags', 'description', 'copyright'];

@connect(state => ({
  global: state.global,
  photo: state.photo,
  oss: state.oss,
}))
@Form.create()
export default class UploadPhotoList extends React.Component {

  state = {
    role: this.props.global.currentUser.role,
    uid: this.props.global.currentUser._id,
    visible: false,
    photoList: [],                                        //暂存图片列表
    ossList: [],                                          //oss图片文件待删除列表
    current: 0,
  };

  //初始化
  componentDidMount(){

  }

  add = () => {
    this.setState({
      visible: true
    })
  };

  cancel = () => {
    let _this = this,
      list = _this.state.photoList;
    if(list.length > 0){
      confirm({
        title: '取消上传?',
        okText: '确定',
        cancelText: '取消',
        content: '所有未保存的数据都将被清除！',
        onOk() {
          _this.clearOssList();
          _this.setState({
            visible: false,
            ossList: [],
            photoList: [],
          })
        },
        onCancel() {},
      });
    }else{
      _this.clearOssList();
      _this.setState({
        visible: false,
        ossList: [],
        photoList: [],
      });
    }
  };

  //图片上传前检查
  beforeUpload = (file) => {
    const isImg = file.type.split('/')[1] === 'jpeg' || file.type.split('/')[1] === 'png';
    if (!isImg) {
      notification.error({message: '只能上传jpg、png图片文件!'});
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notification.error({message: '图片文件的大小不能超过2MB!'});
    }
    return isImg && isLt2M;
  };

  //上传图片列表
  handleUploadPhoto = ({file}) => {

    let photoList = this.state.photoList;
    if(photoList.length > 0){
      for(let i in photoList){
        //上传时排除文件名雷同的文件
        if(photoList[i].name === file.name) {
          notification.error({message: '已存在雷同的图片!'});
          return false;
        }
      }
    }

    file2base64(file, (base64) => {
      let imgData = {
        loading: true,                                          //加载状态
        key: '',                                                //对应oss中的键值
        category: '',
        name: file.name,                                        //完整文件名
        title: file.name.replace(/(.*\/)*([^.]+).*/ig,"$2"),    //文件标题
        tags: '',
        description: '',
        copyright: '',
        base64: base64,                                         //用于显示上传时的缩略图
        url: '',                                                //图片路径，用于显示
        current: false,
      };
      photoList.push(imgData);
      this.setState({ photoList });
    });

    let option = {
      uid: this.props.global.currentUser._id,
      category: 'photo',
      name: file.name.split('.')[0],
      unix: new Date().getTime(),
      type: file.name.split('.')[1],
    };
    let key = option.uid + '/' + option.category + '_' + option.unix + '.' + option.type;

    this.props.dispatch({
      type: 'oss/upload',
      payload: {
        key: key,
        file: file
      },
      callback: (url) => {
        let name = file.name,
          current = this.state.current,
          photoList = this.state.photoList,
          ossList = this.addOssList(key);                      //添加ossList列表
        for(let i in photoList){
          if(photoList[i].name === name){
            photoList[i].key = key;
            photoList[i].loading = false;
            photoList[i].url = url;
          }
          photoList[i].current = false;
        }
        if(photoList.length > 0) {
          current = photoList.length - 1;
          photoList[current].current = true;
          this.props.form.resetFields(keys);            //重置表单
        }
        this.setState({
          ossList,
          photoList,
          current
        });
      }
    });

  };

  //添加ossList列表
  addOssList(key){
    let canAdd = true,                                //避免重复添加
      item = {key: key, status: 'new'},               //save是否被保存，为false时会删除其在oss中对应的文件
      ossList = this.state.ossList;
    for(let i in ossList){
      if(ossList[i].key === key) canAdd = false
    }
    if(canAdd) ossList.push(item);
    return ossList
  }
  //更新ossList
  updateOssList(key){
    let ossList = this.state.ossList;
    for(let i in ossList){
      if(ossList[i].key === key) ossList[i].status = 'del'
    }
    return ossList
  }
  //清空ossList
  clearOssList(){
    let keys = [],
      ossList = this.state.ossList;
    for(let i in ossList){
      keys.push(ossList[i].key)
    }
    if(keys.length > 0) {
      this.props.dispatch({
        type: 'oss/del',
        payload: { keys: keys }
      });
    }
  }
  //删除ossList
  delOssList(){
    let keys = [],
      ossList = this.state.ossList;
    for(let i in ossList){
      if(!ossList[i].status === 'del') keys.push(ossList[i].key)
    }
    if(keys.length > 0){
      this.props.dispatch({
        type: 'oss/del',
        payload: { keys: keys }
      });
    }
    this.setState({ossList: []})
  }
  //删除图片 - 仅删除暂存图片列表
  delPhoto(index){
    let photoList = this.state.photoList,
      key = photoList[index].key,
      ossList = this.updateOssList(key);
    photoList.splice(index, 1);
    this.setState({
      ossList,
      photoList,
    })
  }

  changeCurrent = (index) => {
    let photoList = this.state.photoList;
    this.props.form.resetFields(keys);            //重置表单
    for(let i in photoList){
      let c = parseInt(i);
      photoList[i].current = c === index;
    }
    this.setState({
      photoList: photoList,
      current: index
    })
  };

  changeCategory = (value) => {
    let photoList = this.state.photoList,
      current = this.state.current,
      detail = photoList[current];
    detail['category'] = value;
    photoList[current] = detail;
    this.setState({
      photoList
    });
  };

  changeTitle = (e) => {
    let photoList = this.state.photoList,
      current = this.state.current,
      detail = photoList[current];
    detail['title'] = e.target.value;
    photoList[current] = detail;
    this.setState({
      photoList
    });
  };

  changeTags = (value) => {
    let photoList = this.state.photoList,
      current = this.state.current,
      detail = photoList[current];
    detail['tags'] = value.join(',');
    photoList[current] = detail;
    this.setState({
      photoList
    });
  };

  changeDesc = (e) => {
    let photoList = this.state.photoList,
      current = this.state.current,
      detail = photoList[current];
    detail['description'] = e.target.value;
    photoList[current] = detail;
    this.setState({
      photoList
    });
  };

  changeCopyright = (value) => {
    let photoList = this.state.photoList,
      current = this.state.current,
      detail = photoList[current];
    detail['copyright'] = value;
    photoList[current] = detail;
    this.setState({
      photoList
    });
  };

  //确认提交
  handleSubmit = (e) => {
    e.preventDefault();

    if(!checkRole(this.state.role.roleid)) return;

    if(!Storage.get('metu-ajaxFlag')) return;
    Storage.set('metu-ajaxFlag', false);

    this.props.form.validateFields(keys, (err, values) => {
      if(!err){

        let arr = [],
          photoList = this.state.photoList;

        for(let i in photoList){
          let photo = {
            adminid: photoList[i].adminid,
            key: photoList[i].key,                                                //对应oss中的键值
            category: photoList[i].category,
            name: photoList[i].name,                                              //完整文件名
            title: photoList[i].title,                                            //文件标题
            tags: photoList[i].tags,
            description: photoList[i].description,
            copyright: photoList[i].copyright,
            url: photoList[i].url,                                                //图片路径，用于显示
          };
          arr.push(photo);
        }

        this.savePhoto(arr)
      }
    });

    setTimeout(() => { Storage.set('metu-ajaxFlag', true) }, 500);

  };

  //保存图片
  savePhoto(data){
    //保存时，执行ossDel列表对应文件的删除操作
    this.props.dispatch({
      type: 'photo/add',
      payload: data,
      callback: (res) => {
        if(res.status === 1){
          this.queryList();
          this.delOssList();
          this.setState({
            visible: false,
            photoList: [],
          });
        }else{
          notification.error({message: res.msg});
        }
      }
    });
  }

  //查询列表
  queryList(){
    this.props.dispatch({
      type: 'photo/list',
      payload: {
        params: {},
        sort: '',
        currentPage: 1,
        pageSize: Storage.get('metu-pageSize') ? Storage.get('metu-pageSize') : 10
      },
      callback: (res) => {}
    });
  }

  render(){

    const { form, oss } = this.props;
    const { photoList, current } = this.state;
    const { getFieldDecorator, getFieldsError } = form;

    const detail = photoList.length > 0 ? photoList[current] : '';

    const category = [
      {label: 'Uncategorized', value: 0},
      {label: 'Celebrities', value: 1},
      {label: 'Film', value: 2},
      {label: 'Journalism', value: 3},
      {label: 'Nude', value: 4},
      {label: 'Black and White', value: 5},
      {label: 'Still Life', value: 6},
      {label: 'People', value: 7},
      {label: 'Landscapes', value: 8},
      {label: 'City &amp; Architecture', value: 9},
      {label: 'Abstract', value: 10},
      {label: 'Animals', value: 11},
      {label: 'Macro', value: 12},
      {label: 'Travel', value: 13},
      {label: 'Fashion', value: 14},
      {label: 'Commercial', value: 15},
      {label: 'Concert', value: 16},
      {label: 'Sport', value: 17},
      {label: 'Nature', value: 18},
      {label: 'Performing Arts', value: 19},
      {label: 'Family', value: 20},
      {label: 'Street', value: 21},
      {label: 'Underwater', value: 22},
      {label: 'Food', value: 23},
      {label: 'Fine Art', value: 24},
      {label: 'Wedding', value: 25},
      {label: 'Transportation', value: 26},
      {label: 'Urban Exploration', value: 27},
      {label: 'Aerial', value: 28},
      {label: 'Night', value: 29},
      {label: 'Boudoir', value: 30},
    ];
    const categoryOption = category.map((topic, index) => (
      <Option key={index} value={topic.value}>{topic.label}</Option>
    ));

    const tags = ['风光','人像','人文','纪实','静物'];
    const tagsOption = tags.map((topic, index) => (
      <Option key={index} value={topic}>{topic}</Option>
    ));

    const copyright = [
      {label: '非原创', value: 0},
      {label: '原创,CC0协议共享(非署名)', value: 1},
      {label: '原创,CC协议共享(署名)', value: 2},
      {label: '原创,CC协议共享(署名-非商业性使用)', value: 3},
      {label: '原创,CC协议共享(署名-禁止演绎)', value: 4},
      {label: '原创,CC协议共享(署名-相同方式共享)', value: 5},
      {label: '原创,CC协议共享(署名-非商业性使用-禁止演绎)', value: 6},
      {label: '原创,CC协议共享(署名-非商业性使用-相同方式共享)', value: 7}
    ];
    const copyrightOption = copyright.map((topic, index) => (
      <Option key={index} value={topic.value}>{topic.label}</Option>
    ));

    return(
      <span>

        <Button icon="plus" type="primary" onClick={this.add}>{this.props.btnText}</Button>

        <Modal
          className={styles.uploadModal}
          title=""
          width={1428}
          visible={this.state.visible}
          onCancel={this.cancel}
          closable={false}
          footer={null}
        >
          {
            photoList.length > 0 ?
              <div className={styles.after}>
                <Form onSubmit={this.handleSubmit}>

                  <div className={styles.content}>
                    <div className={styles.photoList}>
                      <Row gutter={8}>
                        {
                          photoList.map((topic, index) => (
                            <Col span={6} key={index} className={styles.item}  onClick={this.changeCurrent.bind(this, index)}>
                              <div className={styles.imgBox}>
                                <p className={styles.url}>
                                  <img src={topic.base64 ? topic.base64 : topic.url + '?x-oss-process=style/thumb_m'} alt={topic.title}/>
                                  {
                                    topic.loading ?
                                      <span className={styles.loading}><Icon type='loading' /></span>
                                      : ''
                                  }
                                </p>
                                {topic.current ? <p className={styles.border}/> : null}
                                <p className={styles.action}>
                                  <span className={styles.del} onClick={this.delPhoto.bind(this, index)}>
                                    <Icon type="close" />
                                  </span>
                                </p>
                              </div>
                              <div className={styles.title}>
                                <FormItem>
                                  {getFieldDecorator('title'+index, {
                                    initialValue: topic.title,
                                  })(
                                    <Input key={index}
                                           placeholder="标题长度不能超过20个字"
                                           onChange={this.changeTitle}
                                    />
                                  )}
                                </FormItem>
                              </div>
                            </Col>
                          ))
                        }
                        {
                          photoList.length <= 30 ?
                            <Col span={6}>
                              <Upload
                                accept=".jpg,.png"
                                name="photo"
                                listType="picture-card"
                                className={styles.upload}
                                multiple={true}
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                                customRequest={this.handleUploadPhoto}
                              >
                                <div>
                                  <Icon type='plus' />
                                  <div className="ant-upload-text">最多可上传30张图片<br/>文件大小不超过2MB</div>
                                </div>
                              </Upload>
                            </Col> : null
                        }
                      </Row>
                    </div>
                  </div>

                  <div className={styles.action}>
                    <FormItem>
                      <Button style={{ width: '100%' }}
                              size="large"
                              type="primary"
                              htmlType="submit"
                              disabled={hasErrors(getFieldsError(keys)) || oss.submitting}
                      >保存</Button>
                    </FormItem>
                    <FormItem label="分类">
                      {getFieldDecorator('category', {
                        initialValue: detail.category ? detail.category : 0,
                        rules: [
                          { required: true, message: '请选择文章分类！' }
                        ],
                      })(
                        <Select style={{ width: '100%' }} placeholder="请选择文章分类" onChange={this.changeCategory}>
                          {categoryOption}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="标题">
                      {getFieldDecorator('title', {
                        initialValue: detail.title ? detail.title : undefined,
                        rules: [
                          { required: true, message: '请输入文章标题！' },
                          { max: 50, message: '标题长度不能超过50个字！' },
                          { pattern: /^[\u0391-\uFFE5A-Za-z0-9-_,.]+$/, message: '不能输入特殊符号！' }
                        ],
                      })(
                        <Input style={{ width: '100%' }}
                               placeholder="标题长度不能超过20个字"
                               onChange={this.changeTitle}
                        />
                      )}
                    </FormItem>
                    <FormItem label="标签">
                      {getFieldDecorator('tags', {
                        initialValue: detail.tags ? detail.tags.split(',') : undefined,
                      })(
                        <Select
                          mode="tags"
                          style={{ width: '100%' }}
                          placeholder="请输入标签并以逗号隔开"
                          tokenSeparators={[',', '，']}
                          onChange={this.changeTags}
                        >
                          {tagsOption}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="描述">
                      {getFieldDecorator('description', {
                        initialValue: detail.description ? detail.description : undefined,
                        rules: [
                          { max: 200, message: '描述长度不能超过200个字！' },
                        ],
                      })(
                        <TextArea style={{ width: '100%' }}
                                  placeholder="描述长度不能超过100个字"
                                  autoSize={{ minRows: 2, maxRows: 4 }}
                                  onChange={this.changeDesc}
                        />
                      )}
                    </FormItem>
                    <FormItem label="版权">
                      {getFieldDecorator('copyright', {
                        initialValue: detail.copyright ? detail.copyright : 1
                      })(
                        <Select placeholder="请选择" onChange={this.changeCopyright}>
                          {copyrightOption}
                        </Select>
                      )}
                    </FormItem>
                  </div>

                </Form>
              </div>
              :
              <div className={styles.before}>
                <Upload
                  accept=".jpg,.png"
                  name="photo"
                  multiple={true}
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  customRequest={this.handleUploadPhoto}
                >
                  <Button size="large" type="primary">选择图片</Button>
                  <p className={styles.desc}>最多可上传30张图片，文件大小不超过2MB。</p>
                </Upload>
              </div>
          }
        </Modal>

      </span>
    )
  }

}
