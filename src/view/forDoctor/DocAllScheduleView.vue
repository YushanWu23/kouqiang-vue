<template>
    <DocTopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>全部排班</h2>
                    <div class="button1">
                        <el-button @click="router.go(-1)">返回</el-button>
                    </div>
                    <el-table :data="allSchedules" style="width: 90%" border>
                        <el-table-column prop="scheduleId" label="ID" width="80"/>
                        <el-table-column prop="doctor.doctorName" label="医生名" width="120"/>
                        <el-table-column label="时间范围" width="400">
                            <template #default="{row}">
                                {{ formatDateTime(row.startTime) }} - {{ formatDateTime(row.endTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="maxReservations" label="最大预约数" width="120"/>
                        <el-table-column prop="currentReservations" label="当前预约数" width="120"/>
                        <el-table-column prop="status" label="状态">
                            <template #default="{row}">
                                {{ formatStatus(row.status) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {axiosInstance, useStore} from "@/main";
import DocTopComponent from "@/components/basic/DocTopComponent.vue";
import { ElMessage } from "element-plus";
import {storeToRefs} from "pinia";
const store = useStore();
const { doctor } = storeToRefs(store);
const router = useRouter();
const allSchedules = ref([]);

function formatDateTime(datetime) {
    return new Date(datetime).toLocaleString();
}

function formatStatus(status) {
    switch (status) {
        case 0:
            return "活跃";
        case 1:
            return "已满";
        case 2:
            return "结束";
        default:
            return "未知";
    }
}
function isDoctor() {
    if (doctor.value.doctorId ===''){
        alert("先登陆")
        router.push({
            path:"/docLogin"
        })
    }
}

async function fetchAllSchedules() {
    isDoctor();
    try {
        const response = await axiosInstance.get('/schedule/getAllSchedules');
        allSchedules.value = response.data;
    } catch (error) {
        ElMessage.error('获取全部排班数据失败');
        console.error(error);
    }
}

onMounted(() => {
    fetchAllSchedules();
});
</script>
<style scoped>
.button1{
    margin-bottom: 5px;
}
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
    overflow: auto;
}

.container {
    display: flex;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 1300px;
    margin-right: 20px;
    height: 680px;
    margin-top: 80px;
    overflow: auto;
}

.body {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-left: 130px;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 430px;
    margin-top: 10px;
}
.button-container {
    margin-bottom: 20px;
}

.el-table {
    margin-top: 20px;
}
</style>
