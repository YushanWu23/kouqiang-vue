<script setup>
import BottomComponent from "@/components/basic/TopComponent.vue";
import {axiosInstance, useStore} from "@/main";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";

const router = useRouter()
const store = useStore()
const route = useRoute();
const { user } = storeToRefs(store)
const orderId = route.query.orderId;
const orders = ref('');
const showState = ref(false)
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
function fetchOrders1(){
    isUser();
    axiosInstance.get('/orders/getOrdersByOrdersId',{
        params:{
            orderId : orderId,
        }
    }).then(response => {
        orders.value = response.data;
    }).catch(error => {
        console.error(error);
    });
}

function pay(){
    axiosInstance.get('/orders/updateOrderState',{
        params:{
            orderId : orderId,
        }
    }).then(response => {
        orders.value = response.data;
        alert("支付成功")
        router.push('/myOrders')
    }).catch(error => {
        console.error(error);
    });

}
function showInfo(){
    showState.value = !showState.value;
}

onBeforeMount(fetchOrders1)
</script>
<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>确认订单</h2>
                    <div class="body1">
                        <div class="text1">
                            订单信息:
                        </div>
                        <div class="text2">
                            <div class="left" @click="showInfo">
                                {{orders.orderDate}}&nbsp;
                                <i class="fa-solid fa-caret-down"></i>
                            </div>
                            <div class="right">
                                ¥{{orders.orderTotal}}
                            </div>
                        </div>
                        <ul class="orderList" v-show="showState">
                            <li v-for="item in orders.orderDetailets">
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

                        <div class="pay">
                            <button @click="pay">确认支付</button>
                        </div>
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
    overflow: auto;/*当内容超出容器高度时，会自动显示滚动条。*/
}

.container {
    display: flex;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
    width: 1300px;
    margin-right: 20px;
    height:680px;
    margin-top: 80px;
}

.body {
    padding: 20px;
    flex-grow: 1; /* 使内容区域占据剩余空间 */
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-left: 100px;
    margin-right: 100px;
}
h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 450px;
    margin-top: 10px;
}
.wrapper .body1 .text1{
    font-size:1.4vw;
    color: #555555;
}
.wrapper .body1 .text2{
    display: flex;
    font-size: 1.2vw;
    justify-content: space-between;
    padding-top: 1vw;
    padding-bottom: 1vw;
}
.wrapper .body1 .text2 .left{
    display: flex;
    color: #555555;
    align-items: center;
}
.wrapper .body1 .text2 .right{
    color: red;
    display: flex;
    justify-content:flex-end;
}
.wrapper .body1 .orderList li{
    padding-left: 1vw;
    font-size: 1vw;
    padding-bottom: 1vw;
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: #555555;
}
.wrapper .body1 .orderList li .left{
    display: flex;
}
.wrapper .body1 .orderList li .left .leftText{
    padding-right: 2vw;
}
.wrapper .body1 .orderList li .right{
    display: flex;
    justify-content: flex-end;
}
.wrapper .body1 .orderList .deliveryPrice{
    display: flex;
    justify-content: space-between;
    font-size: 1vw;
    color: #555555;
    padding-left: 1vw;
}
.wrapper .body1 .orderList .deliveryPrice .right{
    display: flex;
    justify-content: flex-end;
}
.wrapper .body1 .payMethod{
    width: 100%;
    display: flex;
    padding-left: 200px;
}
.wrapper .body1 .payMethod img{
    height: 6vw;
    padding-top: 3vw;
    padding-left: 100px;
}

button {
    width: 520px;
    padding: 10px 30px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px; /* 按钮圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    font-size: 14px;
    margin-left: 250px;
    margin-top: 50px;
}

button:hover {
    background-color: #0056b3; /* 鼠标悬停时的背景颜色 */
}

</style>
