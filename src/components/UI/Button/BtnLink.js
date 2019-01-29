import { Link } from 'dva/router';
import styles from './BtnLink.less'

export default function BtnLink (props) {

  const {type, size} = props;

  let btnColor = '', btnSize = '';
  switch(type){
    case "default":
      btnColor = styles.btnDefault;
      break;
    case "submit":
      btnColor = styles.btnSubmit;
      break;
    default:
      btnColor = styles.btnDefault;
      break;
  }
  switch(size){
    case "small":
      btnSize = styles.btnSmall;
      break;
    case "large":
      btnSize = styles.btnLarge;
      break;
    default:
      break;
  }

  return(
    <Link
      to={props.to}
      className={`${styles.btnLink} ${btnColor} ${btnSize} ${props.className}`}
      style={props.style}
    >
      {props.children}
    </Link>
  )

}
