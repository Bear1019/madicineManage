// import axios from "axios";
// const instance = axios.create({
//   baseURL: "'apish'",
//   timeout: 10000
// })

// const yq = 'news/wap/fymap2020_data.d.json'
// const gps= 'v3/ip?key=40517c9f5538f29044fc83710618c917'

// instance.interceptors.request.use( config => {
//  if (config.url === yq ){
//    config.baseURL = 'apicd'
//  } 

//   return config
// }, error => {
//   Promise.reject(error)
// })

// instance.interceptors.response.use( config => {
//   return config
// }, error => {
//   Promise.reject(error)
// })

// export default instance;