<template>
    <div class="background">
        <img src="../../assets/img-new/背景图3.png">
    </div>
  <div class="wrapper">
      <div class="login-container">
          <div class ="head">
              <div class = "headText">
                  用户登陆
              </div>
          </div>
          <div class="EmailNum">
              <div class="Text1">
                  邮箱号：
              </div>
              <div class="Text2">
                  <input type="text" v-model="user.userId" placeholder="邮箱号">
              </div>
          </div>
          <div class="pwd">
              <div class="Text1">
                  密&nbsp;&nbsp;&nbsp;&nbsp;码：
              </div>
              <div class="Text2">
                  <input type="password" v-model="user.password" placeholder="密&nbsp;&nbsp;&nbsp;&nbsp;码">
              </div>
          </div>
          <div class="login">
              <button @click="login">登陆</button>
          </div>
          <div class="bottom-links">
              <div class="register">
                  <span>还没有注册？</span>
                  <button @click="regist">去注册</button>
              </div>
              <div class="forgot-password">
                  <button @click="forgotPassword">忘记密码</button>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import BottomComponent from "@/components/basic/BottomComponent.vue";
import {axiosInstance, useStore} from "@/main";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";

const router = useRouter()
const store = useStore()
const { user } = storeToRefs(store)
function login() {
    if (!user.value.userId) {
        alert('手机号码不能为空！');
        return;
    }
    if (!user.value.password) {
        alert('密码不能为空！');
        return;
    }
    axiosInstance.post('/user/login',{
        userId : user.value.userId,
        pwd: user.value.password,
    },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        }
    }).then(response=>{
        if (!response.data){
            alert('用户名或密码不正确！');
            return
        }
        sessionStorage.setItem("token",response.data)
        alert('登录成功！');
        /*router.go(-1)*/
    }).catch(error=>{
        console.error(error);
    });
}
function regist() {
    router.push({
        path : "/regist"
    })
}
function forgotPassword() {
    router.push({
        path : "/forgotPassword"
    })
}
</script>
<style scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1; /* 确保背景图在最底层 */
}

.background img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 保持图片比例并填充整个区域 */
}

/* 设置登录框的样式 */
.wrapper {
    display: flex;
    flex-direction: column; /* 子元素水平排列 */
    justify-content: center;
    align-items: flex-end;
    height: 100vh; /* 高度占满整个视口 */
    box-sizing: border-box; /* 包含 padding */
}
.login-container {
    background-color: white;
    padding: 30px;
    border-radius: 8px; /* 圆角边框 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
    width: 400px;
}
.head {
    margin-top: 10px;
    margin-bottom: 25px;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.EmailNum, .pwd, .login {
    margin-bottom: 25px;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
}

.headText {
    font-size: 24px;
    font-weight: bold;
    display: flex;
    color: #555555;
}

.Text1 {
    font-size: 16px;
    width: 20%;
}

.Text2 input {
    width: 135%;
    padding: 5px 5px 5px 10px;
    margin-left: 5px;
    border: 1px solid #ccc; /* 输入框边框 */
    border-radius: 4px;
}

.login button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px; /* 按钮圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
}

.login button:hover {
    background-color: #0056b3; /* 鼠标悬停时的背景颜色 */
}

.bottom-links {
    display: flex;
    align-items: center;
}

.bottom-links .register {
    display: flex; /* 使用 flex 布局 */
    align-items: center; /* 垂直居中 */
    width: 50%;
}

.bottom-links .register span {
    margin-right: 3px;
    font-size: 15px;
    color: #666;
}
.bottom-links .register button {
    background-color: transparent; /* 透明背景 */
    color: #007bff;
    border: none; /* 无边框 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    padding-left: 5px;
    font-size: 15px;
}
.bottom-links .register button:hover {
    text-decoration: underline; /* 鼠标悬停时下划线 */
}
.bottom-links .forgot-password button {
    background-color: transparent; /* 透明背景 */
    color: #007bff;
    border: none; /* 无边框 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    font-size: 15px;
    margin-left: 100px;
}

.bottom-links .forgot-password button:hover {
    text-decoration: underline; /* 鼠标悬停时下划线 */
}
</style>
