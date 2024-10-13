import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';
import {message, Upload } from 'antd';
import { formJava } from '../../../api';
//接收一个图片文件和一个回调函数作为参数
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result)); //当文件读取完成后，FileReader会触发load事件
    reader.readAsDataURL(img);
};
//验证文件是否为JPG或PNG格式
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const UploadSub = (props) => {
    const { picture, getProfileUrl} = props;
    useEffect(()=>{
        setImageUrl(picture)
    },[]);
    //跟踪文件上传的状态 0未上传  1正在上传  2上传失败
    const [loading, setLoading] = useState("0");
    //存储上传后的图片URL或本地文件的base64编码
    const [imageUrl, setImageUrl] = useState();
    //info.file.status文件上传的状态  uploading: 文件正在上传中 done: 文件已成功上传 error: 文件上传失败
    const handleChange = (info) => {    
        //上传中
        if (info.file.status === 'uploading') {                         
            setLoading("1");                                           
            return;
        }
        //上传成功  url是图片的base64
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setLoading("0");
                console.log("上传成功:", info.file.originFileObj)
                setImageUrl(url);
            });
        }
        //上传失败
        if (info.file.status === 'error') {
            console.error("上传失败")
            setLoading("2");
        }
    };
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {loading === "1" ? <LoadingOutlined style={{ fontSize: '24px' }} />
                : loading === "2" ? <WarningOutlined style={{ fontSize: '24px' }} />
                    : <PlusOutlined style={{ fontSize: '24px' }} />}
        </button>
    );

    //上传方法
    const customRequest = ({ file, onSuccess, onError }) => {
        formJava('/chat/update/upload', file)
            .then(response => {
                if (response.data.code === "200") {
                    onSuccess(response);
                    getProfileUrl(response.data.data.imageUrl);
                }
            })
            .catch(error => {
                onError(error)
            })
    }
    return (
        <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={customRequest}       //自定义上传请求
            // action={uploadUrl} //上传到的服务器地址
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',  // 使图片成为圆形
                        objectFit: 'cover',  // 保持图片比例并裁剪超出部分
                    }}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    );
};
export default UploadSub;