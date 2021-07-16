/**
 * 表单 - 单行文本输入框
 */
import React, { useState } from "react";
import { Input } from "antd";

export const InputText = (props) => {
  const { maxLength, placeholder, disabled, defaultValue, callback } = props;

  const [value, setValue] = useState(defaultValue);

  const changeValue = (e) => {
    let value = e.target.value;
    setValue(value);
    if (callback) {
      callback(value);
    }
  };

  return (
    <Input
      size="large"
      autoComplete="off"
      placeholder={placeholder}
      onChange={changeValue}
      value={value}
      maxLength={maxLength}
      disabled={disabled}
      allowClear={true}
    />
  );
};

export default InputText;
