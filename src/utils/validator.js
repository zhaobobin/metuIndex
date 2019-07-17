/**
 * 表单校验
 */
const Validator = {

  /**
   * Form字段错误检查
   * @param fieldsError
   * @returns {boolean}
   */
  hasErrors: function (fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  },

  /**
   * 判断是否是手机号
   * @param tel
   * @returns {boolean}
   */
  isMobile: function (tel) {
    let reg = /^1[0-9]{10}$/;
    return reg.test(tel);
  },

  /**
   * 动态检查输入值是不是手机号，1开头并且 <= 11位数值返回true
   * @param value
   */
  checkMobile: function (value) {
    if (value.substr(0, 1) === '1') {
      return value.length <= 11;
    } else {
      return false;
    }
  },

  /**
   * 判断是否是邮箱
   * @param email
   * @returns {boolean}
   */
  isEmail: function (email) {
    let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return reg.test(email);
  },

  /**
   * 密码强度
   * @param value
   * @returns {number}
   */
  checkPsdLevel: function (value) {
    // 0： 表示第一个级别， 1：表示第二个级别， 2：表示第三个级别， 3： 表示第四个级别， 4：表示第五个级别
    let modes = 0;
    if (value.length < 8) {//最初级别
      return modes;
    }
    if (/\d/.test(value)) {//如果用户输入的密码 包含了数字
      modes++;
    }
    if (/[a-z]/.test(value)) {//如果用户输入的密码 包含了小写的a到z
      modes++;
    }
    if (/\W/.test(value)) {//如果是非数字 字母 下划线
      modes++;
    }
    if (/[A-Z]/.test(value)) {//如果用户输入的密码 包含了大写的A到Z
      modes++;
    }
    return modes;
  }

}

export default Validator;
