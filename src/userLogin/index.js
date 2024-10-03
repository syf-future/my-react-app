import React, { useState } from 'react';
import Login from './element/login'
import Register from './element/register';
import Reset from './element/reset';

function UserLogin() {
    /* 
        通过父子组件通信 选择渲染的组件
    */
    const [state, switchState] = useState("0")
    const switchComponent = (componect) => {      //回调函数
        switchState(componect);
    }
    const selectComponect = () => {
        switch (state) {
            case "0":
                return <Login select={switchComponent} />;      //登录
            case "1":
                return <Register select={switchComponent} />;   //注册
            case "2":
                return <Reset select={switchComponent} />;      //忘记密码
            default:
                console.error("登录界面选择组件错误:", state);
                break;
        }
    }
    return (
        <div>
            {selectComponect()}
        </div>
    )
}

export default UserLogin;
