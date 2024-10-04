import { FolderOpenOutlined, TeamOutlined, SmileOutlined, PictureOutlined, PhoneOutlined } from '@ant-design/icons';
import { Tooltip, Button, Input, Avatar } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { UserInfoState } from '../../../common/cookies/userInfoState';
import { useParams } from 'react-router-dom';
import { postJava } from '../../../api';
import { MessageInfo } from '../../../common/types/messageInfo';
import { EnumMessageType } from '../../../common/enums/enumMessageType';
import { EnumSendType } from '../../../common/enums/enumSendType';
import { MessageState } from '../../../common/status/messageState';
import { Socket } from '../../../socket';
import { Message } from '../../../common/types/message';
import { DateUtils } from '../../../common/utils/dateUtils';
const { TextArea } = Input;

function MessageSub(props) {
    const { sessionId } = useParams();
    // 当前聊天框的消息记录
    const [messageList, setMessageList] = useState([]);
    //输入框文本
    const [value, setValue] = useState("");
    // 消息类型 默认是文本
    const [messageType, setMessageType] = useState(EnumMessageType.TEXT);
    // 用来处理接收消息
    const [currentMessage, setCurrentMessage] = useState(null);  
    //当前好友信息
    const frendInfo = props.frendInfo || {};
    const getMsgInfo = props.getMsgInfo;
    //从Cookies中获取登录的用户信息
    const userInfo = UserInfoState.getUserInfo(sessionId);

    // 创建一个 ref 来获取dom  实现自动滚动到底部
    const chatContainerRef = useRef(null); 
    // 当 messageList 更新时，自动滚动到底部
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messageList]);


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
        console.log("接收到消息：", currentMessage);
        if (currentMessage !== null) {
            setMessageList(prevList => [
                ...prevList,
                { userId: currentMessage.userId, messageType: messageType, content: currentMessage.content, sendDate: formatDate(new Date()) }
            ]);
        }
    }, [currentMessage]);
    /**
     * 当好友信息渲染时 发送请求获取好友历史记录
     */
    useEffect(() => {
        if (frendInfo.userName) {
            /**
             * 发送点击好友请求   获取与该好友的历史记录
             */
            // setSendType(frendInfo.sendType);
            postJava('/chat/message/click', { "userId": userInfo.serialNo, "friendId": frendInfo.friendId })
                .then(response => {
                    if (response.data.code === "200") {
                        console.log("获取到的历史消息：", response.data.data)
                        setMessageList(response.data.data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                })
        }
    }, [frendInfo])
    if (!frendInfo.userName) {
        return (
            <div>
                欢迎
            </div>
        );
    }
    /**
     * 计算当前消息与上一条消息的时间差 来判断时间
     * @param {最新的消息时间} currentTime 
     * @param {上一条消息时间} previousTime 
     * @returns 
     */
    const calculateTimeDifference = (currentTime, previousTime) => {
        const current = new Date(currentTime).getTime();
        const previous = new Date(previousTime).getTime();
        const diffInMs = current - previous;
        const diffInMinutes = diffInMs / (1000 * 60); // 将毫秒转为分钟
        return diffInMinutes;
    }

    /**
     * 发送消息事件
     * @param {消息内容} message 
     * @param {发送完清空消息内容} setValue 
     */
    const sendMsg = async (message, setValue) => {
        if (message) {
            const msg = { userId: userInfo.serialNo, messageType: "1", content: message, sendDate: formatDate(new Date()) };
            setMessageList(prevList => [
                ...prevList,
                msg
            ]);
            setValue("");
            //构建消息信息
            const messageInfo = new MessageInfo(userInfo.serialNo, frendInfo.friendId, null, frendInfo.sendType, messageType, message)
            getMsgInfo(messageInfo);
            await postJava('/chat/message/send', messageInfo)
                .then(response => {
                    if (response.data.code === "200") {
                        console.log("消息持久化成功")
                        //通过websocker发送消息
                        const msg = new Message(frendInfo.friendId, EnumSendType.FRIEND, messageInfo);
                        Socket.sendMsg(msg);
                    }
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                })
        }
    }

    return (
        <div style={{
            width: '100%',
            height: '100%',  // 设置为视口高度，确保父容器有明确高度
        }}>
            {/* 标题栏 */}
            <div style={{
                width: '100%',
                height: '12%',
                border: '1px solid #ccc',
                display: 'flex',                      // 使用 flex 布局
                justifyContent: 'space-between',      // 左右对齐
            }}>
                <span style={{
                    display: 'inline-block',
                    marginTop: '30px',
                    marginLeft: '20px',
                    fontSize: '24px'
                }}>
                    {frendInfo.userName}
                </span>
                <div>
                    <span style={{
                        display: 'inline-block',
                        marginTop: '30px',
                        marginRight: '20px'      // 设置 222 和 333 的间距
                    }}>
                        <Tooltip title="文件">
                            {<FolderOpenOutlined
                                style={{
                                    fontSize: '30px',
                                    cursor: 'pointer'
                                }}
                            />}
                        </Tooltip>
                    </span>
                    <span style={{
                        display: 'inline-block',
                        marginTop: '30px',
                        marginRight: '20px'
                    }}>
                        <Tooltip title="信息">
                            {<TeamOutlined
                                style={{
                                    fontSize: '30px',
                                    cursor: 'pointer'
                                }}
                            />}
                        </Tooltip>
                    </span>
                </div>
            </div>
            {/* 聊天栏 */}
            <div style={{
                width: '100%',
                height: '65%',
                border: '1px solid #ccc',
                overflowY: 'auto',  //设置滚动条
            }} ref={chatContainerRef}  // 将这个容器关联到 ref
            >
                {messageList.map((msg, index) => {
                    // 默认不显示时间
                    let showTime = false;
                    if (index === 0) {
                        showTime = true;// 第一条消息显示时间
                    } else {
                        // 计算当前消息与上一条消息的时间差
                        const previousMsg = messageList[index - 1];
                        const timeDiff = calculateTimeDifference(msg.sendDate, previousMsg.sendDate);
                        // 如果时间差大于 2 分钟，则显示时间
                        if (timeDiff > 1) {
                            showTime = true;
                        }
                    }

                    return (
                        <ShowMsg key={index} msg={msg} showTime={showTime} frendInfo={frendInfo} />
                    );
                })}
            </div>

            {/* 表情栏 */}
            <div style={{
                width: '100%',
                height: '5%',
                display: 'flex',               // 使用 Flexbox 布局
                alignItems: 'center',          // 垂直居中对齐
            }}>
                <span style={{ marginLeft: '20px', fontSize: '20px', cursor: 'pointer' }}>  {/* 第一个表情不需要额外的左边距 */}
                    <SmileOutlined onClick={()=>setMessageType(EnumMessageType.IMAGE)}/>
                </span>
                <span style={{ marginLeft: '20px', fontSize: '20px', cursor: 'pointer' }}>  {/* 每个后续的表情离左边 20px */}
                    <FolderOpenOutlined onClick={() => setMessageType(EnumMessageType.FILE)} />
                </span>
                <span style={{ marginLeft: '20px', fontSize: '20px', cursor: 'pointer' }}>
                    <PictureOutlined onClick={() => setMessageType(EnumMessageType.IMAGE)} />
                </span>
                <span style={{ marginLeft: '20px', fontSize: '20px', cursor: 'pointer' }}>
                    <PhoneOutlined onClick={() => setMessageType(EnumMessageType.VIDEO)} />
                </span>
            </div>

            {/* 输入栏 */}
            <div style={{
                width: '100%',
                height: '12%',
            }}>
                <TextArea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Controlled autosize"
                    autoSize={{
                        minRows: 3,
                        maxRows: 3,
                    }}
                // style={{ border: 'none', outline: 'none' }}
                />
            </div>

            <div>
                <Button
                    color="primary"
                    variant="solid"
                    style={{
                        fontSize: '13px',
                        width: '60px',
                        height: '30px',
                        marginLeft: '570px',
                    }}
                    onClick={() => sendMsg(value, setValue)}
                >
                    发送
                </Button>
            </div>


        </div>
    )
}

const ShowMsg = (props) => {

    const { sessionId } = useParams();
    const msg = props.msg;
    const frendInfo = props.frendInfo;
    const userInfo = UserInfoState.getUserInfo(sessionId);
    //判断该消息 是哪个用户发的
    const isUser = msg.userId === userInfo.serialNo;


    return (
        <>
            {/* 根据逻辑判断是否显示时间 */}
            {props.showTime && (
                <div style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'gray',
                    marginTop: '10px',
                    marginBottom: '5px'
                }}>
                    {DateUtils.formatTimeStr(msg.sendDate)}
                </div>
            )}
            {/* 展示聊天记录 */}
            <div style={{
                margin: '10px',
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',  //根据用户判断在左还是右
                // alignItems: 'center'
            }}>
                {!isUser && <span style={{ marginRight: '10px' }}>{<Avatar size={40} src={<img src={frendInfo.picture} alt="头像" />} />}</span>}

                <span style={{
                    maxWidth: '50%',
                    padding: '10px',
                    backgroundColor: isUser ? '#e6f7ff' : '#f0f0f0',  //消息框背景颜色
                    borderRadius: '10px' //圆角框
                }}>
                    {msg.content}
                </span>

                {isUser && <span style={{ marginLeft: '10px' }}>{<Avatar size={40} src={<img src={userInfo.picture} alt="头像" />} />}</span>}
            </div>
        </>

    );
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，所以加 1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default MessageSub