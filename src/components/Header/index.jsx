import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'

import { Modal} from 'antd';
import {reqWeather} from '../../api/index'
import {reqGps} from '../../api/index';
// import memoryUntils from '../../untils/memoryUtils'
// import storageUtils from '../../untils/storageUtils'
import {formateDate} from '../../untils/dateUntils'
// import menuList from '../../config/menuConfig'
import {logout} from '../../redux/actions'


import LinkButton from '../LinkButton';
import './index.less'




class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    weather: '',
  }

  getGps = async() => {
    await reqGps().then(async res => {
      const {weather} = await reqWeather(res.city)
      this.setState({weather} )
    })
  }

  // getWeather = async () => {
  //   const {weather}  = await reqWeather('南昌市')
  //   this.setState({weather} )
  // }

  getTime = () => {
    this.timer = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    },1000)
  }

  //  获取头部标题
  // getTitle = () => {
  //   const path = this.props.location.pathname
  //   let title
  //   menuList.forEach(item => {
  //     if(item.key === path) {
  //       title = item.title
  //     } else if(item.children) {
  //       //在所有子item中查找匹配的
  //       const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
  //       if(cItem) {
  //         title = cItem.title
  //       }
  //     }
  //   })
  //   return title
  // } 


  /**
   * 退出登录
   */
  logout = () => {
    Modal.confirm({
      content: '确定退出吗?',
      onOk: () => {
        //删除保存的user数据，并跳转登陆页面
      //  storageUtils.removeUser()
      //  memoryUntils.user = {}
      //  this.props.history.replace('/login')

      this.props.logout()
      }
    });
  }

  componentDidMount() {
    this.getTime()
    // this.getWeather()
    this.getGps()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const {currentTime, weather} = this.state
    // const username = memoryUntils.user.username
    const username = this.props.user.username

    // const title = this.getTitle()
    const title = this.props.headTitle
    return (
      <div className='header'>
        <div className='header-top'>
        <span>欢迎登录,{username}</span>
        <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
        <div className='header-bottom-left'>{title}</div>
        <div className='header-bottom-right'>
          <span>{currentTime}</span>
          <span>{weather}</span>
        </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    headTitle: state.headTitle,
    user: state.user
  }),
  {logout}
)(withRouter(Header))

