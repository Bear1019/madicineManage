import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
// import instance from './axios'

const BASE = 'apish'
export const reqLogin = (username, password) => ajax(BASE + '/login', {username,password}, 'POST')


/*
  json请求的天气接口请求函数
*/
export const reqWeather = (city) => {
  return new Promise((resolve,reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=e7b770b2bf8dfe046c2bf5a522793a83&city=${city}`
      jsonp(url, {}, (err, data) => {
        if(!err && data.info === "OK") {
          const {weather} = data.lives[0]
          resolve({weather})
        } else {
          message.error('获取天气失败')
        }
      })
    });
}

// 获取地理位置接口
export const reqGps = () => {
  return new Promise((resolve,reject) => {
    const url = "https://restapi.amap.com/v3/ip?key=40517c9f5538f29044fc83710618c917"
      jsonp(url, {}, (err, data) => {
        if(!err && data.info === "OK") {
          const {province,city} = data
          resolve({province,city})
        } else {
          message.error('获取地理位置失败')
        }
      })
    });
}

//获取新冠病毒全国疫情情况
export const reqCovid_19 = () => ajax('/apicd/news/wap/fymap2020_data.d.json')

/**
 * 获取一级分类/二级分类的列表
 * 添加分类
 * 更新分类
 */

export const reqCategoryList = (parentId) => ajax(BASE + '/manage/category/list', {parentId})
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')
export const reqUpdateCategory = (categoryName, categoryId) => ajax(BASE + '/manage/category/update', {categoryName, categoryId}, 'POST')

//获取产品列表
export const reqProductList = (pageNum,pageSize) => ajax(BASE+'/manage/product/list',{pageNum,pageSize})

/*搜索产品分页列表
  searchType: 搜索的类型, productName/productDesc
*/
export const reqSearchProducts = ({searchName, pageNum, pageSize, searchType}) => ajax(BASE+'/manage/product/search',{
  [searchType]: searchName, // 变量的名作为属性值 相当于productName:searchName 和 productDesc:searchName
  pageNum,
  pageSize
})
//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
//更新商品的状态(进行上下架处理)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, "POST")

//删除指定名称图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// 添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id ? 'update' : 'add'), product, 'POST')

//获所有角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole= (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

//更新角色权限
export const reqUpdateRole= (role) => ajax(BASE + '/manage/role/update', role, 'POST')

//获取用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 删除用户
export const reqUserDelete = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

//更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
