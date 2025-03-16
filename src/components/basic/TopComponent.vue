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
      <button @click="goIndex">问答</button>
    </div>
    <div class="group">
        <i class="group-hover:cursor-pointer fa-regular fa-envelope"></i>
        <button @click="goMessage">咨询</button>
    </div>
    <div class="group">
        <i class="group-hover:cursor-pointer fa-regular fa-calendar"></i>
        <button @click="goReservation">预约</button>
    </div>
    <div class="group">
      <i class="group-hover:cursor-pointer fa-regular fa-compass"></i>
      <button @click="goOrders">购物</button>
    </div>
    <div class="group">
      <i class="group-hover:cursor-pointer fa-regular fa-file-lines"></i>
      <button @click="goKnowledge">科普</button>
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
    path : "/model",
  })
  console.log("问答")
}
function goMessage(){
    router.push({
        path : "/userChat",
    })
    console.log("咨询")
}
function goReservation(){
    router.push({
        path : "/reservation",
    })
    console.log("预约")
}
function goOrders(){
    router.push({
        path : "/productInfo",
    })
    console.log("进入购物页面")
}
function goKnowledge(){
    router.push({
        path : "/knowledge",
    })
    console.log("进入科普页面")
}
function goUserInfo(){
    router.push({
        path : "/userInfo",
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
    padding-right: 40px;
    padding-left: 40px;
    border-right: solid 1px #ccc;
}
button{
    margin-left: 6px;
}
</style>
