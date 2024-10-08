import React, { useState } from 'react';
import { Avatar, Button, Input, List } from 'antd';
import { useParams } from 'react-router-dom';
import { UserInfoState } from '../../../common/cookies/userInfoState';
import { postJava } from '../../../api';
import { EnumSendType } from '../../../common/enums/enumSendType';

function AddFunction() {
    const { Search } = Input;
    const [selected, setSelected] = useState("1");  // 追踪被点击的 span
    const { sessionId } = useParams();
    const userInfo = UserInfoState.getUserInfo(sessionId);
    const [clickedButtons, setClickedButtons] = useState({});   //改变 加好友 按钮样式
    // serialNo： account: , userName: , picture: , state: 
    const [friendList, setFriendList] = useState([]);           // 搜索到的好友
    const [state, setState] = useState(EnumSendType.FRIEND);    //1加好友 2加群
    //搜索好友
    const onSearch = async (value) => {
        await postJava('/chat/search/friend', { serialNo: userInfo.serialNo, userId: value })
        .then(response =>{
            if (response.data.code === "200") {
                console.log(response.data.data)
                setFriendList(response.data.data);
            }
        })
        .catch(error =>{
            console.error(error)
        })
    }
    // 添加好友
    const handleButtonClick = async (index, userId) => {

        //发送添加好友请求              当前用户id          要添加的用户id
        await postJava('/chat/add/friend', { serialNo: userInfo.serialNo, userId: userId, state: state})
            .then(response => {
                if (response.data.code === "200") {
                    // 点击后，更新当前项表示 "已发送"
                    setClickedButtons((prev) => ({
                        ...prev,
                        [index]: true,
                    }));
                }
            })
            .catch(error => {
                console.error(error)
            })
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{
                width: '100%',
                height: '12%',
                border: '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    width: '350px',
                    height: '50px',
                    border: '1px solid #ccc',
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <span style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                        backgroundColor: selected === "1" ? 'black' : 'white',   // 根据 selected 设置背景色
                        color: selected === "1" ? 'white' : 'black',             // 根据 selected 设置文字颜色
                    }}
                        onClick={() => setSelected("1")}                         // 设置点击事件
                    >
                        找人
                    </span>
                    <span style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                        backgroundColor: selected === "2" ? 'black' : 'white',
                        color: selected === "2" ? 'white' : 'black',
                    }}
                        onClick={() => setSelected("2")}
                    >
                        找群
                    </span>
                    <span style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                        backgroundColor: selected === "3" ? 'black' : 'white',
                        color: selected === "3" ? 'white' : 'black',
                    }}
                        onClick={() => setSelected("3")}
                    >
                        创建群
                    </span>
                </div>
            </div>
            <div style={{
                width: '100%',
                height: '88%',             // 设置父容器的高度，例如整个视口的高度
            }}>
                <div style={{ width: '80%', margin: '0 auto', marginTop: '10px' }}>
                    <Search placeholder="账号/用户名/手机号" onSearch={onSearch} enterButton />
                </div>
                <div style={{
                    overflowY: 'auto',  // 设置滚动条
                    // border: '1px solid #ccc',
                    width: '80%',       // 列表和输入框宽度一致
                    height:'80%',
                    margin: '10px auto',  // 保证列表居中
                }}>
                    <List
                        dataSource={friendList}        //列表的数据源
                        renderItem={(item, index) => (
                            <List.Item
                                style={{
                                    padding: '10px',   // 取消 padding-top
                                    backgroundColor: '#f0f0f0', // 根据 hoveredIndex 设置背景颜色
                                }}
                            >
                                <List.Item.Meta
                                    //Avatar 显示用户的头像
                                    avatar={
                                        <div style={{ marginLeft: '10px', }}>
                                            <Avatar size={50} src={<img src={item.picture} alt="头像" />} />
                                        </div>
                                    }
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '30px', fontFamily: 'SimSun, serif' }}>{item.userName}({item.account})</span>
                                            <span style={{ marginTop: '10px' }}>
                                                <Button
                                                    type={item.state === "1" ? "default" : clickedButtons[index] ? "default" : "primary"}
                                                    onClick={() => handleButtonClick(index, item.serialNo)}
                                                    disabled={item.state === "1" || clickedButtons[index]}  // 禁用按钮
                                                >
                                                    {item.state === "1"
                                                        ? "已添加"
                                                        : clickedButtons[index]
                                                            ? "已发送"
                                                            : "添加"}
                                                </Button>
                                            </span>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default AddFunction;