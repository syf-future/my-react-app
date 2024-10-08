import { UserAddOutlined } from "@ant-design/icons"
import { useState } from "react";
import { UserInfoState } from "../../../common/cookies/userInfoState";
import { useParams } from "react-router-dom";
import { EnumSubPageType } from "../../../common/enums/enumSubPageType";

function Linkman(props) {
    const { getSubPage } = props;
    const { sessionId } = useParams();
    const userInfo = UserInfoState.getUserInfo(sessionId);
    //鼠标经过列表的状态
    const [hoveredIndex, setHoveredIndex] = useState(null);
    //鼠标点击列表的状态
    const [clickIndex, setClickIndex] = useState(null);
    //列表点击事件
    const clickList = (index, info) => {
        setClickIndex(index)
        console.log(info);
        getSubPage(EnumSubPageType.ADDRESS);
    }
    return (
        <div style={{
            width: '100%',
            height: '100%',
        }}>
            <div
                style={{
                    width: '100%',
                    height: '12%',
                    border: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',  // 垂直居中
                    cursor: 'pointer',
                    backgroundColor: hoveredIndex === -1 ? '#f0f0f0' : clickIndex === -1 ? '#f0f0f0' : 'transparent', // 根据 hoveredIndex 设置背景颜色
                }}
                onMouseEnter={() => setHoveredIndex(-1)} // 鼠标进入时设置 hoveredIndex
                onMouseLeave={() => setHoveredIndex(null)} // 鼠标离开时清除 hoveredIndex     
                onClick={() => clickList(-1, { serialNo: userInfo.serialNo })}
            >
                <span style={{
                    width: '38px',
                    height: '38px',
                    border: '1px solid #ccc',
                    marginRight: '10px',
                    marginLeft: '10px',
                    backgroundColor: '#D2B48C',  // 设置背景为土黄色
                    display: 'flex',
                    justifyContent: 'center',  // 水平居中
                    alignItems: 'center',  // 垂直居中
                }}>
                    <UserAddOutlined style={{ fontSize: '24px' }} />
                </span>
                <span style={{ fontSize: '18px' }}>
                    新的朋友
                </span>
            </div>

        </div>
    )
}
export default Linkman