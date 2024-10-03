/**
 * 登录状态
 */

let loginState = false;

export const LoginState = {
    setLoginState(state) {
        loginState = state;
    },

    getLoginState() {
        return loginState;
    },

    deleteLoginState() {
        loginState = false;
    }

}