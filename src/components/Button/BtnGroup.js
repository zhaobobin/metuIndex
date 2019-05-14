import styles from './BtnGroup.less'

export default function BtnGroup (props) {

  return(
    <div
      className={ `${props.className} ${styles.cusBtnGroup}`}
      style={props.style}
    >
      {props.children}
    </div>
  )

}
