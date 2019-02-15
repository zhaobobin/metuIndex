import React from 'react';
import { Modal } from 'antd';
import styles from './Dialog.less'

const modal_options = {
  width: '430px',
  centered: true,
  destroyOnClose: true,
  autoFocusButton: null,
};

export function Confirm(opt){
  Modal.confirm({
    ...modal_options,
    maskClosable: false,
    className: styles.modalConfirm,
    title: (
      <p className={styles.dialogTitle}>{opt.title}</p>
    ),
    okText: opt.btns ? opt.btns[0] : '确定',
    cancelText: opt.btns ? opt.btns[1] : '取消',
    onOk() {
      return opt.callback(1)
    },
    onCancel() {
      return opt.callback(0);
    },
  });
}
