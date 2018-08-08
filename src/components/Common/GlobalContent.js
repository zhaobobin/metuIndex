import React from 'react';

import styles from './GlobalContent.less'

const GlobalContent = (props) => {
  return(
    <div className={styles.content}>
      {props.children}
    </div>
  )
};

export default GlobalContent
