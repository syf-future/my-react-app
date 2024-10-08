import React, { useEffect, useState } from 'react';
import {Modal, Form, Input, Button } from 'antd';

const CompileSub = (props) => {
    // 控制模态窗口显示/隐藏的状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { closeCompile } = props;
    useEffect(()=>{
        console.log(1)
        setIsModalVisible(true);
    },[]);

    // 关闭模态窗口
    const handleCancel = () => {
        setIsModalVisible(false);
        closeCompile(false)
    };

    // 表单提交
    const onFinish = (values) => {
        console.log('表单数据: ', values);
        // 提交后关闭模态窗口
        setIsModalVisible(false);
        closeCompile(false)
    };

    return (
        <div style={{ marginTop: '150px' }}>
            {/* 模态窗口 */}
            <Modal
                title="设置表单"
                open={isModalVisible}   // 控制显示状态
                onCancel={handleCancel}     // 关闭模态窗口的事件
                footer={null}               // 隐藏默认的底部按钮
            >
                <Form
                    name="settingsForm"
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="设置项1"
                        name="setting1"
                        rules={[{ required: true, message: '请输入设置项1' }]}
                    >
                        <Input placeholder="请输入设置项1" />
                    </Form.Item>

                    <Form.Item
                        label="设置项2"
                        name="setting2"
                        rules={[{ required: true, message: '请输入设置项2' }]}
                    >
                        <Input placeholder="请输入设置项2" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            保存设置
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CompileSub;