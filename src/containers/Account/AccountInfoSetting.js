import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Row, Col, Card, Select } from 'antd';

import UploadAvatar from '@/components/Form/UploadAvatar'
import SelectCity from '@/components/Form/SelectCity'
import SelectDate from '@/components/Form/SelectDate'

const FormItem = Form.Item;
const { Option } = Select;

const keys1 = ['avatar', 'nickname', 'fullname', 'gender', 'birthday', 'introduction', 'city', 'homepage'];
const keys2 = ['address', 'zipcode', 'mobile', 'qq', 'idcard'];

@connect(state => ({
  global: state.global,
  oss: state.oss
}))
@Form.create()
export default class UserInfoSetting extends PureComponent {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      _id: '',
      username: '',

      userpic: '',            //用户头像
      fullname: '',           //真实姓名
      gender: '不详',          //性别
      birthday: '',           //生日
      introduction: '',       //个人简介
      city: '',               //所在城市
      homepage: '',           //个人主页

      address: '',            //通讯地址
      zipcode: '',            //邮编
      tel: '',                //电话
      qq: '',                 //QQ号
      idcard: ''              //身份证号
    };
  }

  componentDidMount(){

  }

  handleSelectPhoto = (value) => {
    this.props.form.setFieldsValue({
      avatar: value
    });
  };

  //选择性别
  handleSelectGender = (value) => {
    this.props.form.setFieldsValue({
      gender: value
    });
  };

  //选择日期
  handleSelectDate = (value) => {
    this.props.form.setFieldsValue({
      birthday: value ? value._d : ''
    });
  };

  //选择城市
  handleSelectCity = (value) => {
    let city = value.join(" - ");
    this.props.form.setFieldsValue({
      city: city
    });
  };

  saveBaseinfo = (e) => {
    e.preventDefault();
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
    this.props.form.validateFields(keys1, (err, values) => {
      if(!err){
        this.userUpdate(values);
      }else{
        this.ajaxFlag = true;
      }
    });
  };

  saveConnect = (e) => {
    e.preventDefault();
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
    this.props.form.validateFields(keys2, (err, values) => {
      if(!err){
        this.userUpdate(values);
      }else{
        this.ajaxFlag = true;
      }
    });
  };

  userUpdate(values){
    values._id = this.props.global.currentUser._id;
    //console.log(values)
    this.props.dispatch({
      type: 'global/update',
      payload: values,
      callback: (res) => {
        this.ajaxFlag = true;
      }
    });
  }

  render(){

    const { getFieldDecorator } = this.props.form;
    const {currentUser} = this.props.global;

    const formItemLayout = {                                                                //表单元素布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 4,
        },
      },
    };

    return(
      <Row>
        <Col xs={0} sm={0} md={7} lg={7} />
        <Col xs={24} sm={24} md={10} lg={10}>
          <Card title="基本信息" style={{marginBottom: '20px'}}>

            <Form onSubmit={this.saveBaseinfo} className="setting-form">

              <FormItem {...formItemLayout} label="头像" hasFeedback>
                {getFieldDecorator('avatar', {
                  initialValue: currentUser.avatar
                })(
                  <UploadAvatar url={currentUser.avatar} callback={this.handleSelectPhoto}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="昵称" hasFeedback>
                {getFieldDecorator('nickname', {
                  initialValue: currentUser.nickname,
                  rules: [
                    { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '只能输入汉子和字母！' }
                  ]
                })(
                  <Input placeholder="" />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="真实姓名" hasFeedback>
                {getFieldDecorator('fullname', {
                  initialValue: currentUser.fullname,
                  rules: [
                    { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '只能输入汉子和字母！' }
                  ]
                })(
                  <Input placeholder="" />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="性别" hasFeedback>
                {getFieldDecorator('gender', {
                  initialValue: currentUser.gender
                })(
                  <Select onChange={this.handleSelectGender}>
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                    <Option value="0">不详</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="生日" hasFeedback>
                {getFieldDecorator('birthday', {
                  initialValue: currentUser.birthday
                })(
                  <SelectDate date={currentUser.birthday} handleSelectDate={this.handleSelectDate} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="个人简介" hasFeedback>
                {getFieldDecorator('introduction', {
                  initialValue: currentUser.introduction,
                  rules: [
                    { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '只能输入汉子和字母！' }
                  ]
                })(
                  <Input placeholder="" />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="所在城市" hasFeedback>
                {getFieldDecorator('city', {
                  initialValue: currentUser.city
                })(
                  <SelectCity defaultValue={currentUser.city} callback={this.handleSelectCity} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="个人主页" hasFeedback>
                {getFieldDecorator('homepage', {
                  initialValue: currentUser.homepage,
                  rules: [
                    { pattern: /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/, message: '网址输入格式有误！' }
                  ]
                })(
                  <Input placeholder="" />
                )}
              </FormItem>

              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">保存</Button>
              </FormItem>

            </Form>

          </Card>

          <Card title="联系方式">

            <p className="desp">"谜图网"有时候会寄送纪念品，或者联系你向杂志社或其它媒体供稿，但是绝对不会泄露你的联系信息</p>

            <Form onSubmit={this.saveConnect} className="setting-form">

              <FormItem {...formItemLayout} label="通讯地址" hasFeedback>
                {getFieldDecorator('address', {
                  initialValue: currentUser.address,
                  rules: [
                    { pattern: /^[\u0391-\uFFE5A-Za-z0-9#-]+$/, message: '只能输入汉子、字母和数字！' }
                  ]
                })(
                  <Input placeholder="" />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="邮编" hasFeedback>
                {getFieldDecorator('zipcode', {
                  initialValue: currentUser.zipcode,
                  rules: [
                    { pattern: /^[1-9][0-9]{5}$/, message: '邮编输入格式有误！' }
                  ]
                })(
                  <Input placeholder="" />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="手机" hasFeedback>
                {getFieldDecorator('mobile', {
                  initialValue: currentUser.tel,
                  rules: [
                    { pattern: /^1[0-9]{10}$/, message: '手机号码输入格式有误！' }
                  ]
                })(
                  <Input placeholder="" />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="QQ" hasFeedback>
                {getFieldDecorator('qq', {
                  initialValue: currentUser.qq,
                  rules: [
                    { pattern: /^[1-9][0-9]{4,}$/, message: 'QQ号码输入格式有误！' }
                  ]
                })(
                  <Input placeholder="" />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="身份证号" hasFeedback>
                {getFieldDecorator('idcard', {
                  initialValue: currentUser.idcard,
                  rules: [
                    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证输入格式有误！' }
                  ]
                })(
                  <Input placeholder="" />
                )}
              </FormItem>

              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">保存</Button>
              </FormItem>

            </Form>

          </Card>
        </Col>
        <Col xs={0} sm={0} md={7} lg={7} />
      </Row>
    )

  }

}
