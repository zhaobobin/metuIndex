import React from 'react';

export default class _layout extends React.Component {

  componentDidMount(){
    window.scrollTo(0, 0);
  }

  render(){

    return(

      <div>

        <div>
          志同道合
          为热爱聚合
          准首领，快来申请组建圈子吧
        </div>

        <div>
          申请圈子标准
          信息完整：申请组建圈子的用户，个人主页需有头像、有封面且有15张以上代表作
          名称规范：
          1.部落名称应积极向上，不能涉及黄赌毒、政治类等敏感词汇
          2.部落名称不能与预留官方部落名称冲突
        </div>

      </div>

    )
  }

}
