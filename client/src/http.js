import axios from 'axios';
import { Message, Loading } from 'element-ui';
import router from './router';

// 定义加载动画方法
let loading;
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: "稍待片刻...",
        background: 'rgba(0,0,0,0,7)'
    });
}

function endLoading() {
    loading.close();
}

// 请求拦截
axios.interceptors.request.use(config => {
    startLoading();

    if (localStorage.eleToken) {
        // 设置统一的request header
        config.headers.Authorization = localStorage.eleToken;
    }

    return config;
}, error => {
    return Promise.reject(error);
})

// 响应拦截
axios.interceptors.response.use(response => {
    endLoading();
    return response;
}, error => {
    endLoading();
    Message.error(error.response.data);

    //获取错误状态码，并清除过期的token
    const { status } = error.response;
    if (status == 401) {
        Message.error('Token已过期，请重新登录！');
        // 清除失效token
        localStorage.removeItem('eleToken');
        // 跳转到登录页面
        router.push("/login");
    }

    return Promise.reject(error);
})

export default axios;