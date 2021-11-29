import React, { Component } from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'
// import memoryUtils from '../../untils/memoryUtils'
import {setHeadTitle} from '../../redux/actions'

import './index.less'
import logo from '../../assets/images/logo.jpg'

const { SubMenu } = Menu;

class LeftNav extends Component {

  // 判断当前登录用户对item是否有权限
  hasAuth = (item) => {
    const {key, isPublic} = item
    // const menus = memoryUtils.user.role.menus
    // const username =  memoryUtils.user.username
    
    const username = this.props.user.username
    const menus = this.props.user.role.menus
    /**
     * 当前用户是admin
     * 如果当前item是公开的
     * 当前用户有itm的权限
     */
    if(username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if(item.children) {
      // 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    } else {
      return false
    }
  }

  /*
  根据menu的数据数组生成对应的标签数组
  */
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname  

    return menuList.reduce((pre, item) => {
      if(this.hasAuth(item)) {
        if(!item.children) {
          //判断item是否是当前对应的item
          if(item.key === path || path.indexOf(item.key) === 0) {
            this.props.setHeadTitle(item.title)
          }
          pre.push((
            <Menu.Item key={item.key}>
            <NavLink to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
            <Icon type={item.icon}/>
             <span>{item.title}</span>
            </NavLink>
           </Menu.Item>
          )) 
        } else {
          //查找一个与当前路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          if(cItem){
            this.openKey = item.key
          }
          pre.push((
            <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
          ))
        }
      }
      return pre
    },[])
  }

  /*
  在第一次render()之前执行一次
  为第一个render()准备数据(必须是同步的)
  */
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    //得到当前的路由路径
    let path = this.props.location.pathname  
    if(path.indexOf('/product') === 0) {
      path = '/product'
    }
    //得到需要打开菜单项的key
    const openKey = this.openKey
    return (
      <div className='left-nav'>
        <NavLink to='/' className='left-nav-header'>
          <img alt='logo' src={logo}></img>
          <h1>医务室后台</h1>
        </NavLink>
        <Menu
         selectedKeys={[path]}
          mode="inline"
          theme="light"
          defaultOpenKeys={[openKey]}
        >
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

export default connect(
  state => ({
    user: state.user
  }),
  {setHeadTitle}
)(withRouter(LeftNav))
