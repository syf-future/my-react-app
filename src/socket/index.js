import { EnumSendType } from "../common/enums/enumSendType";
import { ClientState } from "../common/status/clientState";
import { LoginState } from "../common/status/loginState";
import { MessageState } from "../common/status/messageState";

let so = null;
const webSocketUrl = process.env.REACT_APP_WEB_SOCKET_URL;
export const Socket = {
    connect() {
        if (so === null) {
            so = new WebSocket(webSocketUrl);
        }
        // 监听连接成功事件
        so.onopen = function (event) {
            console.log('WebSocket 连接已建立');
            // 连接成功后发送消息
            ClientState.setClientState(true);
        };

        // 监听收到服务器消息事件
        so.onmessage = function (event) {
            console.log('收到服务器消息:', event.data);
            // 去掉前缀 "Server: "
            const jsonString = event.data.replace(/^Server: /, '');
            const message = JSON.parse(jsonString);
            console.log('收到服务器消息:', message);
            switch (message.sendType) {
                case EnumSendType.LOGIN:
                    LoginState.setLoginState(true);
                    break;
                case EnumSendType.FRIEND:
                    MessageState.setMessageState(message.data)
                    break;
                case EnumSendType.GROUP:
                    break;
                default:
                    console.error("接收的消息类型错误：" + message.chatType)
                    break;
            }
        };

        // 监听错误事件
        so.onerror = function (event) {
            console.error('WebSocket 错误:', event);
        };
        // 监听关闭事件
        so.onclose = function (event) {
            console.log('WebSocket 连接关闭，代码:', event.code, '原因:', event.reason);
        };
    },

    sendMsg(msg) {
        const messageToSend = JSON.stringify(msg);
        new Promise((resolve, reject) => {      //new Promise  异步操作
            if (ClientState.getClientState()) {
                so.send(messageToSend);
                resolve();                  //代表已完成
            } else {
                const startTime = Date.now();
                const interval = setInterval(() => {
                    if (ClientState.getClientState()) {
                        console.log("连接成功开始发送消息：" + messageToSend);
                        so.send(messageToSend);
                        clearInterval(interval);        //结束定时器
                        resolve();
                    } else if (Date.now() - startTime >= 5000) {
                        clearInterval(interval);
                        reject(new Error("客户端未连接"));
                    }
                }, 100); // 每 100 毫秒检查一次
            }
        });
    },

    deleteSocket() {
        if (so !== null) {
            so.close();
            so = null;
        }
    }
}