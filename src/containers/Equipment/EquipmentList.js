/*
 * 器材列表查询
 * <EquipmentListQuery keyword={this.state.keyword}/>
 */
import React from 'react';
import { connect } from 'dva';
import { Link, NavLink } from 'dva/router';
import { Card, Table } from 'antd';
import { ENV, Storage } from '@/utils';

import styles from './Equipment.less';

@connect(state => ({
  global: state.global,
}))
export default class EquipmentList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: true,

      keyword: this.props.keyword || null,                      //category-brand-model 分类-品牌-型号
      currentPage: this.props.currentPage || 1,					    //当前页数
      pageSize: Storage.get(ENV.storage.perPage) || 10,		//每页数量

      brand: '',
      list: '',
      total: 0,
    };
  }

  componentDidMount(){
    this.queryEquipmentList({
      keyword: this.state.keyword,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.keyword !== this.state.keyword) {
      this.queryEquipmentList({
        keyword: nextProps.keyword,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize
      });
    }
  }

  queryEquipmentList(query){
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let keyword = query.keyword.split('-');
    let params = {
      category: keyword[0] ? keyword[0] : null,
      brand: keyword[1] ? keyword[1] : null,
    };

    this.props.dispatch({
      type: 'global/request',
      url: 'equipments',
      method: 'GET',
      payload: {
        params: params,
        currentPage: query.currentPage,
        pageSize: query.pageSize
      },
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500)
        if(res.code === 0){
          this.setState({
            loading: false,
            keyword: query.keyword,
            brand: res.brand,
            list: res.data,
            total: res.total,
          })
        }
      }

    })
  }

  //表格分页
  handleTableChange = (pagination, filters, sorter) => {
    Storage.set(ENV.storage.perPage);
    this.queryEquipmentList({
      keyword: this.state.keyword,
      currentPage: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  render(){

    const {loading, keyword, brand, list, total} = this.state;

    const category = keyword.split('-')[0];

    const brandList = brand ?
      brand.map((item, index) => (
        <NavLink key={index} to={`/equipments/${category}-${item.name}`}>{item.name}</NavLink>
      ))
      : null;

    const columns = [
      {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        render: (brand) => (
          <Link to={`/equipments/${category}-${brand}`}>{brand}</Link>
        ),
      },
      {
        title: '型号',
        dataIndex: 'model',
        key: 'model',
        render: (text, record) => (
          <Link to={`/equipments/${category}-${record.name}`}>{record.model}</Link>
        ),
      },
      {
        title: '样张数',
        dataIndex: 'photo',
        key: 'photo',
      },
      {
        title: '查看',
        render: (text, record) => (
          <span>
            <Link to={`/equipments/${category}-${record.name}`}>查看</Link>
          </span>
        ),
      }
    ];

    return(

      <div className={styles.equipment}>

        <Card className={styles.select}>
          <div className={styles.section}>
            <div className={styles.label}><strong>选择品牌</strong></div>
            <div className={styles.link}>
              <NavLink key="all" to={`/equipments/${category}`}>全部</NavLink>
              {brandList}
            </div>
          </div>
        </Card>

        <Card className={styles.table}>
          {
            list ?
              <Table
                rowKey='_id'
                loading={loading}
                columns={columns}
                dataSource={list}
                onChange={this.handleTableChange}
                pagination={{
                  total: total,
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  showSizeChanger: true,
                }}
              />
              : null
          }
        </Card>

      </div>

    )

  }

}
