import React, { Component } from 'react'
import { Input, Tree, Form} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree

export default class AuthForm extends Component {

  static propTypes = {
    role: PropTypes.object
  }

  constructor(props) {
    super(props)
    // 根据传入角色的menus生成初始状态
    const {menus} = this.props.role
    this.state = {checkedKeys: menus}
  }
  
  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null }
        </TreeNode>
      )
      return pre
    },[])
  }

    // 选中某个node的回调
  onCheck = checkedKeys => this.setState({checkedKeys})

  //为父组件提供最新的meuns
  getMenus = () => this.state.checkedKeys

  componentWillMount() {
    return this.treeNodes = this.getTreeNodes(menuList)
  }


  render() {
    const {role} = this.props
    const {checkedKeys} = this.state
    return (
      <>
      <Item 
      label="角色名称: "
      labelCol={{span: 4}}
      wrapperCol={{span: 16}}
      >
      <Input value={role.name} disabled/>
      </Item>

      <Tree
        checkable
        defaultExpandAll={true}
        checkedKeys={checkedKeys}
        onCheck={this.onCheck}
      >
        <TreeNode title="平台权限" key="0-0">
         {this.treeNodes}
        </TreeNode>
      </Tree>
      </>
    )
  }
}
