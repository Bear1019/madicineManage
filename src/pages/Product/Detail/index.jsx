import React, { Component } from 'react'
import {Card, Icon, List} from 'antd'
import LinkButton from '../../../components/LinkButton'
import {reqCategory} from '../../../api/index'

import './index.less'
import { BASE_IMG_URL } from '../../../untils/constants'



const Item = List.Item

export default class Detail extends Component {
  state = {
    cName1: '',
    cName2: '',
  }


  async componentDidMount () {
    //得到当前产品分类Id
    const {pCategoryId, categoryId} = this.props.location.state
    if(pCategoryId === '0') { //一级分类下的商品
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else { // 二级分类下的商品
      //一次性发送多个请求, 只有都成功以后才正常处理
     const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
     const cName1 = results[0].data.name
     const cName2 = results[1].data.name
     this.setState({
       cName1,
       cName2
     })
    }
  }

  render() {
    //读取携带过来的state数据
    const {name, desc, price, detail, imgs} = this.props.location.state
    const {cName1, cName2} = this.state
    const title = (
      <span>
      <LinkButton>
      <Icon type='arrow-left' 
      style={{color:'#26B1BC', marginRight: 15, fontSize: 18}}
      onClick={() => this.props.history.goBack()}
      />
      </LinkButton>
      
      <span>商品详情</span>
      </span>
    )
    return (
     <>
       <Card 
       title={title}
       className='product-detail'
       >
       <List>
         <Item>
           <span className='left'>商品名称:</span>
           <span>{name}</span>
         </Item>
         <Item>
           <span className='left'>商品描述:</span>
           <span>{desc}</span>
         </Item>
         <Item>
           <span className='left'>商品价格:</span>
           <span>{price}元</span>
         </Item>
         <Item>
           <span className='left'>所属分类:</span>
           <span>{cName1}{cName2 ? '--->' + cName2 : ''}</span>
         </Item>
         <Item>
           <span className='left'>商品图片:</span>
           <span className='product-img'>
           {
              imgs.map( img => (
                <img
                    key={img}
                    src={BASE_IMG_URL+ img}
                    className="product-img"
                    alt='img'
                  />   
             ))
           }
           </span>
         </Item>
         <Item>
           <span className='left'>商品详情:</span>
           <span dangerouslySetInnerHTML={{__html:detail}}></span>
         </Item>
       </List>
       </Card>
     </>
    )
  }
}
