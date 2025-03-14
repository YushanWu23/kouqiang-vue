<template>
    <TopComponent/>
    <SideBar/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>我的预约</h2>
                    <el-table v-if="!loading" :data="reservations" style="width: 95%" border>
                        <el-table-column prop="reservationId" label="预约ID" width="100"/>
                        <el-table-column prop="doctor.doctorName" label="医生名" width="120"/>
                        <el-table-column label="时间范围" width="400">
                            <template #default="{row}">
                                {{ formatDateTime(row.schedule?.startTime) }} - {{ formatDateTime(row.schedule?.endTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" >
                            <template #default="{row}">
                                <el-tag :type="getStatusType(row.status)">
                                    {{ getStatusText(row.status) }}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-else class="loading-indicator">加载中...</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElTag, ElButton } from 'element-plus';
import { useRouter } from "vue-router";
import { axiosInstance, useStore } from "@/main";
import { storeToRefs } from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";
import SideBar from "@/components/basic/SideBar.vue";

const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
const reservations = ref([]);
const loading = ref(false);//添加加载状态
function formatDateTime(datetime) {
    if (!datetime) return '无时间信息';
    return new Date(datetime).toLocaleString();
}

async function fetchReservations() {
    isUser();
    loading.value = true; // 开始加载
    try {
        const response = await axiosInstance.get('/reservation/getReservationByUserId', {
            params: {
                userId: user.value.userId
            }
        });
        // 过滤出状态为 "已预约" 和 "已完成" 的预约
        reservations.value = response.data.filter(reservation =>
            reservation.status === 1 || reservation.status === 2
        );
        console.log(response.data);
    } catch (error) {
        ElMessage.error('获取预约信息失败');
        console.error(error);
    }finally {
        loading.value = false; // 结束加载
    }
}

// 检查用户是否登录
function isUser() {
    if (user.value.userId === '') {
        alert("请先登录");
        router.push({
            path: "/login"
        });
    }
}
onMounted(() => {
    fetchReservations();
});
function getStatusText(status) {
    switch (status) {
        case 0:
            return '未预约';
        case 1:
            return '已预约';
        case 2:
            return '已完成';
        default:
            return '未知状态';
    }
}
function getStatusType(status) {
    switch (status) {
        case 1:
            return 'primary';
        case 2:
            return 'success';
        default:
            return 'info';
    }
}
</script>

<style scoped>
.background {
    background-color: #e9f2ff;
    height: 100%;
    width: 100%;
    z-index: -1;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 1100px;
    margin-left: 190px;
    height: 680px;
    margin-top: 80px;
}

.body {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-left: 200px;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 250px;
    margin-top: 10px;
}

.el-table {
    margin-top: 20px;
}
</style>
