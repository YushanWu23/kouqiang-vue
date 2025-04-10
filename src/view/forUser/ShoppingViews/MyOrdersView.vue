
<script setup>
import {axiosInstance, useStore} from "@/main";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";
import SideBar from "@/components/basic/SideBar.vue";
const router = useRouter()
const store = useStore()
const { user } = storeToRefs(store)
const orders = ref([]);
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
function fetchOrders(){
    isUser();
    axiosInstance.get('/orders/getOrdersByUserId',{
        params:{
            userId : user.value.userId,
        }
    }).then(response => {
        orders.value = response.data;
        orders.value.forEach((order) => {
            order.showState = false;
        })
    }).catch(error => {
        console.error(error);
    });
}
onBeforeMount(()=>{
    fetchOrders();
});
function showInfo(order){
    order.showState = !order.showState
}
function goPayment(orderId){
    router.push({
        path : "/payment",
        query :{
            orderId : orderId,
        }
    })
}
function deleteOrder(orderId) {
  axiosInstance.delete(`/orders/deleteOrder`, {
    params: {
      orderId: orderId
    }
  }).then(response => {
    if (response.data.success) {
      alert("订单删除成功");
      fetchOrders(); // 刷新订单列表
    } else {
      alert("订单删除失败: " + response.data.message);
    }
  }).catch(error => {
    console.error("删除订单时出错:", error);
    alert("删除订单时出错");
  });
}
</script>

<template>
    <TopComponent/>
    <SideBar/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>我的订单</h2>
                    <div class="body1">
                        <div class="text1" >
                            未支付订单信息:
                        </div>
                        <ul class="nonePayList">
                            <li v-for="order in orders" v-show="!order.orderState">
                                <div class="content">
                                    <div class="left" @click="showInfo(order)">
                                        {{order.orderDate}}&nbsp;<!--改为时间-->
                                        <i class="fa-solid fa-caret-down"></i>
                                    </div>
                                    <div class="right">
                                        <div class="payPrice">
                                            ¥{{order.orderTotal}}
                                        </div>
                                        <div class="payText" >
                                            <button @click="goPayment(order.orderId)">去支付</button>
                                        </div>
                                       <div class="payText" >
                                            <button @click="deleteOrder(order.orderId)">删除</button>
                                       </div>
                                    </div>
                                </div>
                                <ul class="orderList" v-show="order.showState">
                                    <li v-for="item in order.orderDetails">
                                        <div class="left">
                                            <div class="leftText">
                                                {{item.product.productName}}
                                            </div>
                                            <div class="leftText">
                                                x {{item.quantity}}
                                            </div>
                                        </div>
                                        <div class="right">
                                            ¥{{item.product.productPrice}}
                                        </div>
                                    </li>
                                    <div class="deliveryPrice">
                                        <div class="left">
                                            配送费
                                        </div>
                                        <div class="right">
                                            ¥3
                                        </div>
                                    </div>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="body2">
                        <div class="text1">
                            已支付订单信息:
                        </div>
                        <ul class="alreadyPayList">
                            <li v-for="order in orders" v-show="order.orderState">
                                <div class="content">
                                    <div class="left" @click="showInfo(order)">
                                        {{order.orderDate}}&nbsp;<!--改为时间-->
                                        <i class="fa-solid fa-caret-down"></i>
                                    </div>
                                    <div class="right">
                                        ¥{{order.orderTotal}}
                                    </div>
                                </div>
                                <ul class="orderList" v-show="order.showState">
                                    <li v-for="item in order.orderDetails">
                                        <div class="left">
                                            <div class="leftText">
                                                {{item.product.productName}}
                                            </div>
                                            <div class="leftText">
                                                x {{item.quantity}}
                                            </div>
                                        </div>
                                        <div class="right">
                                            ¥{{item.product.productPrice}}
                                        </div>
                                    </li>
                                    <div class="deliveryPrice">
                                        <div class="left">
                                            配送费
                                        </div>
                                        <div class="right">
                                            ¥3
                                        </div>
                                    </div>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
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
    margin-left: 150px;
    overflow-y: auto;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 320px;
    margin-top: 10px;
}
.body1{
    margin-right: 80px;
}
.body1 .text1{
     font-size:1.2vw;
     color: #555555;
    padding-bottom: 10px;
}
.body1 .nonePayList{
    width: 100%;
}
.body1 .nonePayList li .content{
    display: flex;
    font-size: 1vw;
    justify-content: space-between;
    padding-top: 0.5vw;
}
.body1 .nonePayList li .content .left{
    display: flex;
    color: #555555;
    align-items: center;
}
.body1 .nonePayList li .content .right{
    display: flex;
    justify-content:flex-end;
    align-items: center;
}
.body1 .nonePayList li .content .right .payPrice{
    color: #555555;
}
.body1 .nonePayList li .content .right .payText{
    color: white;
    background-color: darkorange;
    margin-left: 10px;
    border-radius: 4px; /* 圆角边框 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
    padding: 2px 5px;
    font-size: 0.8vw;
}
.body1 .nonePayList li .orderList{
    margin-top: 1vw;
}
.body1 .nonePayList li .orderList li{
    font-size: 0.9vw;
    padding-bottom: 0.5vw;
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: #555555;
    padding-left: 20px;
}
.body1 .nonePayList li .orderList li .left{
    display: flex;
}
.body1 .nonePayList li .orderList li .left .leftText{
    padding-right: 2vw;
}
.body1 .nonePayList li .orderList li .right{
    display: flex;
    justify-content: flex-end;
}
.body2{
    margin-top: 6vw;
    margin-bottom: 3vw;
    margin-right: 80px;
}
.body2 .text1{
    font-size:1.2vw;
    color: #555555;
}
.body2 .alreadyPayList{
    margin-top: 0.5vw;
    width: 100%;
}
.body2 .alreadyPayList li .content{
    display: flex;
    font-size: 1vw;
    justify-content: space-between;
    padding-top: 0.5vw;
}
.body2 .alreadyPayList li .content .left{
    display: flex;
    color: #555555;
    align-items: center;
}
.body2 .alreadyPayList li .content .right{
    display: flex;
    justify-content:flex-end;
    align-items: center;
    color: #555555;
}
.body2 .alreadyPayList li .orderList{
    margin-top: 1vw;
}
.body2 .alreadyPayList li .orderList li{
    font-size: 0.9vw;
    padding-bottom: 0.5vw;
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: #555555;
    padding-left: 20px;
}
.body2 .alreadyPayList li .orderList li .left{
    display: flex;
}
.body2 .alreadyPayList li .orderList li .left .leftText{
    padding-right: 2vw;
}
.body2 .alreadyPayList li .orderList li .right{
    display: flex;
    justify-content: flex-end;
}
.deliveryPrice{
    display: flex;
    justify-content: space-between;
    font-size: 0.9vw;
    color: #555555;
    padding-left: 20px;
}
.deliveryPrice .right{
    display: flex;
    justify-content: flex-end;
}
</style>
