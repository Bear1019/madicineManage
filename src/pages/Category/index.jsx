import React, { Component } from 'react'

import LinkButton from '../../components/LinkButton'
import { Card, Button, Icon, Table, message, Modal } from 'antd';
import { reqCategoryList, reqUpdateCategory, reqAddCategory } from '../../api';
import AddForm from '../../components/AddForm';
import UpdateForm from '../../components/UpdateForm';
import { PAGE_SIZE} from '../../untils/constants'

export default class Category extends Component {

  state = {
    categorys: [],  //一级分类列表
    subCategorys: [],  //二级分类列表
    isLoding: false,
    parentId: '0',  //当前需要显示的分类列表的分类Id
    parentName: '',  //当前需要显示的分类列表的分类名称
    showStatus: 0,  //标识添加/更新的确认框是否显示，0:都不显示，1:显示添加, 2:显示更新
  }

  //初始化table所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name', //显示数据对应的属性名
        key: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (  //返回需要的界面标签
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/* 向事件回调函数传递参数 */}
            {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
          </span>
        )
      },
    ]
  } 

  //异步获取一级或二级的分类列表
  //parentId:去过没有指定根据状态中的parentId请求,如果指定了,则根据指定的要求
  getCategorys = async(parentId) => {
    //发请求前,显示loding
    this.setState({isLoding:true})
    parentId = parentId || this.state.parentId

    const result = await reqCategoryList(parentId)
    //请求完成后,隐藏false
    this.setState({isLoding:false})
    if(result.status === 0) {
      //取出分类数组(可能是一级的也可能是二级的)
      const categorys = result.data
      if(parentId === '0'){
        //更新一级分类状态
        this.setState(
          {categorys}
          )
      } else {
        //更新二级分类状态
        this.setState({subCategorys: categorys})
        
      }
      
    } else {
      message.error('获取分类列表失败')
    }
  }

  //显示指定一级分类对象的二级列表
  showSubCategorys = (category) => {
    //更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    },() => {
        //获取二级分类列表
        this.getCategorys()
      }
    )
  }

  //显示一级分类对象
  showCategorys = () => {
  this.setState({
    parentId: '0',
    parentName: '',
    subCategorys: [],
    showStatus: 0, 
  })
  }

  componentWillMount() {
    this.initColumns()
  }
  //发异步ajax请求
  componentDidMount() {
    this.getCategorys()
  }

  //响应点击隐藏添加和更新的modal框
  handleCancel = () => {
    //清除输入数据
    this.form.resetFields()
    this.setState({showStatus:0})
  }

  //显示添加modal框
  showAdd = () => {
    this.setState({showStatus:1})
  }

  //显示更新的modal框
  showUpdate = (category) => {
    //保存分类对象
    this.category = category 

    this.setState({showStatus:2})
  }

  //添加分类
  addCategory = () => {
    this.form.validateFields( async(err, values) => {
      if(!err) {
        this.setState({showStatus:0})
        //收集数据提交请求
        const {parentId, categoryName} = values
    
        //清除输入数据
        this.form.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if(result.status === 0){
          //重新获取分类列表显示
          if(parentId === this.state.parentId) {
            this.getCategorys()
          } else if(parentId === '0') {  // 在二级分类列表下添加一级分类,重新获取一级分类列表,但不需要显示
            this.getCategorys(parentId)
          }
        }
      }
    })
  }

  //更新分类
  updateCategory = () => {
    this.form.validateFields( async(err, values) => {
      if(!err) {
         //隐藏modal框
        this.setState({showStatus:0})

        /*
          发送请求更新
            准备数据
            清除输入数据
          */
        const categoryId = this.category._id
        const {categoryName} = values
        this.form.resetFields()
          const result = await reqUpdateCategory(categoryName, categoryId)
          if(result.status === 0) {
            //重新显示列表
            this.getCategorys()
          }
            }
          })
  }

  render() {
    const {categorys, isLoding, subCategorys, parentId, parentName, showStatus} = this.state
    //获取分类对象名称
    const category = this.category || {} //如果还没有 指定一个空对象

    const title = parentId === '0'? '一级分类列表' : (
      <span>
      <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
      <Icon type='arrow-right' style={{marginRight: 5}}/>
      <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
      <Icon type='plus'></Icon>
      添加
      </Button>
    )

    return (
      <>
        <Card title={title} extra={extra}>
        <Table 
        bordered
        rowKey = '_id'
        loading = {isLoding}
        dataSource = {parentId === '0' ? categorys : subCategorys}
        columns = {this.columns} 
        pagination = {{defaultPageSize: PAGE_SIZE, showQuickJumper:true}}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm 
            categorys = {categorys}
            parentId = {parentId}
            setForm = {(form) => {this.form = form}}
          />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm 
            categoryName = {category.name}
            setForm = {(form) => {this.form = form}}/>
        </Modal>
        </Card>

      </>
    )
  }
}
