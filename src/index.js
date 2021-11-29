import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'

import store from './redux/store'
import App from './App';
// import storageUtils from './untils/storageUtils';
// import memoryUtils from './untils/memoryUtils'


//读取local中保存的user,保存到内存中
// const user = storageUtils.getUser()
// memoryUtils.user = user

ReactDOM.render(
  <Provider store={store}>
  <App />
  </Provider>,
  document.getElementById('root')
);


