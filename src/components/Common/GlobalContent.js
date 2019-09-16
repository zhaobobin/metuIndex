import styles from './GlobalContent.less'

export default function GlobalContent (props) {
  return(
    <div className={styles.container}>
      {props.children}
    </div>
  )
};
