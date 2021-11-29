import React, { PureComponent } from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import { Layout } from 'antd';

// import memoryUtils from '../../untils/memoryUtils'
import LeftNav from '../../components/LeftNav';
import Header from '../../components/Header';

import Home from '../Home'
import Category from '../Category'
import Product from '../Product'
import Role from '../Role'
import User from '../User'
import Bar from '../Charts/bar'
import Line from '../Charts/line'
import Pie from '../Charts/pie'

const {Footer, Sider, Content } = Layout;

class Admin extends PureComponent {
  render() {
    // const user = memoryUtils.user
    
    const user = this.props.user
    if(!user || !user._id){
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{minHeight:'100%'}}>
        <Sider>
        <LeftNav></LeftNav>
        </Sider>
        <Layout>
        <Header></Header>

        <Content style={{margin:'20px', backgroundColor:'#fff'}}>
        <Switch>
        <Route path='/home' component={Home}/>
        <Route path='/category' component={Category}/>
        <Route path='/product' component={Product}/>
        <Route path='/role' component={Role}/>
        <Route path='/user' component={User}/>
        <Route path='/charts/bar' component={Bar}/>
        <Route path='/charts/line' component={Line}/>
        <Route path='/charts/pie' component={Pie}/>
        <Redirect to='/home'/>
        </Switch>
        </Content>

        <Footer style={{textAlign:'center'}}>推荐使用google浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
  </Layout>
    )
  }
}

export default connect(
  state => ({
    user: state.user
  }),
  {}
)(Admin)
