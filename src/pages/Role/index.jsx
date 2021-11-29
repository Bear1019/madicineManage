import React, { Component } from 'react'
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'

import {Card, Button, Table, Modal, message} from 'antd'
import {reqAddRole, reqRoles, reqUpdateRole} from '../../api/index'
import AddForm from './AddForm'
import AuthForm from './AuthForm'
// import memoryUtils from '../../untils/memoryUtils'
// import storageUtils from '../../untils/storageUtils'
import {formateDate} from '../../untils/dateUntils'

class Role extends Component {

  state = {
    roles: [],  // 所有角色的列表
    role: {} ,  // 选中的role
    isShowAdd : false,  // 是否显示添加界面
    isShowAuth: false,  // 是否显示设置权限界面
  }

  constructor(props) {
    super(props)
    this.auth = React.createRef()
  }

  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }

  getRoles = async () => {
    const result = await reqRoles()
    if( result.status === 0 ) {
      const roles = result.data
      this.setState({roles})
    }
  }

  onRow = (role) => {
    return {
      onClick: event => {
        this.setState({role})
      }
    }
  }


  // 添加角色
  addRole = () => {
    // 先进行表单验证,通过了才向下处理
    this.form.validateFields(async (error, values) => {
      if(!error) {

        this.setState({isShowAdd: false})

        const {roleName} = values
        this.form.resetFields()

        const result = await reqAddRole(roleName)
        if(result.status === 0) {
          message.success('角色创建成功')
          // 新产生的角色
          const role = result.data
          this.setState(state => ({
            roles: [...state.roles, role]
          }))
        } else {
          message.error('角色创建失败')
        }
          }
        })

    
  }

  // 设置角色权限
  updateRoleAuth = async () => {
    this.setState({isShowAuth: false})
    const role = this.state.role
    // 得到最新的meuns
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    // role.auth_name = memoryUtils.user.username
    role.auth_name = this.props.user.username

    // 请求更新
    const result = await reqUpdateRole(role)
    if(result.status === 0) {
      // 如果更新的是自己角色权限 强制跳转登录
      //              memoryUtils.user.role_id
      if(role._id === this.props.user.role_id) {
        // memoryUtils.user = {}
        // storageUtils.removeUser()

        this.props.logout()
        this.props.history.replace('/login')
        message.success('角色权限修改成功,请重新登录!')
      } else {
        message.success('修改角色权限成功')
         // this.getRoles()
        this.setState({
          roles: [...this.state.roles]
      })
      }
    }
  }

  // componentWillMount() {
   
  // }

  componentDidMount() {
    this.initColumn()
    this.getRoles()
  }

  render() {

    const {roles, role, isShowAdd, isShowAuth} = this.state

    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>
        <Button 
          type='primary'
          disabled={!role._id}
          style={{marginLeft:10}}
          onClick={() => this.setState({isShowAuth: true})}
          >
        设置角色权限
        </Button>
      </span>
    )

    return (
      <>
      <Card
      title={title}
      >
      <Table 
        bordered
        rowKey='_id'
        columns={this.columns} 
        dataSource={roles}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: [role._id],
          onSelect: (role) => {  // 选择某个radio的回调
            this.setState({role})
          }
          }}
        onRow={this.onRow}
        pagination={{defaultPageSize: 8, showQuickJumper: true}}
         />
      </Card>

       <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false})
            this.form.resetFields()
            }
            }
        >
          <AddForm 
            setForm = {(form) => {this.form = form}}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRoleAuth}
          onCancel={() => {
            this.setState({isShowAuth: false})
            }
            }
        >
          <AuthForm 
          role={role}
          ref={this.auth}
          />
        </Modal>
        </>
    )
  }
}

export default connect(
  state => ({
    user: state.user
  }),
  {logout}
)(Role)