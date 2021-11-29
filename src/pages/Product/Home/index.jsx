import React, { Component } from 'react'
import {Card, Select, Input, Button, Icon, Table, message } from 'antd'
import LinkButton from '../../../components/LinkButton'

import {reqProductList, reqSearchProducts, reqUpdateStatus} from '../../../api/index'
import { PAGE_SIZE } from '../../../untils/constants'

const Option = Select.Option

export default class Home extends Component {
  state = {
    total: 0, //商品总数量
    products: [],  // 商品数组
    isLoding: false,
    searchName: '', // 搜索的关键字
    searchType: 'productName', // 根据哪个字段搜索
  }
  //初始化table列的数组
  initCloumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥'+price  // 当前指定了对应的属性,传入的是对应的属性值
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <span>
              <Button 
              type='primary' 
              onClick={() => this.updateStatus(_id, newStatus)}
              >{status === 1 ? '下架' : '上架'}</Button>
              <span style={{display:'inlineBlock',paddingTop:5,paddingLeft:16 }}>
              {status === 1 ? '在售' : '售罄'}
              </span>
            </span>
          )
        }
      },
      {
        title: '操作',
        render: (product) => {
          return (
            <span>
             <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
             <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ];
  }
  
  //获取指定页码的列表数据显示
  getProducts = async(pageNum) => {
    //保存pageNum,让其他方法可以使用
    this.pageNum = pageNum
    this.setState({isLoding: true})

    const {searchName, searchType} = this.state
    let result
    if(searchName) {
       result = await reqSearchProducts({searchName, pageNum, pageSize: PAGE_SIZE, searchType})
    } else {
      result = await reqProductList(pageNum,PAGE_SIZE)
    }

    this.setState({isLoding: false})
    if(result.status === 0) {
      const {total, list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }
  //更新指定商品的状态
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if(result.status === 0) {
      message.success('更新产品成功')
      this.getProducts(this.pageNum)
    }
  }

  componentWillMount() {
    this.initCloumns()
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    //取出数据
    const {products, total, isLoding, searchName, searchType} = this.state
    const title = (
      <span>
        <Select
         value={searchType}
         onChange={value => this.setState({searchType: value})}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input placeholder='关键字' style={{width:200, marginLeft:10, marginRight:10}} 
        value={searchName}
        onChange={event => this.setState({searchName: event.target.value})}
        >
        </Input>
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <span>
        <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'/>
        添加商品
        </Button>
      </span>
    )

    
    

    return (
      <Card title={title} extra={extra}>
        <Table 
        loading={isLoding}
        bordered
        rowKey='_id'
        dataSource={products} 
        columns={this.columns}
        pagination={{
          current: this.pageNum,
          defaultPageSize:PAGE_SIZE,
          showQuickJumper:true,
          total,
          onChange: this.getProducts
          }}
         >

        </Table>
      </Card>
    )
  }
}
