/**
 * 嵌套路由 - 返回对应分类的路由数组
 * category [String] 传入父级分类的key
 */
import app from '@/index'
import { getNavData } from '@/routes/nav';

const navData = getNavData(app)[0].children;

export default function RouteExtend(category){

  let InfoData,
    Routes = {path: '', children: []};
  for(let i in navData){
    if(navData[i].key === category) {
      InfoData = navData[i].children;
      Routes.key = navData[i].key;
      Routes.path = navData[i].path;
    }
  }
  for(let i in InfoData){
    Routes.children.push(InfoData[i]);
  }

  return Routes;
}
