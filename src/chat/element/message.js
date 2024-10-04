import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Input, List, Avatar, Dropdown, Menu } from 'antd';
import { postJava } from '../../api';
import { UserInfoState } from '../../common/cookies/userInfoState';
import { useParams } from 'react-router-dom';
import { DateUtils } from '../../common/utils/dateUtils';
import { MessageState } from '../../common/status/messageState';

const handleMenuClick = (e) => {
    console.log('Menu item clicked:', e.key); // 处理菜单项点击事件
};

// 创建菜单
const menu = (
    <Menu onClick={handleMenuClick}>
        <Menu.Item key="add-friend">添加好友</Menu.Item>
        <Menu.Item key="add-group">添加群组</Menu.Item>
        <Menu.Item key="create-group">创建群组</Menu.Item>
    </Menu>
);

function Message(props) {
    //登录后获取的好友信息列表
    //[{"friendId":"好友id/群id","userName":"名称","picture":"头像","sendType":"FRIEND/GROUP","lastMessage":"最后一条消息","lastMessageTime":"最后一条消息时间"}]
    const [friendList, setFriendList] = useState([]);
    //回调参数 传递给父组件点击的是哪个好友
    const { getFrendInfo, messageInfo } = props;
    //点击的好友
    const [friendInfo, setFriendInfo] = useState({});
    //鼠标经过列表的状态
    const [hoveredIndex, setHoveredIndex] = useState(null);
    //鼠标点击列表的状态
    const [choseIndex, setChoseIndex] = useState(null);
    const { sessionId } = useParams();
    // 用来处理接收消息
    const [currentMessage, setCurrentMessage] = useState(null);
    /**
     * 点击列表事件
     * @param {*} index 列表索引
     * @param {*} item  点击的列表值friendList
     */
    const clickIndex = (index, item) => {
        setChoseIndex(index);
        getFrendInfo(item);
        setFriendInfo(item);
        // 点击时取消红点
        setFriendList(friendList =>
            friendList.map(frend =>
                frend.friendId === item.friendId
                    ? {
                        ...frend,
                        unreadNum: "0"
                    } : frend
            )
        )
    }

    // 发送消息后更新
    useEffect(() => {
        setFriendList(friendList =>
            friendList.map(frend =>
                frend.friendId === messageInfo.friendId
                    ? {
                        ...frend,
                        lastMessage: messageInfo.content,  // 更新最后一条消息
                        lastMessageTime: new Date().toLocaleString()  // 更新最后一条消息时间
                    } : frend
            )
        )
    }, [messageInfo])
    //当好友列表渲染时 发送请求获取好友信息
    useEffect(() => {
        //发送登录成功事件请求   获取该用户的数据
        postJava('/chat/user/loginSuccess', { "serialNo": UserInfoState.getUserInfo(sessionId).serialNo })
            .then(response => {
                console.log(response.data.code);
                if (response.data.code === "200") {
                    setFriendList(response.data.data);
                    console.log("获取到的好友信息：", response.data.data)
                }
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            })
    }, [sessionId])

    /**
         * 当组件挂载时，订阅 MessageState 的变化
         */
    useEffect(() => {
        // 当组件挂载时，订阅 MessageState 的变化
        const handleMessage = (msg) => {
            setCurrentMessage(msg);  // 更新当前消息
        };

        MessageState.subscribe(handleMessage);  // 订阅消息

        // 在组件卸载时，取消订阅
        return () => {
            MessageState.unsubscribe(handleMessage);
        };
    }, []);
    /**
     * 当WebSocker接收到消息时 
     * 监听 currentMessage 的变化，更新 messageList
     */
    useEffect(() => {
        if (currentMessage !== null) {
            console.log("子组件接受到消息：", currentMessage)
            setFriendList(friendList =>
                friendList.map(frend =>
                    frend.friendId === currentMessage.userId
                        ? {
                            ...frend,
                            lastMessage: currentMessage.content,  // 更新最后一条消息
                            lastMessageTime: new Date().toLocaleString(),  // 更新最后一条消息时间
                            unreadNum: friendInfo.friendId !== currentMessage.userId ? Number(frend.unreadNum) + 1 : "0"
                        } : frend
                )
            )
            console.log(Number(friendList.at(0).unreadNum)+1)
        }
    }, [currentMessage]);

    return (
        <div style={{
            width: '100%',
            height: '100%',  // 设置为视口高度，确保父容器有明确高度
        }}>
            <div style={{
                width: '100%',
                height: '12%',
                border: '1px solid #ccc',
                display: 'flex',              // 使用 flex 布局
                alignItems: 'center',         // 水平居中
                justifyContent: 'center',     // 垂直居中
            }}>
                <span>
                    <Input
                        style={{ width: '250px' }}
                        placeholder="搜索联系人、群组"
                        prefix={< SearchOutlined />}
                    />
                </span>
                <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
                    <PlusOutlined style={{
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: 'gray',
                        marginLeft: '10px', // 直接在这里添加左边距
                    }} />
                </Dropdown>

            </div>
            <div style={{
                height: '87.5%',
                overflowY: 'auto',  //设置滚动条
                border: '1px solid #ccc'
            }}>
                <List
                    dataSource={friendList}        //列表的数据源
                    renderItem={(item, index) => (
                        <List.Item
                            onMouseEnter={() => setHoveredIndex(index)} // 鼠标进入时设置 hoveredIndex
                            onMouseLeave={() => setHoveredIndex(null)} // 鼠标离开时清除 hoveredIndex     
                            onClick={() => clickIndex(index, item)}
                            style={{
                                padding: '0px',   // 取消 padding-top
                                cursor: 'pointer',   //鼠标放上时变成指针
                                backgroundColor: hoveredIndex === index ? '#f0f0f0' : choseIndex === index ? '#f0f0f0' : 'transparent', // 根据 hoveredIndex 设置背景颜色
                            }}
                        >
                            <List.Item.Meta
                                //Avatar 显示用户的头像
                                avatar={
                                    <div style={{ marginLeft: '10px', marginTop: '12px' }}>
                                        <Avatar size={50} src={<img src={item.picture} alt="头像" />} />
                                    </div>
                                }
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '30px', fontFamily: 'SimSun, serif' }}>{item.userName}</span>
                                        <span style={{ color: '#888', marginRight: '10px', marginTop: '5px' }}>{DateUtils.formatTimeStr(item.lastMessageTime)}</span>
                                    </div>
                                }
                                description={
                                    <div style={{ position: 'relative' }}>
                                        {/* lastMessage 向上移动 5px */}
                                        <span>{item.lastMessage}</span>
                                        <Icon num={item.unreadNum} />
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}
const Icon = (props) => {
    const { num } = props;
    if (num && num !== "0") {
        return (
            <span
                style={{
                    position: 'absolute',
                    right: '0',        // 靠右
                    bottom: '0',       // 靠下
                    backgroundColor: 'red',   // 红色背景
                    color: 'white',           // 字体颜色白色
                    borderRadius: '50%',      // 圆形
                    padding: '2px 6px',       // 内边距让圆有合适的大小
                    fontSize: '13px',         // 字体大小
                    height: '15px',           // 圆形的高度
                    display: 'flex',          // 使用 flex 使内容居中
                    justifyContent: 'center', // 水平居中
                    alignItems: 'center'      // 垂直居中
                }}
            >
                {num}
            </span>
        )
    }
}
export default Message