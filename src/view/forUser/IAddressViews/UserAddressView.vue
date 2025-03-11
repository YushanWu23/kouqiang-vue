<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>地址管理</h2>
                    <div class="save">
                        <button @click="save">
                            新增收货地址
                        </button>
                    </div>
                    <ul class="address">
                        <li v-for="deliveryAddress in deliveryAddresses">
                            <div class="left" @click="getOrder(deliveryAddress.daId)">
                                <div class="leftRow">
                                    <div class="text1">
                                        {{deliveryAddress.contactName}}
                                    </div>
                                    <div class="text1">
                                        {{getContactSexText(deliveryAddress.contactSex)}}
                                    </div>
                                    <div class="text2">
                                        {{deliveryAddress.contactTel}}
                                    </div>
                                </div>
                                <div class="addressText">
                                    {{deliveryAddress.address}}
                                </div>
                            </div>
                            <div class="rightRow">
                                <div class="right">
                                    <i class="fa-solid fa-pen-to-square" @click="update(deliveryAddress.daId)"></i>
                                </div>
                                <div class="right1">
                                    <i class="fa-solid fa-xmark" @click="remove(deliveryAddress.daId)"></i>
                                </div>
                            </div>

                        </li>
                    </ul>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import BottomComponent from "@/components/basic/TopComponent.vue";
import {axiosInstance, useStore} from "@/main";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";
const router = useRouter()
const route =useRoute();
const store = useStore()
const { user ,defaultAddressInfo} = storeToRefs(store)
const deliveryAddresses = ref([]);
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
function fetchDeliveryAddress(){
    isUser();
    axiosInstance.get('/deliveryAddress/getDeliveryAddressByUserId',{
        params: {
            userId: user.value.userId
        }
    }).then(response => {
        console.log(response.data)
        deliveryAddresses.value.push(...response.data)
        console.log(deliveryAddresses)
    }).catch(error =>{
        console.error(error)
    });
}
onMounted(fetchDeliveryAddress);
function getOrder(daId){
    axiosInstance.get('/deliveryAddress/getDeliveryAddressByDaId',{
        params: {
            daId: daId,
        }
    }).then(response => {
        console.log(response.data)
        defaultAddressInfo.value = response.data;
        router.push({
            path:'/orders',
        });
    }).catch(error =>{
        console.error(error)
    });
}
function getContactSexText(contactSex){
    return contactSex === 1 ? '先生' : '女士';
}
function update(daId){
    router.push({
        path : "/editAddress",
        query :{
            daId : daId,
        }
    })
}
function remove(daId){
    axiosInstance.get('/deliveryAddress/removeDeliveryAddress',{
        params:{
            daId : daId,
            userId:user.value.userId,
        }
    }).then(() =>{
        deliveryAddresses.value = []
        fetchDeliveryAddress();
    }).catch(error =>{
        console.error(error)
    })
}
function save() {
    router.push({
        path : "/addAddress",
    })
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
.wrapper .address{
    margin-top: 20px;
    margin-bottom: 20px;
    overflow-y: auto;/*滑动*/
    margin-left: 50px;
}
.wrapper .address li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px 20px;
    margin-bottom: 20px;
    width:1000px;
    font-size: 20px;
}
.wrapper .address li .left{
    width: 80%;
}
.wrapper .address li .left .leftRow {
    display: flex;
    align-items: center;
}
.wrapper .address li .left .text1{
    font-size:1.4vw;
    color: #999999;
}
.wrapper .address li .left .text2{
    margin-left: 1vw;
    font-size:1.4vw;
    color: #999999;
}
.wrapper .address li .left .addressText{
    font-size: 1.2vw;
    color: #555555;
}
.wrapper .address li .rightRow {
    display: flex;
    align-items: center;
    width:20%;
    justify-content: flex-end;
}
.wrapper .address li .rightRow .right{
    align-items: center;
    display: flex;
    color: #999999;
}
.wrapper .address li .rightRow .right1{
    align-items: center;
    display: flex;
    margin-left: 3vw;
    color: #999999;
}
.wrapper .save{
    display: flex;
    margin-left: 50px;

}
button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px; /* 按钮圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    font-size: 14px;
}
</style>
