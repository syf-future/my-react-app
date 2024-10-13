import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Upload} from 'antd';
import { useParams } from 'react-router-dom';
import { UserInfoState } from '../../../common/cookies/userInfoState';
import UploadSub from './uploadSub';
import { postJava } from '../../../api';

const Information = (props) => {
    const [form] = Form.useForm();
    const { sessionId } = useParams();
    const userInfo = UserInfoState.getUserInfo(sessionId);
    // 控制模态窗口显示/隐藏的状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { changeUserInfo } = props;
    useEffect(() => {
        setIsModalVisible(true);
        setProfileUrl(userInfo.picture);
    }, []);
    
    // 关闭模态窗口
    const handleCancel = () => {
        setIsModalVisible(false);
        changeUserInfo(false)
    };

    const [profileUrl, setProfileUrl] = useState();
    const getProfileUrl = (profileUrl)=>{
        setProfileUrl(profileUrl);
    }

    //表单是否可以选中状态   true不可选中
    const [componentDisabled, setComponentDisabled] = useState(true);
    //按钮状态 true确认
    const [buttonState, setButtonState] = useState(false);
    //按下编辑按钮
    const onEditBut = ()=>{
        setComponentDisabled(false);
        setButtonState(true);
    }
    //按下确认按钮
    const onAffirmBut = () => {
        setIsModalVisible(false);
        changeUserInfo(false);
        const userName = form.getFieldValue("userName");
        const phone = form.getFieldValue("phone");
        postJava('/chat/update/userInfo', { "serialNo": userInfo.serialNo, "userName": userName, "phone": phone, "picture": profileUrl })
            .then(response=>{
                if (response.data.code === "200") {
                    console.log("更新用户信息")
                    UserInfoState.updateUserInfo(sessionId, response.data.data)
                }
            })
        .catch(error=>{
            console.error("更新用户信息失败",error)
        })
    }
    //按钮变更
    const choseButton = ()=>{
        if(buttonState){
            return (<Button type="primary" onClick={onAffirmBut}>确认</Button>)
        }else{
            return (<Button onClick={onEditBut}>编辑</Button>)
        }
    }
    return (
        <div style={{ marginTop: '150px' }}>
            {/* 模态窗口 */}
            <Modal
                form = {form}
                title="用户信息"
                open={isModalVisible}   // 控制显示状态
                onCancel={handleCancel}     // 关闭模态窗口的事件
                footer={null}               // 隐藏默认的底部按钮
                width={400}                 // 设置模态框的宽度
                // style={{ height: '400px' }}  // 设置内容区域的高度
                centered                    // 使模态框居中
            >
                <Form
                    labelCol={{span: 4,}}
                    wrapperCol={{span: 14,}}
                    layout="horizontal"
                    disabled={componentDisabled}
                    style={{maxWidth: 600,}}
                    initialValues={{ userName: userInfo.userName, phone: userInfo.phone }}
                >
                    <Form.Item name="userName" label="用户名">
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="手机号">
                        <Input />
                    </Form.Item>
                    <Form.Item label="头像" >
                        <UploadSub picture={profileUrl} getProfileUrl={getProfileUrl}/>
                    </Form.Item>
                </Form>
                <div>
                    {choseButton()}
                </div>
            </Modal>
        </div>
    );
};

export default Information;