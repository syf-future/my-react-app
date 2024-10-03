import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name:"counter",
    //初始化
    initialState:{
        count:0
    },
    //修改状态的方法
    reducers:{
        increment(state) {       //state其实就是initialState
            state.count++
        },
        decrement(state){
            state.count--
        }
    }
});
// 导出生成的 action creators 和 reducers
export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;