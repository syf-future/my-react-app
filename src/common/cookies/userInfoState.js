/**
 * 记录当前登录的用户信息
 */
import Cookies from 'js-cookie';

export const UserInfoState = {
    setUserInfo(sessionId,info){
        // 将对象转换为 JSON 字符串
        const userString = JSON.stringify(info);
        // 将字符串存入 Cookies
        Cookies.set(`USER_INFO-${sessionId}`, userString, { expires: 7 });
    },

    getUserInfo(sessionId){
        let userInfo = null;
        const storedUserString = Cookies.get(`USER_INFO-${sessionId}`);
        // 解析字符串回对象
        if (storedUserString) {
            userInfo = JSON.parse(storedUserString);
        }
        return userInfo;
    },

    updateUserInfo(sessionId, updatedInfo) {
        // 获取当前的用户信息
        let currentUserInfo = this.getUserInfo(sessionId);
        if (currentUserInfo) {
            // 更新用户信息
            currentUserInfo = { ...currentUserInfo, ...updatedInfo };
            // 保存更新后的信息
            this.setUserInfo(sessionId, currentUserInfo);
        }
    },

    deleteUserInfo(sessionId){
        // 删除存储的用户信息
        Cookies.remove(`USER_INFO-${sessionId}`);
    }
}