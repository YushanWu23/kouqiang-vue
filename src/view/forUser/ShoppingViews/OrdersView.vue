<script setup>
import {axiosInstance, useStore} from "@/main";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";
const router = useRouter()
const route = useRoute()
const store = useStore()
const { user,defaultAddressInfo } = storeToRefs(store)
const carts = ref([]);
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
function getImageUrl(productImg){
    console.log(productImg)
    return `http://localhost:8082/kouqiang-user${productImg}`;
}
function back(){
    router.push({
        path:'/productInfo',
    });
}
onMounted(() => {
        getCart();
});
function getCart(){
    isUser();
    axiosInstance.post('/cart/getCartAll',{
        userId: user.value.userId,
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(response =>{
        console.log(response.data);
        carts.value = response.data;
    }).catch(error =>{
        console.error(error)
    });
}
function getContactSexText(contactSex){
    if(contactSex === 1 ){
        return '先生';
    }else if(contactSex === 0 ){
        return '女士';
    }else {
        return '';
    }
}
function goUserAddress(){
    router.push({
        path:'/userAddress',
    });
}
function goPayment(){
    if(defaultAddressInfo.value.daId === -1||!defaultAddressInfo.value){
        alert('请选择送货地址！');
        return;
    }
    axiosInstance.post('/orders/createOrders',{
        userId:user.value.userId,
        daId:defaultAddressInfo.value.daId,
        orderTotal:totalPrice.value
    },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        }}).then(response=>{
            if(response.data!==0){
                router.push(
                    {path:'/payment',
                        query: {
                        orderId:response.data.orderId
                    }
                });
            }
        }).catch(error=>{
            console.error(error);
        });
}
const totalPrice = computed(() => {
    let total = 0;
    for (let cart of carts.value) {
        total += cart.product.productPrice * cart.quantity;
    }
    total += 3
    return total ;
});
</script>
<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>确认订单</h2>
                    <div class="back">
                        <button @click="back">返回</button>
                    </div>
                    <div class="noneDeliveryInfo" @click="goUserAddress" v-show="defaultAddressInfo.daId===-1">
                        请选择收货信息
                    </div>
                    <div class="deliveryInfo" @click="goUserAddress" v-show="defaultAddressInfo.daId!==-1">
                        <div class="text1">
                            收货地址：
                        </div>
                        <div class="text2">
                            <div class="left" >
                                {{defaultAddressInfo.address}}
                            </div>
                            <div class="right">
                                >
                            </div>
                        </div>
                        <div class="text3">
                            <div class="content">
                                {{defaultAddressInfo.contactName}}
                                {{getContactSexText(defaultAddressInfo.contactSex)}}
                            </div>
                            <div class="content">
                                {{defaultAddressInfo.contactTel}}
                            </div>
                        </div>
                    </div>
                    <ul class="orderList">
                        <li v-for="cart in carts">
                            <div class="left">
                                <img :src="getImageUrl(cart.product.productImg)" alt="cart Image">
                                <div class="leftText">
                                    {{cart.product.productName}}
                                </div>
                                <div class="leftText">
                                    x {{cart.quantity}}
                                </div>
                            </div>
                            <div class="right">
                                ¥{{cart.product.productPrice}}
                            </div>
                        </li>
                    </ul>
                    <div class="deliveryPrice">
                        配送费
                        <div class="right">
                            ¥3
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="left">
                            ¥{{totalPrice}}
                        </div>
                        <div class="right" @click="goPayment">
                            去支付
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
.back button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px; /* 按钮圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    font-size: 14px;
}
.wrapper .noneDeliveryInfo{
    width: 100%;
    height: 5vw;
    background-color: #AAAAAA;
    color: white;
    padding: 1vw 3vw;
    margin-top: 1vw;
    font-size: 2.5vw;
    font-weight: 550;
    display: flex;
    justify-content: center;
    align-items: center;
}
.wrapper .deliveryInfo{
    width: 100%;
    height: 5vw;
    background-color: #AAAAAA;
    color: white;
    padding: 5px 30px;
    margin-top: 1vw;
}
.wrapper .deliveryInfo .text1{
    font-size: 0.9vw;
}
.wrapper .deliveryInfo .text2{
    display: flex;
    justify-content: space-between;
    font-size: 1vw;
    padding-left: 20px;
}
.wrapper .deliveryInfo .text2 .left{
    font-weight: 550;
}
.wrapper .deliveryInfo .text2 .right{
    justify-content: flex-end;
}
.wrapper .deliveryInfo .text3{
    padding-left: 20px;
    display: flex;
    font-size: 0.9vw;
}
.wrapper .deliveryInfo .text3 .content{
    padding-right: 0.5vw;
}
.wrapper .orderList{
    margin-top: 0.5vw;
}
.wrapper .orderList li{
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding:1vw;
    height: 5vw;
}
.wrapper .orderList li .left{
    display: flex;
}
.wrapper .orderList li .left img{
    height: 3vw;
    display: flex;
    align-items: center;
}
.wrapper .orderList li .left .leftText{
    padding-left: 0.5vw;
    font-size: 1.1vw;
    color: #666666;
    display: flex;
    align-items: center;
}
.wrapper .orderList li .right{
    display: flex;
    justify-content: flex-end;
    font-size: 1.1vw;
    color: #666666;
    align-items: center;
}
.wrapper .deliveryPrice{
    display: flex;
    padding: 1vw;
    justify-content: space-between;
    font-size: 1.1vw;
    color: #666666;
}
.wrapper .deliveryPrice .right{
    display: flex;
    justify-content: flex-end;
}
.wrapper .bottom{
    width: 86.2%;
    height: 4vw;
    position: fixed;
    left: 93px;
    bottom: 28px;
    display: flex;
}
.wrapper .bottom .left{
    flex:2;
    color: white;
    font-size: 2vw;
    background-color: #444444;
    justify-content: center;
    align-items: center;
    display: flex;
}
.wrapper .bottom .right{
    flex:1;
    background-color: #38CA73;
    color: white;
    font-size: 2vw;
    justify-content: center;
    align-items: center;
    display: flex;
}
</style>
