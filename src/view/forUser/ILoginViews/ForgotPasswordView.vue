<template>
    <div class="background">
        <img src="../../../assets/img-new/背景图3.png">
    </div>
    <div class="wrapper">
        <div class="login-container">
            <div class ="head">
                <div class = "headText">
                    忘记密码
                </div>
            </div>
            <div class="emailNum">
                <div class="Text1">
                    邮&nbsp;箱&nbsp;号：
                </div>
                <div class="Text2">
                    <input type="text" v-model="user.userId" placeholder="邮&nbsp;箱&nbsp;号">
                </div>
            </div>
            <div class="emailCode">
                <div class="Text1">
                    验&nbsp;证&nbsp;码：
                </div>
                <div class="Text2">
                    <input type="text" v-model="emailcode" placeholder="验&nbsp;证&nbsp;码">
                    <button @click="sendEmailCode">获取验证码</button>
                </div>
            </div>
            <div class="pwd">
                <div class="Text1">
                    新&nbsp;密&nbsp;码：
                </div>
                <div class="Text2">
                    <input type="password" v-model="user.password" placeholder="新&nbsp;密&nbsp;码">
                </div>
            </div>
            <div class="rePwd">
                <div class="Text1">
                    确认密码：
                </div>
                <div class="Text2">
                    <input type="password" v-model="rePassword" placeholder="确认密码">
                </div>
            </div>
            <div class="passwordSave">
                <button @click="passwordSave">保存</button>
            </div>
            <div class="login">
                <span>已想起密码？</span>
                <button @click="login">去登陆</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import BottomComponent from "@/components/basic/TopComponent.vue";
import {axiosInstance, useStore} from "@/main";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";

const router = useRouter()
const store = useStore()
const { user } = storeToRefs(store)
const rePassword = ref('')
const emailcode = ref('')
function passwordSave() {
    if (!user.value.userId) {
        alert('邮箱号不能为空！');
        return;
    }
    if (!emailcode) {
        alert('验证码不能为空！');
        return;
    }
    if (!user.value.password) {
        alert('新密码不能为空！');
        return;
    }
    if (user.value.password !== rePassword.value) {
        alert("新密码和确认密码不匹配！");
        return;
    }
    axiosInstance.post('/user/passwordForget',{
        userId : user.value.userId,
        newPassword: user.value.password,
        emailCode: emailcode.value,
    },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        },
    }).then((response)=>{
        if (!response.data){
            alert('保存失败，请重试！');
            return;
        }
        alert('保存成功！');
        router.push('/')
    }).catch(error=>{
        console.error(error);
    });
}
function login() {
    router.push({
        path : "/login"
    })
}
function sendEmailCode(){
    if (!user.value.userId) {
        alert('邮箱号不能为空！');
        return;
    }

    axiosInstance.post('/user/sendForgetPasswordEmailCode', {
        userId: user.value.userId
    },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        },
    }).then(response => {
        if (response.data === 1) {
            alert('验证码已发送，请注意查收！');
        } else {
            alert('验证码发送失败，请稍后重试！');
        }
    }).catch(error => {
        console.error(error);
        alert('验证码发送失败，请稍后重试！');
    });
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
.wrapper {
    display: flex;
    flex-direction: column; /* 子元素水平排列 */
    justify-content: center;
    align-items: flex-end;
    height: 105vh; /* 高度占满整个视口 */
    box-sizing: border-box; /* 包含 padding */
}
.login-container {
    background-color: white;
    padding: 20px 30px 20px;
    border-radius: 8px; /* 圆角边框 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
    width: 400px;
}
.wrapper .head {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.headText {
    font-size: 24px;
    font-weight: bold;
    display: flex;
    color: #555555;
}
.emailNum, .pwd, .rePwd, .name, .sex, .emailCode{
    margin-bottom: 12px;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
}
.regist{

    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
}
.Text1 {
    font-size: 16px;
    width: 25%;
}
.Text2 input {
    width: 125%;
    padding: 5px 5px 5px 10px;
    margin-left: 5px;
    border: 1px solid #ccc; /* 输入框边框 */
    border-radius: 4px; /* 输入框圆角 */
}
.wrapper .sex .Text3{
    width: 135%;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: left;
}
.wrapper .sex .Text3 input[type="radio"] {
    margin-right: 10px;
    margin-left: 10px;
}
.emailCode .Text2 input {
    width: 60%;
    padding: 5px 5px 5px 10px;
    margin-left:15px;
    border: 1px solid #ccc; /* 输入框边框 */
    border-radius: 4px; /* 输入框圆角 */
}
.emailCode .Text2 button {
    width: 34%;
    padding: 5px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px;
    cursor: pointer; /* 鼠标悬停时显示手型 */
}

.emailCode .Text2 button:hover {
    background-color: #0056b3; /* 鼠标悬停时的背景颜色 */
}
.passwordSave button {
    width: 100%;
    padding: 10px;
    margin-top: 2px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px;
    cursor: pointer; /* 鼠标悬停时显示手型 */
}

.passwordSave button:hover {
    background-color: #0056b3; /* 鼠标悬停时的背景颜色 */
}
.login {
    margin-top: 10px;
    display: flex;
    align-items: center;
    width: 100%;
}
.login span {
    font-size: 15px;
    color: #666;
    width: 30%;
}
.login button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: transparent; /* 透明背景 */
    color: #007bff;
    border: none; /* 无边框 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    padding-left: 5px;
    font-size: 15px;
}
.login button:hover {
    text-decoration: underline; /* 鼠标悬停时下划线 */
}

</style>
