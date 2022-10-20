import React from "react";
import { Link } from "dva/router";
import { Row, Col } from "antd";
import styles from "./TagLayout.less";

const TAGS = [
  {
    name: "题材",
    children: [
      { name: "城市", img: require('@/assets/tags/920727016.jpg') },
      { name: "人像", img: require('@/assets/tags/1243033096.jpg') },
      { name: "纪实", img: require('@/assets/tags/1293429988.jpg') },
      { name: "叶子", img: require('@/assets/tags/955985505.jpg') },
      { name: "风光", img: require('@/assets/tags/810495475.jpg') },
      { name: "云", img: require('@/assets/tags/1237528067.jpg') },

      { name: "树", img: require('@/assets/tags/1146039719.jpg') },
      { name: "公园", img: require('@/assets/tags/1136274899.jpg') },
      { name: "山", img: require('@/assets/tags/771501615.jpg') },
      { name: "特写", img: require('@/assets/tags/678243816.jpg') },
      { name: "海", img: require('@/assets/tags/1052847491.jpg') },
      { name: "昆虫", img: require('@/assets/tags/1222979094.jpg') },

      { name: "动物", img: require('@/assets/tags/1111830085.jpg') },
      { name: "景观", img: require('@/assets/tags/698428803.jpg') },
      { name: "晚霞", img: require('@/assets/tags/1238249068.jpg') },
      { name: "人文", img: require('@/assets/tags/1016147538.jpg') },
      { name: "儿童", img: require('@/assets/tags/968699374.jpg') },
      { name: "女孩", img: require('@/assets/tags/984952062.jpg') },
    ],
  },
  {
    name: "风格",
    children: [
      { name: "抓拍", img: require('@/assets/tags/729034309.jpg') },
      { name: "色彩", img: require('@/assets/tags/1308896677.jpg') },
      { name: "可爱", img: require('@/assets/tags/911093298.jpg') },
      { name: "黑白", img: require('@/assets/tags/668806719.jpg') },
      { name: "时尚", img: require('@/assets/tags/1027616242.jpg') },
      { name: "微距", img: require('@/assets/tags/1246572141.jpg') },

      { name: "绿色", img: require('@/assets/tags/1288515060.jpg') },
      { name: "复古", img: require('@/assets/tags/1064643919.jpg') },
      { name: "日系", img: require('@/assets/tags/893595081.jpg') },
      { name: "写真", img: require('@/assets/tags/855781030.jpg') },
      { name: "文化", img: require('@/assets/tags/1281568353.jpg') },
      { name: "创意", img: require('@/assets/tags/987639305.jpg') },
    ],
  },
  {
    name: "器材",
    children: [
      { name: "手机", img: require('@/assets/tags/977219324.jpg') },
      { name: "尼康", img: require('@/assets/tags/847523297.jpg') },
      { name: "佳能", img: require('@/assets/tags/1283731020.jpg') },
      { name: "哈苏", img: require('@/assets/tags/1003302313.jpg') },
      { name: "富士", img: require('@/assets/tags/1036266827.jpg') },
      { name: "适马", img: require('@/assets/tags/1006644592.jpg') },

      { name: "广角", img: require('@/assets/tags/758590977.jpg') },
      { name: "50mm", img: require('@/assets/tags/1242901969.jpg') },
      { name: "35mm", img: require('@/assets/tags/1287728636.jpg') },
      { name: "LX5", img: require('@/assets/tags/1262824741.jpg') },
      { name: "中画幅", img: require('@/assets/tags/1034955573.jpg') },
      { name: "70-200", img: require('@/assets/tags/910436066.jpg') },
    ],
  },
  {
    name: "地区",
    children: [
      { name: "深圳", img: require('@/assets/tags/1299656153.jpg') },
      { name: "西湖", img: require('@/assets/tags/1111961013.jpg') },
      { name: "杭州", img: require('@/assets/tags/947400186.jpg') },
      { name: "武汉", img: require('@/assets/tags/802369014.jpg') },
      { name: "日本", img: require('@/assets/tags/1243295059.jpg') },
      { name: "成都", img: require('@/assets/tags/914697312.jpg') },

      { name: "重庆", img: require('@/assets/tags/766651851.jpg') },
      { name: "云南", img: require('@/assets/tags/1217342886.jpg') },
      { name: "厦门", img: require('@/assets/tags/1160064589.jpg') },
      { name: "新疆", img: require('@/assets/tags/859188455.jpg') },
      { name: "贵州", img: require('@/assets/tags/904080904.jpg') },
      { name: "阳朔", img: require('@/assets/tags/1093544371.jpg') },

      { name: "苏州", img: require('@/assets/tags/1079455160.jpg') },
      { name: "澳门", img: require('@/assets/tags/780283331.jpg') },
      { name: "大连", img: require('@/assets/tags/939142687.jpg') },
      { name: "南京", img: require('@/assets/tags/1291136282.jpg') },
      { name: "福州", img: require('@/assets/tags/920071535.jpg') },
      { name: "黄山", img: require('@/assets/tags/703081938.jpg') },

      { name: "香港", img: require('@/assets/tags/765013439.jpg') },
      { name: "加拿大", img: require('@/assets/tags/688204107.jpg') },
      { name: "大理", img: require('@/assets/tags/1184574772.jpg') },
      { name: "香格里拉", img: require('@/assets/tags/1056058842.jpg') },
      { name: "哈尔滨", img: require('@/assets/tags/1293560839.jpg') },
      { name: "印度", img: require('@/assets/tags/736632221.jpg') },
    ],
  },
];

export default function TagLayout() {
  return (
    <Row>
      <Col xs={0} sm={1} md={2} lg={3} />
      <Col xs={24} sm={22} md={20} lg={18}>
        {
          TAGS.map((tag, index) => (
            <div className={styles.tagSection} key={index}>
              <div className={styles.title}>
                <h2>{tag.name}</h2>
              </div>
              <div className={styles.tagList}>
                <Row gutter={20}>
                  {
                    tag.children.map((item, i) => (
                      <Col xs={12} sm={6} md={6} lg={4} key={i}>
                        <Link to={`/tags/${item.name}`} className={styles.tagItem}>
                          { item.img ? <img src={item.img} alt="tagImg" /> : null }
                          <span className={styles.tagName}>{item.name}</span>
                        </Link>
                      </Col>
                    ))
                  }
                </Row>
              </div>
            </div>
          ))
        }
        
      </Col>
      <Col xs={0} sm={1} md={2} lg={3} />
    </Row>
  );
}
