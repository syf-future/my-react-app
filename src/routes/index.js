//路由配置
import React from 'react';

import Chat from '../chat';
import UserLogin from '../userLogin';
import { createBrowserRouter } from 'react-router-dom';
const NotFound = () => {
    return (
        <div>
            404 this is NotFound
        </div>
    )
}
const router = createBrowserRouter([
    {
        path: '/',
        element: <UserLogin />
    },
    {
        path: '/login',
        element: <UserLogin />
    },
    {
        path: '/chat',   // 动态参数 :sessionId
        element: < UserLogin />
    },
    {
        path: '/chat/:sessionId',   // 动态参数 :sessionId
        element: < Chat />
    },
    {
        path: '*',
        element: <NotFound />
    }
]);



export default router;