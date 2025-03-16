<template>
    <div class="sidebar">
        <div class="side">
            <i class="fa-solid fa-user"></i>
            <div class="option" @click="goTo('info')">&nbsp;个人信息</div>
        </div>
        <div class="side">
            <i class="fa-solid fa-clipboard"></i>
            <div class="option" @click="goTo('reservations')">&nbsp;用户预约</div>
        </div>
        <div class="side">
            <i class="fa-solid fa-clipboard"></i>
            <div class="option" @click="goTo('medicalRecords')">&nbsp;用户病历</div>
        </div>
        <div class="side">
            <i class="fa-solid fa-cart-shopping"></i>
            <div class="option" @click="goTo('orders')">用户订单</div>
        </div>
        <div class="side">
            <i class="fa-solid fa-clipboard"></i>
            <div class="option" @click="goTo('records')">&nbsp;用户记录</div>
        </div>
        <div class="side">
            <i class="fa-solid fa-clipboard"></i>
            <div class="option" @click="goTo('bookmark')">&nbsp;科普收藏</div>
        </div>
        <div class="side">
            <i class="fa-solid fa-comment"></i>
            <div class="option" @click="goTo('feedback')">&nbsp;用户反馈</div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goTo(option) {
    switch (option) {
        case 'info':
            router.push({ path: '/userInfo' });
            break;
        case 'reservations':
            router.push({ path: '/userReservation' });
            break;
        case 'medicalRecords':
            router.push({ path: '/userMedicalRecords' });
            break;
        case 'orders':
            router.push({ path: '/myOrders' });
            break;
        case 'records':
            router.push({ path: '/note' });
            break;
        case 'bookmark':
            router.push({ path: '/bookmark' });
            break;
        case 'feedback':
            router.push({ path: '/feedback' });
            break;
        default:
            break;
    }
}
</script>

<style scoped>
.sidebar {
    width: 180px;
    padding: 20px;
    background-color: white;
    border-right: solid 1px #ccc;
    top: 100px;
    height: 85%;
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    left: 80px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    }
.side{
    border-bottom: solid 1px #ccc;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: #444444;
}
.option{
    margin-left: 6px;
}
.option:hover {
    background-color: #f0f0f0;
}
</style>
