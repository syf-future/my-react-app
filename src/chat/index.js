import React, { useState } from 'react';
import { Avatar, Tooltip } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { IdcardOutlined, PoweroffOutlined, IdcardTwoTone, HeartTwoTone, FolderTwoTone, MessageTwoTone, MessageOutlined, FolderOutlined, HeartOutlined, SettingOutlined, SettingTwoTone } from '@ant-design/icons';
import CollectSub from './element/subPage/collectSub';
import FileSub from './element/subPage/fileSub';
import LinkmanSub from './element/subPage/linkmanSub';
import MessageSub from './element/subPage/messageSub';
import DefaultSub from './element/subPage/defaultSub';
import Message from '../chat/element/message';
import Linkman from '../chat/element/linkman';
import File from '../chat/element/file';
import Collect from '../chat/element/collect';
import { UserInfoState } from '../common/cookies/userInfoState';
import { ClientState } from '../common/status/clientState';
import { LoginState } from '../common/status/loginState';
import { Socket } from '../socket';

const MessageIcon = (props) => {
    if (props.state !== "1") {
        return (< MessageOutlined style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => props.onPage("1")} />)
    } else {
        return (<MessageTwoTone style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => props.onPage("1")} />)
    }
}

const ContactIcon = (props) => {
    if (props.state !== "2") {
        return (< IdcardOutlined style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => props.onPage("2")} />)
    } else {
        return (<IdcardTwoTone style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => props.onPage("2")} />)
    }
}

const FileIcon = (props) => {
    if (props.state !== "3") {
        return (< FolderOutlined style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => props.onPage("3")} />)
    } else {
        return (< FolderTwoTone style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => props.onPage("3")} />)
    }
}

const FavoriteIcon = (props) => {
    if (props.state !== "4") {
        return (< HeartOutlined style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => props.onPage("4")} />)
    } else {
        return (<HeartTwoTone style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => props.onPage("4")} />)
    }
}
const ToolIcon = (props) => {
    if (props.state !== "5") {
        return (< SettingOutlined style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => props.onPage("5")} />)
    } else {
        return (< SettingTwoTone style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => props.onPage("5")} />)
    }
}

const Chat = () => {
    const route = useNavigate();
    const { sessionId } = useParams();
    const [pageState, setPageState] = useState("1");
    const changPage = (state) => {
        // 当子组件调用时 打印子组件的数据
        setPageState(state)
    }
    const [frendInfo, setFrendInfo] = useState({});
    /**
     * 回调函数 获取 子组件中点击的好友信息 
     * @param {点击的好友信息} frendInfo 
     */
    const getFrendInfo = (frendInfo) => {
        // 当子组件调用时 打印子组件的数据
        setFrendInfo(frendInfo)
    }
    const [messageInfo, setMessageInfo] = useState({});
    /**
         * 回调函数 获取 孙组件中发送的信息
         * @param {点击的好友信息} frendInfo 
         */
    const getMsgInfo = (messageInfo) => {
        // 当子组件调用时 打印子组件的数据
        setMessageInfo(messageInfo)
    }

    /**
 * 选择子组件
 * @param {点击的状态  好友/通讯录/文件/收藏} pageState 
 * @param {回调函数 获取点击的好友信息} getFrendInfo 
 * @returns 
 */
    const chosePage = () => {
        switch (pageState) {
            case "1":
                return (< Message messageInfo={messageInfo} getFrendInfo={getFrendInfo} />);
            case "2":
                return (< Linkman />);
            case "3":
                return (< File />);
            case "4":
                return (< Collect />);
            default:
                return (<Message />);
        }
    }

    /**
     * 选择孙组件
     * @param {点击的状态  好友/通讯录/文件/收藏} pageState 
     * @param {好友信息} frendInfo 
     * @returns 
     */
    const choseSub = () => {
        switch (pageState) {
            case "1":
                return (< MessageSub frendInfo={frendInfo} getMsgInfo = {getMsgInfo} />);
            case "2":
                return (< LinkmanSub />);
            case "3":
                return (< FileSub />);
            case "4":
                return (< CollectSub />);
            default:
                return (<DefaultSub />);
        }
    }
    const close = () => {
        console.log("退出");
        ClientState.deleteClientState();
        LoginState.deleteLoginState();
        UserInfoState.deleteUserInfo(sessionId);
        Socket.deleteSocket();
        route('/login');
    }
    const userInfo = UserInfoState.getUserInfo(sessionId);
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
                            <Avatar size={64} src={<img src={userInfo.picture} alt="头像" style={{ cursor: 'pointer' }} />} />
                        </div>
                    </Tooltip>
                </div>
                {/* 聊天  <MessageFilled /> */}
                <div style={{ marginTop: '40px' }}>
                    <Tooltip title="消息">  {/* 鼠标悬停时的提示文本 */}
                        <div>
                            {<MessageIcon state={pageState} onPage={changPage} />}
                        </div>
                    </Tooltip>
                </div>
                {/* 通讯录 */}
                <div style={{ marginTop: '40px' }}>
                    <Tooltip title="通讯录">
                        <div>
                            {<ContactIcon state={pageState} onPage={changPage} />}
                        </div>
                    </Tooltip>
                </div>
                {/* 文件 */}
                <div style={{ marginTop: '40px' }}>
                    <Tooltip title="文件">
                        <div>
                            {<FileIcon state={pageState} onPage={changPage} />}
                        </div>
                    </Tooltip>
                </div>
                {/* 收藏 */}
                <div style={{ marginTop: '40px' }}>
                    <Tooltip title="我的收藏">
                        <div>
                            {<FavoriteIcon state={pageState} onPage={changPage} />}
                        </div>
                    </Tooltip>
                </div>
                {/* 设置 */}
                <div style={{ marginTop: '150px' }}>
                    <Tooltip title="设置">
                        <div>
                            {<ToolIcon state={pageState} onPage={changPage} />}
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
        </div>
    );
};
export default Chat;