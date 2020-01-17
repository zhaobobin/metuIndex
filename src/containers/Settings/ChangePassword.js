/**
 * 设置 - 修改密码
 */
import React from 'react';
import { connect } from 'dva';
import { Encrypt } from '@/utils';
import { Toast } from '@/components';

import FormInit from '@/components/Form/FormInit';

@connect(state => ({
  global: state.global
}))
export default class ChangePassword extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: '修改密码',
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

  handleModalSubmit = (values) => {
    if(values){
      const uid = this.props.global.currentUser._id;
      const oldPsd = Encrypt(uid, values.oldPsd)
      const newPsd = Encrypt(uid, values.password)
      this.props.dispatch({
        type: 'global/request',
        url: '/user/changePsd',
        method: 'POST',
        payload: {
          oldPsd,
          newPsd,
        },
        callback: (res) => {
          if(res.code === 0) {
            Toast.info(res.message, 2)
            this.hide()
          } else {
            Toast.info(res.message, 2)
          }
        }
      })
    } else {
      this.hide()
    }
  }

  render() {

    const {title, visible} = this.state

    const modalParams = [
      [
        {
          key: 'oldPsd',
          label: '原密码',
          type: 'Input',
          inputType: 'password',
          value: '',
          placeholder: '请输入原密码',
          /*  width:344,*/
          rules: [
            {required: true, message: '原密码不能为空！'},
            {min: 6, message: '请输入6-20位字母、数字或符号的组合！'},
            {max: 20, message: '密码长度只能在6-20位字符之间！'},
            // { pattern: /^[A-Za-z0-9]+$/, message: '原密码错误！' }
          ],
        },
        {
          key: 'password',
          label: '新密码',
          type: 'Input',
          inputType: 'password',
          value: '',
          placeholder: '请输入新密码',
          checkPsdLevel: true,
          rules: [
            {required: true, message: '请输入密码！'},
            {min: 6, message: '请输入6-20位字母、数字或符号的组合！'},
            {max: 20, message: '密码长度只能在6-20位字符之间！'},
            {validator: this.checkConfirm},
          ],
        },
        {
          key: 'password2',
          label: '确认新密码',
          type: 'Input',
          inputType: 'password',
          value: '',
          placeholder: '请再次输入新密码',
          validator: 'password',
          rules: [
            {required: true, message: '两次输入的密码不一致！'},
            {validator: this.checkConfirm},
          ]
        },
        {
          key: 'btn',
          type: 'BtnGroup',
          btns: [
            {
              name: '确认修改',
              type: 'primary',
              htmlType: 'submit',
            },
          ]
        }
      ],
    ]

    return (
      <FormInit
        onRef={ref => this.child = ref}
        params={modalParams}
        modal={{title: title, visible: visible}}
        callback={this.handleModalSubmit}
      />
    )
  }

}
