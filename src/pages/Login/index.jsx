import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import {login }from '../../redux/actions'

// import {reqLogin} from '../../api/index'
// import memoryUtils from '../../untils/memoryUtils'
// import storageUtils from '../../untils/storageUtils'

import './index.less'
import logo from '../../assets/images/logo.jpg'

import { Form, Input, Button, Icon} from 'antd';




class Login extends PureComponent {

  handleSubmit = (e) => {
    e.preventDefault()
    //对所有表单进行验证
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
          const {username, password} = values
          // const result= await reqLogin(username, password)
          // // console.log('请求成功', response.data)
          // if(result.status === 0) {
          //   message.success('登录成功')

          //   const user = result.data
          //    //保存用户到内存中
          //   memoryUtils.user = user

          //    //保存用户到local中
          //   storageUtils.saveuser(user)

          //   this.props.history.replace('/home')
          // } else {
          //   message.error(result.msg)
          // }

          //调用分发异步的action函数, 发登陆的异步请求, 有了结果更新状态
          this.props.login(username, password)
          
      } else {
        console.log('校验失败')
      }
    });
  }
  //对密码进行自定义验证
  validatePwd = (rule, value, callback) => {
    if(!value) {
      callback('密码不能为空')
    } else if(value.length < 4){
      callback('密码长度不能小于4位')
    } else if(value.length > 12) {
      callback('密码长度不能大于12位')
    } else if(!/^[a-zA-Z0-9_]+$/.test()) {
      callback('密码必须是字母,数字或下划线组成')
    } else {
      callback()
    }
  }

  render() {
    //判断用户是否登录
    // const user = memoryUtils.user

    const user = this.props.user
    if(user && user._id) {
      return <Redirect to='/home'/>
    }

    //得到具有强大功能的form对象
    const {getFieldDecorator} = this.props.form

    return (
      <div className='login'>
       <header className='login-header'>
         <img alt="logo" src={logo}></img>
         <h1>深海迷航:后台管理系统</h1>
       </header>
       <section className='login-content'>
         <h2>用户登录</h2>
         <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
        {
          getFieldDecorator('username', {
            rules: [
              {required: true, whitespace:true, message: '请输入您的用户名'},
              {min: 4, message: '用户名至少为4位'},
              {max: 12, message: '用户名最多为12位'},
              {pattern:/^[a-zA-Z0-9_]+$/, message: '用户名必须是字母,数字或下划线组成'}
            ]
          })
          (<Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />)
            }
            
        </Form.Item>
        <Form.Item>
        {
          getFieldDecorator('password',{
            rules:[{
              validator: this.validatePwd
            }]
          })
          (<Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />)
            }
            
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
       </section>
      </div>
    )
  }
}

const WrapLogin = Form.create()(Login)
export default connect(
  state => ({
    user: state.user
  }),
  {login}
)(WrapLogin)
