import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form, Select, Input} from 'antd'

const Item = Form.Item
const Option = Select.Option

//添加分类的form组件
class AddForm extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired,  // 一级分类数组
    parentId: PropTypes.string.isRequired, // 父分类Id
    setForm: PropTypes.func.isRequired
  }

  componentWillMount() {
    //将form对象通过setForm()传递父组件
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {categorys, parentId} = this.props
    return (
      <>
      <Form>
      <Item label="所属名称">
      {
        getFieldDecorator('parentId', {
        initialValue: parentId,
        })(
          <Select>
          <Option value='0' key='0'>一级分类</Option>
          {
            categorys.map( item => <Option value={item._id} key={item._id}>{item.name}</Option> )
          }
        </Select>
        )
      }
      </Item>
      <Item label="分类名称">
      { getFieldDecorator('categoryName', {
          initiaValue: '',
          rules: [
            {required: true, message: '分类名称必须输入'}
          ]
        })(
          <Input placeholder='请输入分类名称'/>
        )
      }
      </Item>
      </Form>
      </>
    )
  }
}
export default Form.create()(AddForm)
