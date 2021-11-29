import React, { Component } from 'react'
import {Card, Table, Modal, Button, message} from 'antd'
import {formateDate} from '../../untils/dateUntils'
import LinkButton from '../../components/LinkButton'
import {reqUsers, reqAddOrUpdateUser} from '../../api/index'
import { PAGE_SIZE } from '../../untils/constants'
import {reqUserDelete} from '../../api/index'
import UserForm from './UserForm'

export default class User extends Component {

  state = {
    users: [],
    roles: [], 
    isShow: false,
  }

  initCloumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        // render: (role_id) => {
        //   const roles = this.state.roles
        //   const role = roles.find(role => role._id === role_id)
        //   return role ? role.name : ""
        // }
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
    
  }

  //显示添加界面
  showAdd = () => {
    this.user = null // 去除前面保存的user
    this.setState({isShow: true})
  }

  //显示修改页面
  showUpdate = (user) => {
    //保存user
    this.user = user
    this.setState({isShow: true})
  }

  // 添加或者更新用户
  addOrUpdateUser = async () => {
    this.setState({isShow: false})
    //收集输入数据
    const user = this.form.getFieldsValue()
    this.form.resetFields()

    // 如果是更新, 需要给user指定的_id属性
    if(this.user) {
      user._id = this.user._id
    }

    const result = await reqAddOrUpdateUser(user)
    if(result.status === 0) {
      message.success(`${this.user_id ? '创建': '更新'}用户成功`)
      this.getUsers()
    }
  }

  // 获取用户列表
  getUsers = async () => {
    const result = await reqUsers()
    if(result.status === 0) {
      const {users, roles} = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    } else {
      message.error('获取用户失败')
    }
  }

  // 删除用户
  deleteUser = (user) => {
    Modal.confirm(
      {
        content: `确定删除${user.username}用户吗?`,
        onOk: async() => {
          const result = await reqUserDelete(user._id)
          if(result.status === 0) {
            message.success('删除用户成功!')
            // 找到user 删除users对应的user  直接重新获取users
            this.getUsers()
          }
        },
      }) 
  }

  // 根据role数组,生成包含所有角色的对象(属性名用角色id值)
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存
    this.roleNames = roleNames
  }

  componentWillMount() {
    this.initCloumns()
  }


  componentDidMount() {
    this.getUsers()
  }

  render() {
    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
    const {users, isShow, roles} = this.state
    const user = this.user || {}
    return (
      <>
        <Card title={title}>
        <Table 
        bordered
        rowKey = '_id'
        dataSource = {users}
        columns = {this.columns} 
        pagination = {{defaultPageSize:PAGE_SIZE}}
        />
        <Modal
          title={user._id ? '更新用户' : '添加用户' }
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.setState({isShow: false})
            this.form.resetFields()
          }}
        >
        <UserForm 
          setForm={form => this.form = form }
          roles={roles}
          user={user}
        />
        </Modal>
        </Card>
      </>
    )
  }
}
