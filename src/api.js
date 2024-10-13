import axios from 'axios';

const axiosJaca = axios.create({
    baseURL: '/javaApi', // 替换成你的 API 地址
    timeout: 5000,                      // 请求超时设置
});

// 简化的 GET 请求
export const getJava = (url, params = {}) => axiosJaca.get(url, { params });

// 简化的 POST 请求
export const postJava = (url, data) => axiosJaca.post(url, data,
    {
        headers: {
            'Accept': 'application/json', // 告诉服务器客户端期望 JSON 响应
            'Content-Type': 'application/json' // 确保请求内容也是 JSON
        }
    }
);
// 创建一个发送multipart/form-data请求的函数
export const formJava = (url, file) => {
    const formData = new FormData();
    formData.append('file', file); // 添加文件到FormData对象

    return axiosJaca.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const axiosPy = axios.create({
    baseURL: '/pyApi', // 替换成你的 API 地址
    timeout: 5000,                      // 请求超时设置
});

// 简化的 GET 请求
export const getPy = (url, params = {}) => axiosPy.get(url, { params });

// 简化的 POST 请求
export const postPy = (url, data) => axiosPy.post(url, data,
    {
        headers: {
            'Accept': 'application/json', // 告诉服务器客户端期望 JSON 响应
            'Content-Type': 'application/json' // 确保请求内容也是 JSON
        }
    }
);