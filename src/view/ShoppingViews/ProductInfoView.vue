<script setup>
import {axiosInstance, useStore} from "@/main";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";
const store = useStore()
const { user } = storeToRefs(store);
const route = useRoute()
const router = useRouter();
const products = ref([]);
const carts = ref([]);
const totalPrice = computed(() =>{
    let total = 0.0;
    for (let item of products.value) {
        total += item.productPrice * item.quantity;
    }
    return parseFloat(total.toFixed(2)); // 保留两位小数
})
const totalQuantity = computed(() => {
    let quantity = 0;
    for (let item of products.value) {
        quantity += item.quantity;
    }
    return quantity;
});
const totalSettle = computed(() => {
    return totalPrice.value + 3;
});
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}

// 在页面加载时获取原先的信息
onMounted(() => {
    fetchProduct();
});
function getCart(){
    axiosInstance.post('/cart/getCartAll',{
        userId: user.value.userId,
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(response =>{
        console.log(response.data);
        carts.value .push(...response.data);
        carts.value.forEach(cart => {
            products.value.forEach(product => {
                if (cart.product.productId === product.productId){
                    product.quantity = cart.quantity
                }
            })
        })
        /*products.value.sort(function (product1,product2) {
            return product2.quantity - product1.quantity
        })*/
        console.log(carts)
    }).catch(error =>{
        console.error(error)
    });
}
function fetchProduct(){
    isUser();
    axiosInstance.get('/product/getAll',).then(response =>{
        console.log(response.data)
        products.value.push(...response.data)
        products.value.forEach(product => {
            product.quantity = 0;
        })
        console.log(products);
        getCart();
    }).catch(error =>{
        console.error(error)
    });

}

function minus(product){
    updateCart(product,-1)
    if (product.quantity ===1) {
        deleteCart(product);
    }
    /*product.quantity-=1;*/
}
function updateCart(product ,num){
    axiosInstance.post('/cart/updateCart',{
        userId: user.value.userId,
        productId : product.productId,
        quantity : product.quantity + num,
    },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        }
    }).then(response => {
        if (response.data === 1){
            product.quantity += num;
            /*products.value.sort(function (product1,product2) {
                return product2.quantity - product1.quantity
            })*/
        }else {
            alert('购物车食品数量修改失败！');
        }
    }).catch(error => {
        console.error(error);
    });
}
function deleteCart(product) {
    axiosInstance.post('cart/deleteCart',{
        userId : user.value.userId,
        productId : product.productId,
    },{
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(response => {
        if (response.data === 1){
            product.quantity = 0;
            /*products.value.sort(function (product1,product2) {
                return product2.quantity - product1.quantity
            })*/
        }else {
            alert('在购物车中移除食品失败！');
        }
    }).catch(error => {
        console.error(error);
    });
}
function add(product){
    if (product.quantity === 0) {
        saveCart(product);
    } else {
        updateCart(product, 1);
    }
}
function saveCart(product) {
    axiosInstance.post('cart/insertProductIntoCart',{
        userId : user.value.userId,
        productId : product.productId,
    },{
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(response => {
        if (response.data === 1){
            product.quantity = 1;
            /*products.value.sort(function (product1,product2) {
                return product2.quantity - product1.quantity
            })*/
        }else {
            alert('添加食品到购物车失败！');
        }
    }).catch(error => {
        console.error(error);
    });
}
function goOrder(){
    router.push({
        path : "/orders"
    })
}
</script>

<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>购物平台</h2>
<!--                    <div class="search">
                        <input type="text" v-model="searchKeyword" placeholder="输入关键词搜索" @input="searchProducts" />
                    </div>-->
                    <ul class="productList">
                        <li v-for="product in products" :key="product.productId">
                            <img :src="product.productImg">
                            <div class="explain">
                                <div class="text1">
                                    {{product.productName}}
                                </div>
                                <div class="text2">
                                    ¥{{product.productPrice}}
                                </div>
                                <div class="order">
                                    <div class="minusButton">
                                        <i class="fa-solid fa-circle-minus" @click="minus(product)" v-show="product.quantity!==0"></i>
                                    </div>
                                    <div class="quantity">
                                        <span v-show="product.quantity!==0">{{product.quantity}}</span>
                                    </div>
                                    <div class="plusButton">
                                        <i class="fa fa-plus-circle" @click="add(product)"></i>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="cart">
                        <div class="price">
                            <div class="cartPhoto" :style="totalQuantity===0?'background-color:#505051;':'background-color:#3190E8;'">
                                <i class="fa-solid fa-cart-shopping"></i>
                                <div class="cartPhotoQuantity" v-show="totalQuantity!==0">
                                    {{totalQuantity}}
                                </div>
                            </div>
                            <div class="cartPrice">
                                <div class="totalPrice">
                                    ¥{{totalPrice}}
                                </div>
                                <div class="deliveryPrice">
                                    另需配送费3元
                                </div>
                            </div>
                        </div>
                        <div class="payment">
                            <div class="item" v-show="totalSettle===3"
                                 style="background-color: #535356;cursor: default;">
                                未选择商品
                            </div>
                            <div class="item" @click="goOrder" v-show="totalSettle>3">
                                去结算
                            </div>
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
}
h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 450px;
    margin-top: 10px;
}
.productList{
    margin-top: 5px;
    margin-bottom: 35px;
    display: flex;
    flex-wrap: wrap;
    gap: 40px; /* 设置商品之间的间隔 */
    overflow-y: auto;
}
.productList li{
    width: calc(50% - 50px); /* 每个商品占据一半宽度，减去间隔 */
    display: flex;
    align-items: center;

}
.productList li img{
    display: flex;
    align-items: center;
    width:160px;
    height:140px;
    margin-right: 10px;
}
.wrapper .productList li .explain{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.wrapper .productList li .explain .text1{
    font-size: 16px;
    font-weight: 550;
    color: #555555;
    margin-top: 8px;
}
.wrapper .productList li .explain .text2{
    font-size:16px;
    margin-top: 10px;
    color: red;
    margin-left: 0.5vw;
}
.wrapper .productList li .order{
    margin-left: 15vw;
    flex:1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.wrapper .productList li .order .minusButton{
    font-size: 1.7vw;
    color: #999999;
    cursor: pointer;
}
.wrapper .productList li .order .quantity {
    font-size: 1.5vw;
    color: #333333;
    margin-left: 5px;
    margin-right: 5px;
}
.wrapper .productList li .order .plusButton {
    font-size: 1.7vw;
    color: #0097EF;
    cursor: pointer;
}
.wrapper .cart {
    width: 86.2%;
    height: 4vw;
    position: fixed;
    left: 93px;
    bottom: 28px;
    display: flex;
    z-index: 1000;
}
.wrapper .cart .price {
    flex: 2;
    background-color: #505051;
    display: flex;
}
.wrapper .cart .price .cartPhoto {
    width: 6vw;
    height: 6vw;
    box-sizing: border-box;
    border: solid 0.7vw #444;
    border-radius: 8vw;
    background-color: #3190E8;
    font-size: 2.5vw;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -3vw;
    margin-left: 3vw;
    position: relative;
}
.wrapper .cart .price .cartPhoto .cartPhotoQuantity {
    width: 2vw;
    height: 2vw;
    border-radius: 2.5vw;
    background-color: red;
    color: #fff;
    font-size: 1.5vw;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: -0.7vw;
    top: -0.7vw;
}
.wrapper .cart .price .cartPrice .totalPrice {
    font-size: 1.5vw;
    color: #fff;
    margin-top: 0.2vw;
    margin-left: 0.5vw;
}
.wrapper .cart .price .cartPrice .deliveryPrice {
    font-size: 0.8vw;
    color: #AAA;

}
.wrapper .cart .payment {
    flex: 1;
}
.wrapper .cart .payment .item {
    width: 100%;
    height: 100%;
    background-color: #38CA73;
    color: #fff;
    font-size: 2vw;
    font-weight: 550;
    user-select: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
