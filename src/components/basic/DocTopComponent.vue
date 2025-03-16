<template>
    <div class="bottomBar">
        <div class="logo">
            <i class="fa-solid fa-tooth"></i>
            <div class="text1">
                口腔健康助手
            </div>
        </div>
        <div class="group">
            <i class="group-hover:cursor-pointer fa-solid fa-house-chimney"></i>
            <button @click="goIndex">咨询</button>
        </div>
        <div class="group">
            <i class="group-hover:cursor-pointer fa-regular fa-compass"></i>
            <button @click="goReservation">看诊</button>
        </div>
        <div class="group">
            <i class="group-hover:cursor-pointer fa-regular fa-file-lines"></i>
            <button @click="goSchedule">排班</button>
        </div>
        <div class="group">
            <i class="group-hover:cursor-pointer fa-regular fa-user"></i>
            <button @click="goUserInfo">我的</button>
        </div>
    </div>
</template>

<script setup>
import {useRouter} from "vue-router";
const router = useRouter()

function goIndex(){
    router.push({
        path : "/",
    })
    console.log("咨询")
}
function goReservation(){
    router.push({
        path : "/docReservation",
    })
    console.log("进入看诊页面")
}
function goSchedule(){
    router.push({
        path : "/docSchedule",
    })
    console.log("进入排班页面")
}
function goUserInfo(){
    router.push({
        path : "/doctorInfo",
    })
    console.log("进入我的页面")
}
</script>

<style scoped>
.bottomBar{
    display: flex;
    width: 88%;
    height: 60px;
    color: #444444;
    top: 30px;
    left: 80px;
    align-items: center;
    position: fixed;
    background-color: white;
    border-bottom: solid 1px #DDD; /* 顶部边框 */
    z-index: 1000; /* 确保在其他元素之上 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}
.logo{
    display: flex;
    width: 20%;
    color: #0056b3;
    align-items: center;
    margin-left: 50px;
    margin-right: 100px;
}
.text1{
    font-size: 22px;
    padding-left: 6px;
}
.bottomBar .group{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    padding-right: 75px;
    padding-left: 75px;
    border-right: solid 1px #ccc;
}
button{
    margin-left: 6px;
}
</style>
