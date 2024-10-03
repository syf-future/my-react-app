import { configureStore } from "@reduxjs/toolkit";

import counterReducer from './modules/counterStore'; // 导入我们定义的 counterSlice

// 使用 configureStore 创建 Redux store
const store = configureStore({
    reducer: {
        counter: counterReducer, // 定义一个 slice 对应的 reducer
    },
});

export default store;