// const {createProxyMiddleware}= require('http-proxy-middleware');

// module.exports = function(app) {
//   // ...You can now register proxies as you wish!
//   app.use(
//     createProxyMiddleware('/apish',{
//       target: "http://localhost:5000",
//       changeOrigin: true,
//       pathRewrite: {'^/apish': ''}
//     }),
//     app.use(
//       createProxyMiddleware('/apicd',{
//         target: 'https://interface.sina.cn',
//         changeOrigin: true,
//         pathRewrite: {'^/apicd': ''}
//       })
//     )
//    ) 
// }

const {createProxyMiddleware} = require("http-proxy-middleware")

/**
 * 配置请求跨域
 * @param app
 */
module.exports = function (app) {
    app.use(
        createProxyMiddleware("/apicd", {
            target: "https://interface.sina.cn",
            changeOrigin: true,
            pathRewrite: {
                "/apicd":""
            }
        }),
        createProxyMiddleware("/apish", {
            target: "http://localhost:5000",
            changeOrigin: true,
            pathRewrite: {
                "/apish":""
            }
        }),
        createProxyMiddleware("/apig", {
          target: "https://restapi.amap.com",
          changeOrigin: true,
          pathRewrite: {
              "/apig":""
          }
      }),
      createProxyMiddleware("/product/apish", {
        target: "http://localhost:5000",
        changeOrigin: true,
        pathRewrite: {
            "/product/apish":""
        }
    }),
    )
}