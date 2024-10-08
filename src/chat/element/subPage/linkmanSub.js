import { Avatar, Button, List } from "antd"
import { EnumSubPageType } from "../../../common/enums/enumSubPageType";
import { useEffect, useState } from "react";
import { postJava } from "../../../api";
import { useParams } from "react-router-dom";
import { UserInfoState } from "../../../common/cookies/userInfoState";
import { EnumSendType } from "../../../common/enums/enumSendType";

function LinkmanSub(props) {
    const { getSubPage } = props;
    const [friendList, setFrendList] = useState([]);
    const [clickedButtons, setClickedButtons] = useState({});   //改变 加好友 按钮样式
    const { sessionId } = useParams();
    const userInfo = UserInfoState.getUserInfo(sessionId);
    const [state, setState] = useState(EnumSendType.FRIEND);    //1加好友 2加群

    //每次渲染时查找添加我的请求
    useEffect(() => {
        postJava('/chat/search/add', { serialNo: userInfo.serialNo })
            .then(response => {
                if (response.data.code === "200") {
                    setFrendList(response.data.data)
                }
            })
            .catch(error => {
                console.error(error)
            })
    }, [])


    // 同意添加好友
    const handleButtonClick = async (index, userId) => {

        //发送同意好友请求                      当前用户id                  要添加的用户id     好友/群
        await postJava('/chat/agree/friend', { serialNo: userInfo.serialNo, userId: userId, state: state })
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
            <div
                style={{
                    width: '100%',
                    height: '12%',
                    border: '1px solid #ccc',
                    fontSize: '20px',
                    display: 'flex',
                    justifyContent: 'space-between', // 左右分布
                    alignItems: 'center', // 垂直居中
                }}
            >
                <span style={{ marginLeft: "280px" }}>新的朋友</span>
                <span>
                    <Button style={{ marginRight: '10px' }}
                        onClick={() => getSubPage(EnumSubPageType.ADDITION)}
                    >
                        添加朋友
                    </Button>
                </span>
            </div>
            <div style={{
                width: '100%',
                height: '88%',             // 设置父容器的高度，例如整个视口的高度
            }}>
                <div style={{
                    overflowY: 'auto',  // 设置滚动条
                    border: '1px solid #ccc',
                    width: '80%',       // 列表和输入框宽度一致
                    height: '96%',
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
                                                    type={item.state === "1" ? "default" : "primary"}
                                                    onClick={() => handleButtonClick(index, item.serialNo)}
                                                    disabled={item.state === "1" || clickedButtons[index]}  // 禁用按钮
                                                >
                                                    {item.state === "1"
                                                        ? "已添加"
                                                        : clickedButtons[index]
                                                            ? "已添加"
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
export default LinkmanSub