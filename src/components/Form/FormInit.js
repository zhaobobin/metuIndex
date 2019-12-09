/*
 * 表单生成器
 * layout: 布局类型，垂直vertical，水平horizontal
 * modal: 使用弹出框
 * params: 二维数组，用于生成表单结构
 * callback: 回调函数
 * demo:
 <FormInit layout="horizontal" params={searchParams} callback={this.refreshList}/>
 <FormInit
   onRef={ref => this.child = ref}
   params={modalParams}
   modal={{title: modalTitle, visible: modalVisible}}
   callback={this.handleModalSubmit}
 />
 */
import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Select, DatePicker, Modal, Icon } from 'antd';
import { Validator } from '@/utils';
import styles from './FormInit.less';

import InputSmscode from '@/components/Form/InputSmscode'
//import CitySelect from './CitySelect'


const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
    md: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
    md: { span: 17 },
  },
};

const btnLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      offset: 7,
      span: 17,
    },
    md: {
      offset: 7,
      span: 17,
    },
  },
};


@Form.create()
export default class FormInit extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      layout: '',               //布局
      psdLevelVisible: false,
      psdLevel: '',             //密码强度
      psdLevelStyle: '',
    }
  }

  componentDidMount(){
    if(this.props.onRef) this.props.onRef(this);                    //绑定到父组件
    this.initValidate();
  }

  //初始化时校验表单
  initValidate = () => {
    if(this.props.initValidate) this.props.form.validateFields();
  };

  //按条件查询
  handleFormSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields('', (err, values) => {
      if (err) return;
      //this.props.form.resetFields();
      this.props.callback(values);
    });
  };

  //重置查询
  handleFormReset = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
    this.initValidate();
    this.props.callback()
  };

  //清空表单
  clearForm = () => {
    this.props.form.resetFields();
    this.initValidate();
  };

  //清空输入框
  emitEmpty(key){
    this.props.form.resetFields([key]);
    this.initValidate();
    this.setState({
      psdLevel: ''
    })
  };

  //设置表单内容
  setFieldsValue = ({key, value}) => {
    let obj = {};
    obj[key] = value;
    this.props.form.setFieldsValue(obj);
  };

  //设置错误信息
  setFieldsError = ({key, value, msg}) => {
    let obj = {};
    obj[key] = {
      value: value,
      errors: [new Error(msg)]
    };
    this.props.form.setFields(obj)
  };

  //监控输入变化
  onValuesChange = (key) => {
    let value = this.props.form.getFieldValue(key);
    if(this.props.onValuesChange) this.props.onValuesChange({key, value})
  };

  //比对密码
  checkConfirm = (rule, value, callback) => {
    if (value && value !== this.props.form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  };

  //检查密码强度
  checkPsd = (e) => {
    let psdLevel, psdLevelStyle, value = e.target.value;

    if(value) {
      let psdModes = Validator.checkPsdLevel(value);
      switch(psdModes){
        case 1 :
          psdLevel = '';
          psdLevelStyle = '';
          break;
        case 2 :
          psdLevel = '弱';
          psdLevelStyle = styles.psdLevelError;
          break;
        case 3 :
          psdLevel = '中';
          psdLevelStyle = styles.psdLevelMiddle;
          break;
        case 4 :
          psdLevel = '强';
          psdLevelStyle = styles.psdLevelStrong;
          break;
        default:
          psdLevel = '';
          psdLevelStyle = '';
          break;
      }
    }
    this.setState({
      psdLevel,
      psdLevelStyle
    });
  };

  changePsdLevelVisible = () => {
    let psdLevelVisible = !this.state.psdLevelVisible;
    this.setState({
      psdLevelVisible
    })
  };

  //依据表单类型，返回相应的html
  getFormItem = (topic, form, initValidate, formItemLayout, btnItemLayout) => {
    let html = '', style = topic.width ? {width: topic.width} : {width: '100%'};

    switch(topic.type){
      case 'Input':
        let { psdLevel, psdLevelVisible, psdLevelStyle } = this.state;
        html = <FormItem
          {...formItemLayout}
          label={topic.label}
          validateStatus={
            form.isFieldTouched(topic.key) && form.getFieldError(topic.key) ? 'error' : ''
          }
          help={form.isFieldTouched(topic.key) && form.getFieldError(topic.key) || ''}
        >
          {form.getFieldDecorator(topic.key, {
            initialValue: topic.value ? topic.value : undefined,
            validateFirst: true,
            rules: [
              ...topic.rules,
              { validator: (topic.validator === 'password' ? this.checkConfirm : null) }
            ]
          })(
            <Input
              type={topic.inputType ? topic.inputType : 'text'}
              placeholder={topic.placeholder}
              size="large"
              style={style}
              autoComplete="off"
              disabled={topic.disabled}
              onFocus={topic.checkPsdLevel ? this.changePsdLevelVisible : null}
              onBlur={topic.checkPsdLevel ? this.changePsdLevelVisible : null}
              onChange={topic.checkPsdLevel ? this.checkPsd : null}
              suffix={
                <span className={styles.suffix}>
                  {
                    !topic.disabled && form.getFieldValue(topic.key) ?
                      <Icon
                        type="close-circle"
                        className={styles.clearInput}
                        onClick={() => this.emitEmpty(topic.key)}
                      />
                      :
                      null
                  }
                  <em className={styles.suffixText}>{topic.suffix ? topic.suffix : null}</em>
                </span>
              }
            />
          )}
          {
            topic.checkPsdLevel && psdLevelVisible && form.getFieldValue(topic.key) ?
              <div className={styles.psdStatus + " " + psdLevelStyle}>
                <p className={styles.box}>
                  <span className={styles.line}><em className={styles.block}/></span>
                  <span className={styles.line}><em className={styles.block}/></span>
                  <span className={styles.line}><em className={styles.block}/></span>
                  <span className={styles.text}>{psdLevel}</span>
                </p>
              </div>
              :
              null
          }
        </FormItem>;
        break;

      case 'InputNumber':
        html = <FormItem
          {...formItemLayout}
          label={topic.label}
          validateStatus={
            form.isFieldTouched(topic.key) && form.getFieldError(topic.key) ? 'error' : ''
          }
          help={form.isFieldTouched(topic.key) && form.getFieldError(topic.key) || ''}
        >
          {form.getFieldDecorator(topic.key, {
            initialValue: topic.value ? topic.value : undefined,
            rules: topic.rules ? topic.rules : undefined
          })(
            <InputNumber min={0} max={9} placeholder={topic.placeholder} style={style} />
          )}
        </FormItem>;
        break;

      case 'RangePicker':
        html = <FormItem
          {...formItemLayout}
          label={topic.label}
          validateStatus={
            form.isFieldTouched(topic.key) && form.getFieldError(topic.key) ? 'error' : ''
          }
          help={form.isFieldTouched(topic.key) && form.getFieldError(topic.key) || ''}
        >
          {form.getFieldDecorator(topic.key, {
            initialValue: topic.value ? topic.value : undefined,
            rules: topic.rules ? topic.rules : undefined
          })(
            <RangePicker style={style} size="large" />
          )}
        </FormItem>;
        break;

      case 'Select':
        html = <FormItem
          {...formItemLayout}
          label={topic.label}
          validateStatus={
            form.isFieldTouched(topic.key) && form.getFieldError(topic.key) ? 'error' : ''
          }
          help={form.isFieldTouched(topic.key) && form.getFieldError(topic.key) || ''}
        >
          {form.getFieldDecorator(topic.key, {
            initialValue: topic.value ? topic.value : undefined,
            rules: topic.rules ? topic.rules : undefined
          })(
            <Select
              placeholder={topic.placeholder}
              style={style}
              size="large"
              onChange={
                topic.onValuesChange ?
                  this.onValuesChange(topic.key)
                  :
                  null
              }
            >
              {
                topic.option.map((op, key) => (
                  <Option key={key} value={op.value} className={op.ischildren ? styles.ischildren : ''}>{op.label}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>;
        break;

      // case 'SelectCity':
      //   html = <FormItem {...formItemLayout} label={topic.label}>
      //     {form.getFieldDecorator(topic.key, {
      //       initialValue: topic.value ? topic.value : undefined,
      //     })(
      //       <CitySelect
      //         city={topic.value}
      //         handleSelectCity={
      //           (value) => {
      //             let city = value.join(" - ");                     //数组转字符串
      //             this.props.form.setFieldsValue({
      //               [topic.key]: city
      //             });
      //           }
      //         }
      //       />
      //     )}
      //   </FormItem>;
      //   break;

      case 'SmsValidate':
        html = <FormItem
          {...formItemLayout}
          label={topic.label}
          validateStatus={
            form.isFieldTouched(topic.key) && form.getFieldError(topic.key) ? 'error' : ''
          }
          help={form.isFieldTouched(topic.key) && form.getFieldError(topic.key) || ''}
        >
          {form.getFieldDecorator(topic.key, {
            rules: topic.rules ? topic.rules : undefined
          })(
            <InputSmscode
              boxStyle={topic.boxStyle}
              action={topic.action}
              mobile={topic.mobile ? topic.mobile : Validator.hasErrors(form.getFieldsError([topic.telKey])) ? '' : form.getFieldValue(topic.telKey)}
              api={topic.api}
              callback={(value) => {
                this.props.form.setFieldsValue({[topic.key]: value});
                this.props.form.validateFields([topic.key], (err, values) => {});
              }}
            />
          )}
        </FormItem>;
        break;

      case 'BtnGroup':
        html = <FormItem {...btnItemLayout} className={styles.btnGroup}>
          {
            topic.btns.map((btn, k) => (
              <Button
                key={k}
                type={btn.type}
                htmlType={btn.htmlType}
                style={btn.style ? btn.style : null}
                onClick={btn.htmlType === 'submit' ? this.handleFormSubmit : this.handleFormReset}
                loading={btn.loading || null}
                disabled={
                  topic.disabled
                  ||
                  ( btn.htmlType === 'submit' && Validator.hasErrors(form.getFieldsError()) )
                  ||
                  ( btn.htmlType === 'reset' && initValidate && !form.isFieldsTouched() )
                }
              >
                {btn.name}
              </Button>
            ))
          }
        </FormItem>;
        break;

      default:
        html = '';
        break;
    }
    return html;
  };

  render(){

    const {
      form, modal, layout='vertical', params, initValidate,
      formItemLayout=formLayout, btnItemLayout=btnLayout
    } = this.props;

    const inputBox = params.map((item, index) => (
      <Row key={index} gutter={{ md: 8, lg: 24, xl: 48 }}>
        {
          item.map((topic, key) => (
            <Col key={key}
                 className={styles.col}
                 sm={24} xs={24}
                 md={
                   layout === "horizontal" ?
                     parseInt(24 / item.length, 10)
                     :
                     24
                 }
            >
              {
                this.getFormItem(topic, form, initValidate, formItemLayout, btnItemLayout)
              }
            </Col>
          ))
        }
      </Row>
    ));

    return(
      <div className={styles.formInit}>
        {
          modal ?
            <Modal
              width={700}
              title={modal.title}
              visible={modal.visible}
              centered={true}
              maskClosable={false}
              destroyOnClose={true}
              footer={null}
              wrapClassName={styles.modalForm}
              onOk={this.handleFormSubmit}
              onCancel={this.handleFormReset}
            >
              <Form hideRequiredMark={true} className={styles.modalForm}>{inputBox}</Form>
            </Modal>
            :
            <Form
              hideRequiredMark={true}
              onSubmit={this.handleFormSubmit}
              onReset={this.handleFormReset}
            >
              {inputBox}
            </Form>
        }
      </div>
    )
  }

}
