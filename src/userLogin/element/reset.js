import React, { useState } from 'react';
import { Button, Form, Input, Alert, Space } from 'antd';
import { UserOutlined, LinuxOutlined, PhoneOutlined, SafetyOutlined, LockOutlined } from "@ant-design/icons";
import { postJava } from '../../api';


const userLogin = {
    "userName": null,
    "password": null
}
const loginHandler = (values, setLoginState, setErrorMsg) => {
    console.log('Form values:', values);
    console.log("开始登录");
    userLogin.userName = values.username
    userLogin.password = values.password
    postJava('/chat/login', userLogin)
        .then(response => {
            console.log(response.data.code)
            if (response.data.code === "200") {
                console.log("注册成功")
                console.log(response)
            } else {
                console.error('用户名或密码错误');
                setErrorMsg("用户名或密码错误")
                setLoginState(true)
                setTimeout(() => {
                    setLoginState(false)
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            setErrorMsg("系统异常")
            setLoginState(true)
            setTimeout(() => {
                setLoginState(false)
            }, 1000);
        })
};
function Reset(props) {
    const [loginState, setLoginState] = useState(false)      //是否登录成功
    const [errorMsg, setErrorMsg] = useState("")            //错误信息
    //提交表单时触发
    const onLogin = (values) => {
        loginHandler(values, setLoginState, setErrorMsg);    //登录方法
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
                height: '480px',
                margin: '0 auto',   // 水平居中
                border: '1px solid #ccc',
                padding: '20px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <div >
                    <Button type="primary"
                        style={{
                            width: '50px', // 设置按钮宽度为100%
                            height: '40px', // 设置按钮高度
                        }}
                        onClick={() => props.select("0")}
                    >返回</Button>
                </div>
                <Form
                    name="login-form"
                    onFinish={onLogin}          // 表单提交时调用的函数
                    style={{ width: '100%' }}  // 表单宽度全局适配
                >
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ marginTop: 0 }}><LinuxOutlined /> 重置密码</h1>
                    </div>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名！' }]}  // 添加表单验证
                    >
                        <Input
                            placeholder="输入用户名："
                            addonBefore={<UserOutlined />}    //加图标
                            size="large"                  //大小
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入新密码！' }]}
                    >
                        <Input.Password
                            placeholder="输入新密码："
                            addonBefore={<LockOutlined />}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password2"
                        rules={[{ required: true, message: '请输入新密码！' }]}
                    >
                        <Input.Password
                            placeholder="重复输入密码："
                            addonBefore={<LockOutlined />}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        rules={[{ required: true, message: '请输入手机号！' }]}
                    >
                        <Input
                            placeholder="输入手机号："
                            addonBefore={<PhoneOutlined />}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="authcode"
                        rules={[{ required: true, message: '请输入短信验证码！' }]}
                        wrapperCol={{ span: 24 }} // 设置列数
                    >
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="输入短信验证码！"
                                addonBefore={<SafetyOutlined />}
                                size="large"
                                style={{ width: '70%' }} // 设置输入框宽度
                            />
                            <Button
                                type="primary"
                                style={{
                                    width: '30%', // 设置按钮宽度为100%
                                    height: '40px', // 设置按钮高度
                                }}
                            >
                                获取验证码
                            </Button>
                        </Space.Compact>

                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ span: 24 }} // 设置列数
                    >
                        <Button type="primary" htmlType="submit" style={{ width: '100%', height: '45px' }}>
                            重置密码
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}
export default Reset;