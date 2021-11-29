import React, { Component } from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Home from './Home'
import AddUpdate from './AddUpdate'
import Detail from './Detail'

export default class Product extends Component {
  render() {
    return (
        <Switch>
          <Route path='/product' component={Home} exact></Route>
          <Route path='/product/addupdate' component={AddUpdate} exact></Route>
          <Route path='/product/detail' component={Detail} exact></Route>
          <Redirect to='/product'/>
        </Switch>
    )
  }
}
