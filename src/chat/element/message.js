import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Input, List, Avatar, Dropdown, Menu } from 'antd';
import { postJava } from '../../api';
import { UserInfoState } from '../../common/cookies/userInfoState';
import { useParams } from 'react-router-dom';

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
    // const friendListRef = useRef([]);
    const [friendList, setFriendList] = useState([]);
    const { getFrendInfo } = props;
    const [hoveredIndex, setHoveredIndex] = useState(null); //鼠标经过哪个列表的状态
    const [choseIndex, setChoseIndex] = useState(null);     //鼠标点击哪个列表的状态
    const clickIndex = (index, item) => {
        setChoseIndex(index)
        getFrendInfo(item)
    }
    const { sessionId } = useParams();
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
                // flexDirection: 'column',      // 垂直排列
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
                    itemLayout="horizontal"         //水平排列，这意味着头像 (avatar) 和文本 将水平排列，而不是垂直。
                    dataSource={friendList}        //列表的数据源
                    renderItem={(item, index) => (
                        <List.Item
                            onMouseEnter={() => setHoveredIndex(index)} // 鼠标进入时设置 hoveredIndex
                            onMouseLeave={() => setHoveredIndex(null)} // 鼠标离开时清除 hoveredIndex     
                            onClick={() => clickIndex(index, item)}
                            style={{
                                padding: '16px 0',
                                cursor: 'pointer',   //鼠标放上时变成指针
                                backgroundColor: hoveredIndex === index ? '#f0f0f0' : choseIndex === index ? '#f0f0f0' : 'transparent', // 根据 hoveredIndex 设置背景颜色
                            }}
                        >
                            <List.Item.Meta
                                //Avatar 显示用户的头像
                                avatar={
                                    <div style={{ marginLeft: '10px' }}>
                                        <Avatar size={50} src={<img src={item.picture} alt="头像" />} />
                                    </div>
                                }
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{item.userName}</span>
                                        <span style={{ color: '#888', marginRight: '10px' }}>{item.time}</span>
                                    </div>
                                }
                                description={
                                    <div style={{ marginTop: '5px' }}>
                                        <span>{item.text}</span>    {/* 历史记录 */}
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
export default Message