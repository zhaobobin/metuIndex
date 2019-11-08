/**
 * Question 问答
 * 热门问题: popular
 * 新问题: new
 * 等你来答: waiting
 */
import React from 'react';
import { Link } from 'dva/router';
import { Row, Col, Affix, Menu } from 'antd';
import { FormattedMessage } from 'react-intl';
import { getUrlParams } from '@/utils/utils'
import styles from './_layout.less';

import QuestionListQuery from '@/containers/Question/QuestionListQuery'
import QuestionSlide from '@/containers/Question/QuestionSlide'

export default class Question extends React.Component {

  constructor(props){
    super(props);
    this.state = {

    }
  }

  componentDidMount(){
    window.scrollTo(0, 0);
  }

  render(){

    const params = getUrlParams();
    const tab = params.t || 'popular';

    const queryOption = {
      category: tab,
    };

    const menu = [
      { key: "popular", id: "menu.question.popular", name: "热门问题" },
      { key: "new", id: "menu.question.new", name: "最新问题" },
      { key: "waiting", id: "menu.question.waiting", name: "等你来答" },
    ]

    return(
      <div className={styles.container}>

        <Affix>
          <Menu
            mode="horizontal"
            selectedKeys={[tab]}
          >
            {
              menu.map((item, index) => (
                <Menu.Item key={item.key}>
                  <Link to={`/question?t=${item.key}`}>
                    <FormattedMessage id={item.id}/>
                  </Link>
                </Menu.Item>
              ))
            }
          </Menu>
        </Affix>

        <div className={styles.content}>
          <Row>
            <Col xs={0} sm={0} md={2} lg={3} xl={5} />

            <Col xs={24} sm={24} md={14} lg={12} xl={10}>
              <div className={styles.head}>

              </div>
              <div className={styles.body}>
                <QuestionListQuery url="/questions" {...queryOption} />
              </div>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6} xl={4}>
              <div className={styles.slide}>
                <QuestionSlide/>
              </div>
            </Col>

            <Col xs={0} sm={0} md={2} lg={3} xl={5} />
          </Row>
        </div>

      </div>
    )
  }

}
