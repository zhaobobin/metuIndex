/**
 * 延迟加载
 * 依赖：react-lazyload
 * 文档：https://github.com/jasonslyvia/react-lazyload
 * debounce [Number] 延迟时间，防闪烁
 * placeholder [Component] 占位组件，默认调用LoadingBg
 */
import LazyLoad from 'react-lazyload';
import LoadingBg from './LoadingBg'

export default function LoadLazy (props) {
  return(

    <LazyLoad
      {...props}
      debounce={props.debounce || 0}
      placeholder={
        props.placeholder || <LoadingBg style={{wdith: '100%', height: props.height}}/>
      }
    >
      {props.children}
    </LazyLoad>

  )
}
