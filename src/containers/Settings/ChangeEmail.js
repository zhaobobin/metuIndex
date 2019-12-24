/**
 * 设置 - 修改邮箱
 */
import React from 'react'
import {connect} from 'dva'
import { Form, Button, Modal } from 'antd'
import { Validator, Encrypt } from '@/utils';
import styles from './ChangeMobile.less'

import { Toast } from '@/components'
import InputEmail from '@/components/Form/InputEmail'
import InputEmailcode from '@/components/Form/InputEmailcode'

const FormItem = Form.Item;

@connect(state => ({
  global: state.global
}))
@Form.create()
export default class ChangeEmail extends React.Component {

  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      title: '绑定邮箱',
      visible: false
    }
  }

  componentDidMount(){
    this.props.onRef(this)
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

  //邮箱
  emailCallback = (value, err) => {
    if(err){
      this.props.form.setFields({
        'email': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'email': value});
      // this.props.form.validateFields(['email'], (err, values) => {});
    }
  };

  //邮箱验证码回调
  emailcodeCallback = (value, err) => {
    //清空错误提示
    if(err === 'emailError'){
      this.props.form.setFields({
        'email': {
          value: '',
          errors: [new Error('请输入邮箱')]
        }
      });
    }
    else if(err === 'clearError'){
      this.props.form.setFields({
        'emailcode': {
          value: '',
          errors: ''
        }
      });
    }
    else if(err === 'smscodeError'){
      this.props.form.setFields({
        'emailcode': {
          value: '',
          errors: [new Error(!value ? '请输入邮箱验证码' : '邮箱验证码格式有误')]
        }
      });
    }
    else{
      this.props.form.setFieldsValue({'emailcode': value});
    }
  };

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
      url: '/user/changeEmail',
      method: 'POST',
      payload: values,
      callback: (res) => {
        if(res.code === 0) {
          Toast.info(res.message, 2);
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

  render(){

    const { title, visible } = this.state;
    const { currentUser } = this.props.global;
    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    const subTitle = currentUser.email || '未绑定'

    return(
      <Modal
        width={400}
        title={title + " " + subTitle}
        visible={visible}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        footer={null}
        wrapClassName={styles.changeMobile}
        onCancel={this.hide}
      >
        <Form onSubmit={this.submit}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: '请输入邮箱' }
              ],
            })(
              <InputEmail callback={this.emailCallback}/>
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('emailcode', {
              rules: [
                { required: true, message: '请输入验证码' },
              ]
            })(
              <InputEmailcode
                type="change"
                email={Validator.hasErrors(getFieldsError(['email'])) ? '' : getFieldValue('email')}
                callback={this.emailcodeCallback}
              />
            )}
          </FormItem>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.btn}
            style={{marginBottom: '10px'}}
            disabled={
              Validator.hasErrors(getFieldsError()) ||
              !getFieldValue('email') ||
              !getFieldValue('emailcode') ||
              getFieldValue('emailcode').length < 6
            }
          >
            提交
          </Button>

        </Form>
      </Modal>
    )
  }

}
