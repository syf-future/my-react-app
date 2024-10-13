import React, { useState } from 'react';
import { Avatar, Tooltip } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { IdcardOutlined, PoweroffOutlined, IdcardTwoTone, MessageTwoTone, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import LinkmanSub from './element/subPage/linkmanSub';
import MessageSub from './element/subPage/messageSub';
import Message from './element/page/message';
import Linkman from './element/page/linkman';
import { UserInfoState } from '../common/cookies/userInfoState';
import { ClientState } from '../common/status/clientState';
import { LoginState } from '../common/status/loginState';
import { Socket } from '../socket';
import CompileSub from './element/compile/compileSub';
import { postJava } from '../api';
import AddFunction from './element/subPage/addFunction';
import { EnumSubPageType } from '../common/enums/enumSubPageType';
import DefaultSub from './element/subPage/defaultSub';
import Information from './element/compile/information';

const Chat = () => {
    const route = useNavigate();
    const { sessionId } = useParams();
    const userInfo = UserInfoState.getUserInfo(sessionId);
    const [pageState, setPageState] = useState("1");        //用于选择子组件(消息/通讯录)
    const [subPageState, setSubPageState] = useState(EnumSubPageType.DEFAULE);   //用于选择孙组件(默认/聊天框/通讯录/添加)
    const [frendInfo, setFrendInfo] = useState({});         //用于获取子组件点击的好友
    const [messageInfo, setMessageInfo] = useState({});     //用于获取孙组件发送的信息

    /**
     * 回调函数 获取 子组件中点击的好友信息 
     * @param {点击的好友信息} frendInfo 
     */
    const getFrendInfo = (frendInfo) => {
        setFrendInfo(frendInfo)
    }
    /**
    * 回调函数 获取 孙组件中发送的信息
    * @param {点击的好友信息} frendInfo 
    */
    const getMsgInfo = (messageInfo) => {
        // 当子组件调用时 打印子组件的数据
        setMessageInfo(messageInfo)
    }
    /**
     * 回调函数 获取子组件中的点击
     * @param {添加好友/添加群/创建群} subPage 
     */
    const getSubPage = (subPage) => {
        setSubPageState(subPage)
    }

    /**
    * @returns 返回子组件
    */
    const chosePage = () => {
        switch (pageState) {
            case "1":
                return (< Message messageInfo={messageInfo} getFrendInfo={getFrendInfo} getSubPage={getSubPage} />);
            case "2":
                return (< Linkman getSubPage={getSubPage} />);
        }
    }

    /**
     * @returns 返回孙组件
     */
    const choseSub = () => {
        switch (subPageState) {
            case EnumSubPageType.CHAT:
                return (< MessageSub frendInfo={frendInfo} getMsgInfo={getMsgInfo} />);
            case EnumSubPageType.ADDRESS:
                return (< LinkmanSub getSubPage={getSubPage} />);
            case EnumSubPageType.ADDITION:
                return (<AddFunction />)
            case EnumSubPageType.DEFAULE:
                return (<DefaultSub />)
        }
    }
    //控制设置表单
    const [bool, setBool] = useState(false)
    const closeCompile = (bool) => {
        setBool(bool);
    }
    //设置功能
    const openCompile = () => {
        if (bool) {
            return (<CompileSub closeCompile={closeCompile} />);
        }
    }
    const [changeBool, setChangeBool] = useState(false);
    //编辑用户信息功能
    const changeUserInfo = (changeBool) =>{
        setChangeBool(changeBool);
    }
    const openChageUserInfo = ()=>{
        if(changeBool){
            return (<Information changeUserInfo={changeUserInfo}/>);
        }
    };
    /**
     * 退出登录
     */
    const close = async () => {
        console.log("退出");
        ClientState.deleteClientState();
        LoginState.deleteLoginState();
        UserInfoState.deleteUserInfo(sessionId);
        Socket.deleteSocket();
        await postJava('/chat/user/quit', { "serialNo": userInfo.serialNo })
            .then(
                response => {
                    if (response.data.code === "200") {
                        route('/login');
                    }
                }
            )
            .catch(
                error => {
                    console.error('Error fetching users:', error);
                }
            )
    }
    // 点击按钮时的颜色变换
    const messageIcon = () => {
        if (pageState !== "1") {
            return (< MessageOutlined style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => setPageState("1")} />)
        } else {
            return (<MessageTwoTone style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => setPageState("1")} />)
        }
    }
    // 点击按钮时的颜色变换
    const contactIcon = () => {
        if (pageState !== "2") {
            return (< IdcardOutlined style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => setPageState("2")} />)
        } else {
            return (<IdcardTwoTone style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => setPageState("2")} />)
        }
    }

    return (
        <div style={{
            width: '1100px',
            height: '700px',
            margin: '0 auto',
            border: '1px solid #ccc',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',  // 使用flex布局
        }}>
            <div style={{
                width: '10%',
                height: '100%',
                border: '1px solid #ccc',
                display: 'flex',              // 使用 flex 布局
                flexDirection: 'column',      // 垂直排列
                alignItems: 'center',         // 水平居中
                // justifyContent: 'center',     // 垂直居中
            }}>
                {/* 头像 */}
                <div style={{ marginTop: '50px' }}>
                    <Tooltip title="个人信息">  {/* 鼠标悬停时的提示文本 */}
                        <div>
                            <Avatar size={64} 
                            src={<img src={userInfo.picture} 
                            alt="头像" 
                            style={{ cursor: 'pointer' }} 
                            onClick={()=>setChangeBool(true)}
                            />} />
                        </div>
                    </Tooltip>
                </div>
                {/* 聊天  <MessageFilled /> */}
                <div style={{ marginTop: '40px' }}>
                    <Tooltip title="消息">  {/* 鼠标悬停时的提示文本 */}
                        <div>
                            {messageIcon()}
                        </div>
                    </Tooltip>
                </div>
                {/* 通讯录 */}
                <div style={{ marginTop: '40px' }}>
                    <Tooltip title="通讯录">
                        <div>
                            {contactIcon()}
                        </div>
                    </Tooltip>
                </div>
                {/* 设置 */}
                <div style={{ marginTop: '300px' }}>
                    <Tooltip title="设置">
                        <div>
                            < SettingOutlined style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => setBool(true)} />
                        </div>
                    </Tooltip>
                </div>
                {/* 退出 */}
                <div style={{ marginTop: '30px' }}>
                    <Tooltip title="退出">
                        <div>
                            <PoweroffOutlined style={{ fontSize: '36px', cursor: 'pointer' }} onClick={close} />
                        </div>
                    </Tooltip>
                </div>
            </div>

            <div style={{
                width: '30%',
                height: '100%',
                border: '1px solid #ccc',
            }}>
                {chosePage()}
            </div>

            <div style={{
                width: '60%',
                height: '100%',
                border: '1px solid #ccc',
            }}>
                {choseSub()}
            </div>
            <div>
                {openCompile()}
            </div>
            <div>
                {openChageUserInfo()}
            </div>
        </div>
    );
};
export default Chat;