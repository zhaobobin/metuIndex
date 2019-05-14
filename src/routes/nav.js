import BaseRoutes from './base'
import UserRoutes from './user'
import DocRoutes from './doc'

// nav data
export const getNavData = app => {
  let base = BaseRoutes(app),
    user = UserRoutes(app),
    doc = DocRoutes(app);
  return [
    ...base,
    ...user,
    ...doc,
  ]
};
