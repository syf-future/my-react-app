/**
 * 用户信息类型
 */
export class UserInfo {
    serialNo = null;
    account = null;
    userName = null;
    phone = null;
    picture = null;

    constructor(serialNo,account,userName,phone,picture) {
        this.serialNo = serialNo;
        this.account = account;
        this.userName = userName;
        this.phone = phone;
        this.picture = picture;
    }
}