import React from 'react';
import { Modal } from 'antd';
import CountDown from '@/components/Number/CountDown';
import styles from './Dialog.less'

const modal_options = {
  width: 430,
  centered: true,
  maskClosable: false,
  destroyOnClose: true,
  autoFocusButton: null,
};

export function Alert(opt){
  Modal.info({
    ...modal_options,
    maskClosable: true,
    className: styles.modalAlert,
    title: (
      <p className={styles.dialogTitle}>{opt.title}</p>
    ),
    okText: opt.btns || '确定',
    onOk() {
      return opt.callback(1)
    },
    onCancel() {
      return opt.callback(-1)
    },
  });
}

export function Confirm(opt){
  Modal.confirm({
    ...modal_options,
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

export function ArticleAlert(opt){
  Modal.info({
    ...modal_options,
    width: 700,
    className: styles.modalArticleAlert,
    title: (
      <h1 className={styles.ArticleTitle}>{opt.title}</h1>
    ),
    content: (
      <div className={styles.ArticleDetail} dangerouslySetInnerHTML={{__html: opt.msg}}/>
    ),
    okText: opt.btns ? opt.btns[0] : '确定',
    onOk() {
      return opt.callback(1)
    },
    onCancel() {
      return opt.callback(-1)
    },
  });
}

export function ResultAlert(opt){
  let modal = Modal.info({
    ...modal_options,
    maskStyle: opt.maskStyle || {},
    maskClosable: false,
    className: styles.modalAlert,
    title: '',
    content: (
      <div className={styles.dialogContent}>
        <img src={opt.img} alt="" />
        <p><strong>{opt.title}</strong></p>
        <p>
          {
            opt.time ?
              <CountDown
                num={opt.time}
                onEnd={() => {
                  modal.destroy();
                  opt.callback(2);            //自动执行
                }}
              />
              :
              null
          }
          <span>{opt.msg}</span>
        </p>
      </div>
    ),
    okText: opt.btns ? opt.btns[0] : '确定',
    onOk() {
      return opt.callback(1)                  //手动关闭
    },
    onCancel() {
      return opt.callback(-1)
    },
  });
}
