//解决跨域
const { createProxyMiddleware } = require('http-proxy-middleware'); // 正确导入
const javaApi = process.env.REACT_APP_JAVA_API_URL;
module.exports = function (app) {
    app.use(
        createProxyMiddleware('/javaApi', {
            target: javaApi,
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