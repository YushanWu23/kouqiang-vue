<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>新增送货地址</h2>
                    <div class="info">
                        <div class="headsex">
                            <img src="../../../assets/img-new/用户无性别.png">
                        </div>
                        <div class="content">
                            <div class="name">
                                <div class="Text1">
                                    联系人：
                                </div>
                                <div class="Text2">
                                    <input type="text" v-model="deliveryAddress.contactName" placeholder="联系人姓名">
                                </div>
                            </div>
                            <div class="phone">
                                <div class="Text1">
                                    电&nbsp;&nbsp;&nbsp;话：
                                </div>
                                <div class="Text2">
                                    <input type="text" v-model="deliveryAddress.contactTel" placeholder="&nbsp;联系人电话">
                                </div>
                            </div>
                            <div class="sex">
                                <div class="Text1">
                                    性&nbsp;&nbsp;&nbsp;别：
                                </div>
                                <div class="Text2">
                                    <input type="radio" v-model="deliveryAddress.contactSex" value="1">男
                                    <input type="radio" v-model="deliveryAddress.contactSex" value="0">女
                                </div>
                            </div>
                            <div class="address">
                                <div class="Text1">
                                    收货地址：
                                </div>
                                <div class="Text2">
                                    <input type="text" v-model="deliveryAddress.address" placeholder="收货地址">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="save">
                        <button @click="saveDeliveryAddress">保存</button>
                    </div>
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
const store = useStore()
const { user } = storeToRefs(store);
const router = useRouter()
const route = useRoute()
const deliveryAddress = ref({
    contactName : '',
    contactSex : 1,
    contactTel : '',
    address : '',
})
const businessId = route.query.businessId;
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}

function saveDeliveryAddress() {
    isUser()
    if (!deliveryAddress.value.contactName) {
        alert('联系人姓名不能为空！');
        return;
    }
    if (!deliveryAddress.value.contactTel) {
        alert('电话不能为空！');
        return;
    }
    if (!deliveryAddress.value.address) {
        alert('收货地址不能为空！');
        return;
    }
    axiosInstance.post('/deliveryAddress/saveDeliveryAddress',{
        contactName : deliveryAddress.value.contactName,
        contactSex: deliveryAddress.value.contactSex,
        contactTel :deliveryAddress.value.contactTel,
        address : deliveryAddress.value.address,
        userId : user.value.userId,
    },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        }
    }).then((response)=>{
        if (!response.data){
            alert('保存失败，请重试！');
            return;
        }
        alert('保存成功！');
        router.push({
            path:'/userAddress',
            query:{
                businessId : businessId,
            }
        })
    }).catch(error=>{
        console.error(error);
    });
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
    margin-left: 410px;
    margin-top: 10px;
}
.name,.phone,.address,.sex{
    display: flex;
    justify-content: flex-start; /* 水平排列靠左对齐 */
    align-items: center;
    margin-top: 1vw;
    margin-left: 50px;
}
.Text1{
    font-size:1.4vw;
    color: #444444;
    display: flex;
    align-items: center;/* 竖直居中 */
    margin-left: 3vw;
}
.Text2{
    font-size:1.2vw;
    display: flex;
    align-items: center;/* 竖直居中 */
    margin-left: 10px;
}

/*.wrapper .sex{
    display: flex;
    justify-content: flex-start; !* 水平排列靠左对齐 *!
    align-items: center;
}
.wrapper .sex .Text1{
    font-size:2vw;
    font-weight: 550;
    color: #666666;
    display: flex;
    align-items: center;
    margin-left: 3vw;
}
.wrapper .sex .Text2{
    font-size:1.8vw;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin-left: 8vw;
}*/
.wrapper .sex .Text2 input[type="radio"] {
    margin-right:0.5vw; /* 添加右边距为2vw */
    margin-left: 0.5vw;
}
.save{
margin-top: 50px;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    margin-left: 80px;
}
.save button {
    width: 80%;
    padding: 10px;
    margin-top: 2px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px;
    cursor: pointer; /* 鼠标悬停时显示手型 */
}
.info{
    display: flex;
}
.headsex{
    margin-top: 10px;
    height: 150px;
    width: 150px;
    margin-left: 250px;
}
</style>
