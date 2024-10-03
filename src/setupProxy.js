//解决跨域
const { createProxyMiddleware } = require('http-proxy-middleware'); // 正确导入

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/javaApi', {
            target: 'http://127.0.0.1:8080',
            changeOrigin: true,
            pathRewrite: { '^/javaApi': '' }
        })
    );
    app.use(
        createProxyMiddleware('/pyApi', {
            target: 'http://127.0.0.1:8081',
            changeOrigin: true,
            pathRewrite: { '^/pyApi': '' }
        })
    );
    app.use(
        createProxyMiddleware('/cppApi', {
            target: 'http://127.0.0.1:8083',
            changeOrigin: true,
            pathRewrite: { '^/cppApi': '' }
        })
    );
}