/**
 * 设置 - 个人信息
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Select } from 'antd'
import styles from './SettingsProfile.less'

import { Toast } from '@/components'
import InputText from '@/components/Form/InputText'
import SelectCity from '@/components/Form/SelectCity'

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  global: state.global
}))
@Form.create()
export default class SettingsProfile extends React.Component {

  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      title: '编辑个人信息',
      visible: false
    }
  }

  show = () => {
    this.setState({
      visible: true
    })
  }

  hide = () => {
    this.setState({
      visible: false
    })
  }

  nicknameCallback = (value, err) => {
    if(err){
      this.props.form.setFields({
        'nickname': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'nickname': value});
    }
  }

  professionalCallback = (value, err) => {
    if(err){
      this.props.form.setFields({
        'professional': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'professional': value});
    }
  }

  locationCallback = (value) => {
    let city = value.join(" - ");
    this.props.form.setFieldsValue({ 'location': city });
  }

  genderCallback = (value) => {
    this.props.form.setFieldsValue({ 'gender': value });
  }

  headlineCallback = (value, err) => {
    if(err){
      this.props.form.setFields({
        'headline': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'headline': value});
    }
  }

  submit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields('', (err, values) => {
      if (!err) {
        this.save(values)
      }
      setTimeout(() => { this.ajaxFlag = true }, 500);
    });

  }

  save(values){
    this.props.dispatch({
      type: 'global/request',
      url: '/user/changeProfile',
      method: 'POST',
      payload: values,
      callback: (res) => {
        if(res.code === 0) {
          Toast.info(res.message, 2);
          this.saveAccount(res.data);
          this.hide();
        }else{
          this.props.form.setFields({
            [res.error_key]: {
              value: '',
              errors: [new Error(res.message)]
            }
          });
        }
      }
    })
  }

  saveAccount(data){
    this.props.dispatch({
      type: 'global/changeCurrentUser',
      payload: data
    })
  }

  render(){

    const { title, visible } = this.state;
    const { currentUser } = this.props.global;
    const { getFieldDecorator } = this.props.form;

    return(
      <div className={styles.container}>

        <div className={styles.head}>
          <strong className={styles.title}>个人信息</strong>
          <a className={styles.action} onClick={this.show}>编辑</a>
        </div>

        <div className={styles.body}>
          <ul>
            <li>
              <label>昵称</label>
              <span>{currentUser.nickname}</span>
            </li>
            <li>
              <label>职业</label>
              <span>{currentUser.professional || '未设置'}</span>
            </li>
            <li>
              <label>地区</label>
              <span>{currentUser.location || '未设置'}</span>
            </li>
            <li>
              <label>性别</label>
              <span>
                { currentUser.gender === '0' ? '不详' : '' }
                { currentUser.gender === '1' ? '男' : '' }
                { currentUser.gender === '2' ? '女' : '' }
                { !currentUser.gender ? '未设置' : '' }
              </span>
            </li>
            <li>
              <label>签名</label>
              <span>{currentUser.headline || '未设置'}</span>
            </li>
          </ul>
        </div>

        <Modal
          width={400}
          title={title}
          visible={visible}
          centered={true}
          maskClosable={false}
          destroyOnClose={true}
          footer={null}
          wrapClassName={styles.changeProfile}
          onCancel={this.hide}
        >
          <Form onSubmit={this.submit}>
            <FormItem>
              {getFieldDecorator('nickname', {
                initialValue: currentUser.nickname || '',
                rules: [
                  { required: true, message: '请输入手机号' }
                ],
              })(
                <InputText initValue={currentUser.nickname} placeholder="昵称" callback={this.nicknameCallback}/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('professional', {
                initialValue: currentUser.professional || '',
                rules: [
                ],
              })(
                <InputText initValue={currentUser.professional} placeholder="职业" callback={this.professionalCallback}/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('location', {
                initialValue: currentUser.location || '',
                rules: [
                ],
              })(
                <SelectCity size="large" initValue={currentUser.location} callback={this.locationCallback}/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('gender', {
                initialValue: currentUser.gender || undefined,
                rules: [
                ],
              })(
                <Select size="large" placeholder="性别" onChange={this.genderCallback}>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                  <Option value="0">不详</Option>
                </Select>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('headline', {
                initialValue: currentUser.headline || '',
                rules: [
                ],
              })(
                <InputText initValue={currentUser.headline} placeholder="签名" callback={this.headlineCallback}/>
              )}
            </FormItem>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className={styles.btn}
              style={{marginBottom: '10px'}}
            >
              提交
            </Button>

          </Form>
        </Modal>

      </div>
    )
  }
}
