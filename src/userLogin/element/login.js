import React, { useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import { UserOutlined, LockOutlined, LinuxOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { postJava } from '../../api';
import { Socket } from '../../socket'
import { Message } from '../../common/types/message';
import { LoginState } from '../../common/status/loginState';
import { v4 as uuidv4 } from 'uuid';
import { UserInfoState } from '../../common/cookies/userInfoState';
import { EnumSendType } from '../../common/enums/enumSendType';
const userLogin = {
    "account": null,
    "password": null
}
const loginHandler = async (values, route, setLoginState, setErrorMsg) => {
    console.log('Form values:', values);
    console.log("开始登录");
    userLogin.account = values.account
    userLogin.password = values.password
    //请求后端登录接口
    await postJava('/chat/user/login', userLogin)
        .then(response => {
            console.log(response.data.code);
            if (response.data.code === "200") {
                console.log("开始创建客户端");
                Socket.connect();   //连接服务端
                const userInfo = response.data.data;
                const message = new Message(userInfo.serialNo, EnumSendType.LOGIN, userInfo);
                Socket.sendMsg(message);   //发送登录信息
                //new Promise  异步判断是否超时
                return new Promise((resolve, reject) => {
                    const startTime = Date.now();
                    const checkState = () => {
                        if (LoginState.getLoginState()) {
                            console.log("登录成功");
                            const sessionId = uuidv4(); // 或者从服务器获取 sessionId
                            UserInfoState.setUserInfo(sessionId, userInfo)
                            route(`/chat/${sessionId}`)
                            resolve();
                        } else if (Date.now() - startTime >= 5000) {
                            reject(new Error("登录超时"));
                            Socket.deleteSocket();
                        } else {
                            console.log("等待登录状态...");
                            setTimeout(checkState, 100); // 继续检查
                        }
                    };
                    checkState(); // 启动检查
                });
            } else {
                // 显示1秒错误弹窗
                setErrorMsg(response.data.msg)
                setLoginState(true)
                setTimeout(() => {
                    setLoginState(false)
                }, 1000);
                Socket.deleteSocket();
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            Socket.deleteSocket();
            setErrorMsg("系统异常")
            setLoginState(true)
            setTimeout(() => {
                setLoginState(false)
            }, 1000);
        })
};

function Login(props) {
    const [loginState, setLoginState] = useState(false)      //是否登录成功
    const [errorMsg, setErrorMsg] = useState("")            //错误信息
    const route = useNavigate()
    //提交表单时触发
    const onLogin = (values) => {
        loginHandler(values, route, setLoginState, setErrorMsg);    //登录方法
    };
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                {
                    loginState && <Alert message={errorMsg} type="error" showIcon />
                }
            </div>
            <div style={{
                width: '100%',
                maxWidth: '400px',  // 限制最大宽度
                margin: '0 auto',   // 水平居中
                border: '1px solid #ccc',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <Form
                    name="login-form"
                    onFinish={onLogin}          // 表单提交时调用的函数
                    style={{ width: '100%' }}  // 表单宽度全局适配
                >
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h1><LinuxOutlined /> 登录系统</h1>
                    </div>
                    <Form.Item
                        name="account"
                        rules={[{ required: true, message: '请输入账号！' }]}  // 添加表单验证
                    >
                        <Input
                            placeholder="输入账号："
                            addonBefore={<UserOutlined />}    //加图标
                            size="large"                  //大小
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码！' }]}
                    >
                        <Input.Password
                            placeholder="输入密码："
                            addonBefore={<LockOutlined />}
                            size="large"
                        />
                    </Form.Item>
                    <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="text" onClick={() => props.select("1")}>用户注册</Button>
                        <Button type="text" onClick={() => props.select("2")}>忘记密码</Button>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%', height: '45px' }}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default Login;