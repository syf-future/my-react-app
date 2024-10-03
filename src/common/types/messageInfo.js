/**
 * 消息信息
 */
export class MessageInfo {
    userId = null;
    friendId = null;
    groupId = null;
    sendType = null;
    messageType = null;
    content = null;
    constructor(userId, friendId, groupId, sendType, messageType, content) {
        this.userId = userId;
        this.friendId = friendId;
        this.groupId = groupId;
        this.sendType = sendType;
        this.messageType = messageType;
        this.content = content;
    }
}