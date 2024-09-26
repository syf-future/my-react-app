/**
 * 项目的根组件
 * App -> index.js -> public/index.html 31行 root
 * @returns 
 */

import { createContext, useContext } from "react";

const MsgContext = createContext();

function A() {
  return (
    <div>
      子组件
      <B />
    </div>
  );
}
function B() {
  const msg = useContext(MsgContext)
  return (
    <div>
      孙组件
      <p>父组件的数据：{msg}</p>
    </div>
  );
}
function App() {
  const msg = "父组件的数据"
  return (
    <div>
      <MsgContext.Provider value={msg}>
        <A />
      </MsgContext.Provider>
      父组件

    </div>
  );
}

export default App    //导出方法 可供外部调用