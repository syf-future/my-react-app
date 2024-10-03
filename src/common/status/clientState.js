/**
 * 客户端连接状态
 */

let clientstate = false;

export const ClientState = {
    setClientState(state) {
        clientstate = state;
    },

    getClientState() {
        return clientstate;
    },

    deleteClientState() {
        clientstate = false;
    }

}