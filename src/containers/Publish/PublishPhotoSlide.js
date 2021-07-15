/**
 * 发布 - 表单数据提交
 */
import React from "react";
import { routerRedux } from "dva/router";
import { connect } from "dva";
import { Form, Input, Select, Button, Modal } from "antd";
import styles from "./PublishSlide.less";

import PublishConfig from "./PublishConfig";
// import UploadPhoto from '@/components/Form/UploadPhoto'
import { Toast } from "@/components";
import InputText from "@/components/Form/InputText";

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { Option } = Select;

@connect((state) => ({
  global: state.global,
  publish: state.publish,
}))
@Form.create()
export default class PublishRight extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {};
  }

  componentWillUnmount() {
    // 页面卸载时，清空redux
    this.props.dispatch({
      type: "publish/savePhoto",
      payload: {
        images: [],
        thumb: "",
      },
    });
  }

  // 标题
  titleCallback = (value) => {
    this.props.form.setFieldsValue({ title: value });
    this.props.form.validateFields(["title"], (err, values) => {});
  };

  // 确定
  formSubmit = (e) => {
    e.preventDefault();
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    const { images, thumb } = this.props.publish.photo;

    this.props.form.validateFields("", (err, values) => {
      // console.log(values)
      if (!err) {
        for (let i in images) {
          delete images[i].loading;
          delete images[i].base64;
        }
        values.images = images;
        values.thumb = thumb || "";
        if (values.tags) values.tags = values.tags.join(",");
        this.saveData(values);
      } else {
        this.ajaxFlag = true;
      }
    });
  };

  // 保存数据
  saveData(values) {
    const { currentUser } = this.props.global;
    const { id } = this.props;
    if (id) {
      values.id = id;
    }

    //保存时，执行ossDel列表对应文件的删除操作
    this.props.dispatch({
      type: "global/request",
      url: id ? `/photos/${id}` : "/photos",
      method: id ? "PATCH" : "POST",
      payload: values,
      callback: (res) => {
        this.ajaxFlag = true;
        if (res.code === 0) {
          Toast.info(res.message, 2);
          this.props.form.resetFields();
          this.props.dispatch(
            routerRedux.push(`/users/${currentUser.username}/photos`)
          );
        } else {
          if (res.error_key) {
            this.props.form.setFields({
              [res.error_key]: {
                value: "",
                errors: [new Error(res.message)],
              },
            });
          } else {
            Toast.info(res.message, 2);
          }
        }
      },
    });
  }

  // 取消
  formCancel = (e) => {
    e.preventDefault();

    confirm({
      title: "取消编辑?",
      okText: "确定",
      cancelText: "取消",
      content: "所有未保存的数据都将被清除！",
      onOk() {
        window.history.go(-1);
      },
      onCancel() {},
    });
  };

  render() {
    const { global, form, publish } = this.props;
    const { getFieldDecorator } = form;

    //标签option
    const tagsOption = PublishConfig.tags.map((topic, index) => (
      <Option key={index} value={topic}>
        {topic}
      </Option>
    ));

    //版权option
    const copyrightOption = PublishConfig.copyright.map((topic, index) => (
      <Option key={index} value={topic.value}>
        {topic.label}
      </Option>
    ));

    return (
      <div className={styles.slide}>
        <Form
          hideRequiredMark
          onSubmit={this.formSubmit}
          onReset={this.formCancel}
        >
          <FormItem label="标题">
            {getFieldDecorator("title", {
              initialValue: publish.photo.title || undefined,
              validateFirst: true,
              validateTrigger: "onBlur",
              rules: [
                { required: true, message: "请输入文章标题！" },
                { max: 20, message: "标题长度不能超过20个字！" },
              ],
            })(
              <InputText
                maxLength={20}
                defaultValue={publish.photo.title}
                placeholder="标题长度不能超过20个字"
                callback={this.titleCallback}
              />
            )}
          </FormItem>

          <FormItem label="描述">
            {getFieldDecorator("description", {
              initialValue: publish.photo.description || undefined,
              rules: [{ max: 200, message: "描述长度不能超过200个字！" }],
            })(
              <TextArea
                style={{ width: "100%" }}
                placeholder="描述长度不能超过200个字"
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            )}
          </FormItem>

          <FormItem label="标签">
            {getFieldDecorator("tags", {
              initialValue: publish.photo.tags
                ? publish.photo.tags.split(",")
                : undefined,
            })(
              <Select
                mode="tags"
                size="large"
                style={{ width: "100%" }}
                placeholder="请输入标签，并以逗号隔开"
                tokenSeparators={[",", "，"]}
              >
                {tagsOption}
              </Select>
            )}
          </FormItem>

          <FormItem label="版权">
            {getFieldDecorator("copyright", {
              initialValue: publish.photo.copyright || 1,
            })(
              <Select size="large" placeholder="请选择">
                {copyrightOption}
              </Select>
            )}
          </FormItem>

          <Button
            className={styles.submit}
            size="large"
            type="primary"
            htmlType="submit"
            disabled={!publish.photo.images || global.submitting}
          >
            发布
          </Button>
        </Form>
      </div>
    );
  }
}
