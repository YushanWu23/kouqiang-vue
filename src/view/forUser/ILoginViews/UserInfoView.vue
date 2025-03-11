<template>
    <TopComponent/>
    <SideBar/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>个人信息</h2>
                    <div class="button1">
                        <button @click="editInfo">修改信息</button>
                    </div>
                    <div class="body2">
                        <div class="head">
                            <div class="headsex" v-show="user.userSex===1">
                                <img src="../../../assets/img-new/男用户.png">
                            </div>
                            <div class="headsex" v-show="user.userSex===0">
                                <img src="../../../assets/img-new/女用户.png">
                            </div>
                        </div>
                        <div class="info">
                            <div class="text">邮&nbsp;箱&nbsp;号:&nbsp;&nbsp;{{ user.userId }}</div>
                            <div class="text">用&nbsp;户&nbsp;名:&nbsp;&nbsp;{{ user.userName }}</div>
                            <div class="text">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:&nbsp;&nbsp;{{ getSexText(user.userSex) }}</div>
                        </div>
                    </div>

                    <div class="button2">
                        <button @click="logout">退出登陆</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {axiosInstance, useStore} from "@/main";
import { storeToRefs } from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";
import SideBar from "@/components/basic/SideBar.vue";
const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
function fetchUserInfo(){
    isUser();
    axiosInstance.get('/user/getUserInfo',{
        params:{
            userId : user.value.userId,
        }
    }).then(response => {
        user.value = response.data;
    }).catch(error => {
        console.error(error);
    });
}
onBeforeMount(()=>{
    fetchUserInfo();
});
function getSexText(contactSex){
    return contactSex === 1 ? '男' : '女';
}
function editInfo() {
    /*console.log("修改信息");*/
    router.push({
        path : "/updateUserInfo"
    })
}

function logout() {
    // 处理退出登录的逻辑
    sessionStorage.removeItem("token"); // 示例：移除 token
    router.push({ path: "/login" });
}
</script>
<style scoped>
.background {
    background-color: #e9f2ff;
    height: 100%;
    width: 100%;
    z-index: -1; /* 确保背景图在最底层 */
    object-fit: cover;
    position: fixed;
    top: 0;
    left: 0;
}

.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.container {
    display: flex;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
    width: 1100px;
    margin-left: 190px;
    height:680px;
    margin-top: 80px;
}

.body {
    padding: 20px;
    flex-grow: 1; /* 使内容区域占据剩余空间 */
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-left: 270px;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 180px;
    margin-top: 10px;
}
.body2{
    display: flex;
}
.head{
    margin-top: 10px;
    height: 150px;
    width: 150px;
}
.info {

    margin-top: 30px;
    margin-left: 40px;
}
.info .text{
    font-size: 16px;
    margin-bottom: 20px;
}

.button1 {
    display: flex;
    margin-left: 450px;
}

.button1 button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px; /* 按钮圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    font-size: 14px;
}
.button2{
    display: flex;
    justify-items: center;
    align-items: center;
    margin-top: 70px;
}
.button2 button {
    width: 520px;
    padding: 10px 0px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px; /* 按钮圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    font-size: 14px;
}

button:hover {
    background-color: #0056b3; /* 鼠标悬停时的背景颜色 */
}
</style>
