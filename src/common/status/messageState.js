/**
 * 接收的消息状态
 */

let messageState = null;
let listeners = [];  // 存储所有监听变化的回调函数
export const MessageState = {
    setMessageState(message) {
        messageState = message;
        console.log("开始处理接收到的消息：",message);
        listeners.forEach(callback => callback(message));  // 通知所有监听的回调
    },

    getMessageState() {
        return messageState;
    },

    subscribe(callback) {
        listeners.push(callback);  // 添加新的监听回调
    },

    deleteMessageState() {
        messageState = null;
    },
    unsubscribe(callback) {
        listeners = listeners.filter(listener => listener !== callback);  // 移除监听
    }
}