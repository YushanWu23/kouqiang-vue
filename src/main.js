import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";
import './assets/main.css'
import BottomComponent from "@/components/basic/TopComponent.vue";
import {createPinia, defineStore} from "pinia";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8082/kouqiang-user',
})
export const useStore = defineStore('main',{
    state : () => {
        return {
            user : {
                userId : '',
                password : '',
                userName : '',
                userSex : 1,
            },
            defaultAddressInfo : {
                daId : -1,
                contactName : '',
                contactSex : null,
                contactTel : '',
                address:'',
            },
            doctor : {
                doctorId : '',
                password : '',
                doctorName : '',
                doctorSex : 1,
                specialty : '',
                title : '',
            },
            admin : {
                adminId : '',
                password : '',
            },
            isAuth : false,
        }
    }
})

createApp(App)
    .use(router)
    .use(createPinia())
    .component("BottomComponent",BottomComponent)
    .mount('#app')

// Axios 请求拦截器：自动添加 Token
axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // 添加 Token
    }
    return config;
});
// Axios 响应拦截器：处理 401 错误
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token 无效或过期
            sessionStorage.removeItem('token');
            useStore().isAuth = false; // 更新 Pinia 状态
            router.push('/login'); // 跳转到登录页
        }
        return Promise.reject(error);
    }
);
// 路由守卫：检查认证状态
router.beforeEach(async (to, from, next) => {
    const token = sessionStorage.getItem('token');
    const store = useStore();

    // 允许匿名访问的路由
    const anonymousPaths = ['/', '/businessList', '/regist', '/forgotPassword', '/login', '/docLogin', '/adminLogin','/docForgotPwd','/adminForgotPwd'];
    if (anonymousPaths.includes(to.path)) {
        next();
        return;
    }

    // 需要认证的路由
    if (!token) {
        next('/login');
        return;
    }

    // 检查 Token 有效性
    try {
        await axiosInstance.get('/user/validateToken'); // 假设后端有 Token 验证接口
        store.isAuth = true;
        next();
    } catch (error) {
        if (error.response && error.response.status === 403) {
            // Token 无效或权限不足
            sessionStorage.removeItem('token');
            store.isAuth = false;
            next('/login');
        } else {
            // 其他错误（如网络问题）
            console.error('验证 Token 失败:', error);
            next('/error'); // 跳转到错误页面
        }
    }
});

// WebSocket 连接工具函数
export const connectWebSocket = (onMessageReceived) => {
    const socket = new SockJS('http://localhost:8082/kouqiang-user/ws/consultation');
    const stompClient = Stomp.over(socket);

    stompClient.connect(
        {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`, // 携带 Token
        },
        () => {
            // 连接成功，订阅频道
            stompClient.subscribe('/topic/consultation', (message) => {
                if (onMessageReceived) {
                    onMessageReceived(message.body);
                }
            });
        },
        (error) => {
            console.error('WebSocket 连接失败:', error);
        }
    );

    return stompClient;
};
