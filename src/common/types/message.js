/**
 * 消息类型
 */
export class Message {
    messageId = null;
    sendType = null;
    data = null;
    constructor(messageId, sendType, data) {
        this.messageId = messageId;
        this.sendType = sendType;
        this.data = data;
    }
}