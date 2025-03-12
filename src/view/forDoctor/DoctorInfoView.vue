<template>
    <DocTopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>个人信息</h2>
                    <div class="body2">
                        <div class="head">
                            <div class="headsex" v-show="doctor.doctorSex===1">
                                <img src="../../assets/img-new/男用户.png">
                            </div>
                            <div class="headsex" v-show="doctor.doctorSex===0">
                                <img src="../../assets/img-new/女用户.png">
                            </div>
                        </div>
                        <div class="info">
                            <div class="text">邮&nbsp;箱&nbsp;号：{{ doctor.doctorId }}</div>
                            <div class="text">用&nbsp;户&nbsp;名：{{ doctor.doctorName }}</div>
                            <div class="text">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：{{ getSexText(doctor.doctorSex) }}</div>
                            <div class="text">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域：{{doctor.specialty}}</div>
                            <div class="text">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：{{doctor.title}}</div>
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
import SideBar from "@/components/basic/SideBar.vue";
import DocTopComponent from "@/components/basic/DocTopComponent.vue";
const router = useRouter();
const store = useStore();
const { doctor } = storeToRefs(store);
function isDoctor() {
    if (doctor.value.doctorId ===''){
        alert("先登陆")
        router.push({
            path:"/docLogin"
        })
    }
}
function fetchDoctorInfo(){
    isDoctor();
    axiosInstance.get('/doctor/getDoctorInfo',{
        params:{
            doctorId : doctor.value.doctorId,
        }
    }).then(response => {
        doctor.value = response.data;
    }).catch(error => {
        console.error(error);
    });
}
onBeforeMount(()=>{
    fetchDoctorInfo();
});
function getSexText(contactSex){
    return contactSex === 1 ? '男' : '女';
}
function editInfo() {
    /*console.log("修改信息");*/
    router.push({
        path : "/updateDoctorInfo"
    })
}

function logout() {
    // 处理退出登录的逻辑
    sessionStorage.removeItem("token"); // 示例：移除 token
    router.push({ path: "/docLogin" });
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
    width: 1300px;
    height:680px;
    margin-top: 80px;
    margin-right: 20px;
}

.body {
    padding: 20px;
    flex-grow: 1; /* 使内容区域占据剩余空间 */
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-left: 380px;
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
    margin-top: 60px;
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
