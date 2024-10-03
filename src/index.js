/**
 * 项目的入口 从这里开始运行
 */
// React必备的两个核心包
import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './routes'

// 把App根组件渲染到id为root的dom节点上
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}> {/* 路由 */}
        <Provider store={store}>     {/* 状态管理 */}
            {/* <App /> */}
        </Provider>
    </RouterProvider>

);
