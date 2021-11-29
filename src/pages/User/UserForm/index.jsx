import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Select } from 'antd'
 
const Item = Form.Item
const Option = Select.Option

//添加分类的form组件
class UserForm extends PureComponent {
  static propTypes = {
    setForm: PropTypes.func.isRequired,  // 用来传递form对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  componentWillMount() {
    //将form对象通过setForm()传递父组件
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const { roles } = this.props
    const user = this.props.user || {}
    return (
      <>
      <Form
       labelCol={{span: 4}}
      wrapperCol={{span: 16}}
      >
      <Item 
      label="用户名: "
      >
      { getFieldDecorator('username', {
          initialValue: user.username,
          rules: [
            {required: true, message: '用户名称必须输入'}
        ]}
        )(
          <Input placeholder='请输入用户名称'/>
        )
      }
      </Item>
     
      <Item 
      label="密码: "
      >
      { getFieldDecorator('password', {
          initialValue: user.password,
          rules: [
            {required: true, message: '密码称必须输入'}
          ]
        })(
          <Input type='password' placeholder='请输入密码'/>
        )
      }
      </Item>
      <Item 
      label="电话: "
      >
      { getFieldDecorator('phone', {
          initialValue: user.phone,
          rules: [
            {required: true, message: '电话必须输入'}
          ]
        })(
          <Input placeholder='请输入电话'/>
        )
      }
      </Item>
      <Item 
      label="邮箱: "
      >
      { getFieldDecorator('email', {
          initialValue: user.email,
          rules: [
            {required: true, message: '邮箱必须输入'}
          ]
        })(
          <Input type='email' placeholder='请输入邮箱'/>
        )
      }
      </Item>

      <Item 
      label="角色: "
      >
      { getFieldDecorator('role_id', {
          initialValue: user.role_id,
          rules: [
            {required: true, message: '角色必须选择'}
          ]
        })(
         <Select placeholder='请选择角色'>
          {
            roles.map((item) => <Option key={item._id} value={item._id}>{item.name}</Option>
            )
          }
         </Select>
        )
      }
      </Item>
      </Form>
      </>
    )
  }
}
export default Form.create()(UserForm)

