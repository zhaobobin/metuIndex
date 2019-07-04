## 用户 User

#### 模型

```
{
  token: String,
  userType: {type: String, default: 'user'},  //用户类型 - 管理员、用户

  username: {type: String, unique: true},	//用户名
  password: String,												//密码
  nickname: String,												//昵称

  avatar: String,												  	//头像
  fullname: String,												//真实姓名
  gender: String,													//性别
  userpic: String,												//头像
  banner: String,													//用户主页头图
  birthday: Date,													//生日 - Moment对象
  introduction: String,											//个人简介
  city: {type: String, default: '中国'},							//所在城市
  homepage: String,												//个人主页

  address: String,												//通讯地址
  zipcode: String,												//邮编
  email: String,													//邮箱
  tel: String,													//手机
  prefix: String,													//手机区号
  qq: '',															//QQ号
  idcard: '',														//身份证号

  remark: String,													//评论
  level: Number,													//等级
  point: Number,													//积分
  theme: Number,													//主题编号
  groupid: Number,												//会员组id
  collect: [{type: ObjectId, ref: 'Article'}],					//收藏过的文章，映射文章id
  like: [{type: ObjectId, ref: 'Article'}],					  	//喜欢的文章，映射文章id
  follow: [{type: ObjectId, ref: 'User'}],						//关注过的用户，映射用户id
  fans: [{type: ObjectId, ref: 'User'}],							//粉丝

  wechat_openid: String,											// 微信，保存用户openid，与wechat模型进行匹配
  weibo_uid: String,												// 微博，保存用户id，与weibo模型进行匹配
  qq_openid: String,												// QQ，保存用户openid，与qq模型进行匹配

  role: {type: ObjectId, ref: 'Role'},    //角色 映射Role表
  regip: String,													//注册ip
  lastip: String,													//最后登录ip
  createtime: {type: Date, default: Date.now()},					//注册时间
  updatetime: {type: Date, default: Date.now()},					//最后登录时间
  status: {type: Number, default: 1}								//审核状态，1为通过、0为拒绝。
}
```
