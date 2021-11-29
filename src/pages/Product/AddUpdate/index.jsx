import React, { Component } from 'react'
import {Card, Form, Input, Cascader, Button, Icon, message } from 'antd'
import LinkButton from '../../../components/LinkButton'
import {reqCategoryList} from '../../../api/index'
import PicturesWall from './PicturesWall'
import RichTextEditor from './RichTextEditor'
import {reqAddOrUpdateProduct} from '../../../api/index'

const {Item} = Form
const {TextArea} = Input 


class AddUpdate extends Component {
  constructor(props) {
    super(props)
    // 创建保存ref标识对象的容器
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  state = {
    options: [],
  }

  initOptions = async (categorys) => {
    //根据category生成options数组
    const options = categorys.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false
    }))

    // 如果是一个二级分类商品的更新
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级分类列表的options
      const childOptions = subCategorys.map( item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }))

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联到一级option
      targetOption.children = childOptions

    }

    //更新options状态
    this.setState({
      options
    })
  }

  //异步获取一级/二级分类列表
  getCategorys = async(parentId) => {
    const result = await reqCategoryList(parentId)
    if(result.status === 0) {
      const categorys = result.data
      //如果是一级分类列表
      if(parentId === '0') {
        this.initOptions(categorys)
      } else {
        //二级分类列表
        return categorys //当前async函数返回的promise对像就会成功且value为categorys
      }
    
    }
  }

  componentWillMount() {
    // 去除携带的state
    const product = this.props.location.state  // 如果是添加就没值, 不是就有值

    // 保存是否更新的标识
    this.isUpdate = !!product
    this.product = product || {}
  }

  componentDidMount() {
    this.getCategorys('0')
  }

  //自定义验证价格
  validatePrice = (rule, value, callback) => {
    if(value * 1 > 0) {
      callback() //验证通过
    } else {
      callback('价格必须大于0')
    }
  }

  submit = () => {
    //进行表单验证，通过才发送请求
    this.props.form.validateFields( async (error, values) => {
      if(!error) {

        /**
         * 收集数据
         * 调用接口请求函数去添加更新
         * 根据结果显示
         */
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if(categoryIds.length === 1)  {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
        // 如果是更新,需要添加_id
        if(this.isUpdate) {
          product._id = this.product._id
        }

        const result = await reqAddOrUpdateProduct(product)
        if(result.status === 0) {
          message.success(`${this.isUpdate ? '更新' : '添加' }商品成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加' }商品失败!`)
        }
      }
    })
  }

  //加载下一级列表的回调函数
  loadData = async selectedOptions => {
    //得到选择的option对象
    const targetOption = selectedOptions[selectedOptions.length - 1];
    //显示loding效果
    targetOption.loading = true;
    //根据选中的分类,请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false;
    if(subCategorys && subCategorys.length > 0) {
      //生成二级列表的options
      const cOptions =  subCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }))
      //关联到当前targetOption上
      targetOption.children = cOptions

    } else {//当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }
      //更新options状态
      this.setState({
        options: [...this.state.options],
      })
    }

  render() {

    const {isUpdate, product} = this
    const {pCategoryId, categoryId, imgs, detail} = product

    //接收级联分类Id的数组
    const categoryIds = []
    if(isUpdate) {
      if(pCategoryId === '0') {
        categoryIds.push(pCategoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const {options} = this.state
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize:18}}/>
          <span>{isUpdate ? '修改商品': '添加商品'}</span>
        </LinkButton>
      </span>
    )
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };

    const {getFieldDecorator} = this.props.form

    return (
     <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
          {getFieldDecorator('name', {
            initialValue: product.name,
            rules: [{
              required: true, message: '必须输入商品名称'
            }]
          }
          )(<Input placeholder='请输入商品名称'/>)}
          </Item>
          <Item label='商品描述'>
          {getFieldDecorator('desc', {
            initialValue: product.desc,
            rules: [{
              required: true, message: '必须输入商品描述'
            }]
          }
          )(<TextArea placeholder='请输入商品描述'autoSize />)}
            
          </Item>
          <Item label='商品价格'>
          {getFieldDecorator('price', {
            initialValue: product.price,
            rules: [
              {required: true, message: '必须输入商品价格'},
              {validator: this.validatePrice}
            ]
          })
          (<Input type='number' addonAfter="元"  placeholder='请输入商品价格' />)}
          
          </Item>
          <Item label='商品分类'>
          {getFieldDecorator('categoryIds', {
            initialValue: categoryIds,
            rules: [
              {required: true, message: '必须指定商品分类'},
            ]
          })
          (<Cascader
          placeholder='请指定商品分类'
            options={options}
            loadData={this.loadData} //当选择某个列表项, 加载下一级列表的监听回调
          />)}
          
          </Item>
          <Item label='商品图片'>
           <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
          </Item>
          <Item 
          label='商品详情'
          labelCol={{span: 2}}
          wrapperCol={{span: 20}}
          >
           <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
     </Card>
    )
  }
}

export default Form.create()(AddUpdate)
