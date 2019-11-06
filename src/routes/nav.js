/**
 * 导航
  首页
    -- 社区 /community
        -- 作品 /community/discover
        -- 教程 /community/course
        -- 问答 /community/question
        -- 器材 /community/equipments
        -- 话题 /community/topics
    图库
 */
import BaseRoutes from './base'
import UserRoutes from './user'

// nav data
export const getNavData = app => {
  let base = BaseRoutes(app),
    user = UserRoutes(app);
  return [
    ...base,
    ...user,
  ]
};
