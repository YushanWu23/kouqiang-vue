<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>预约</h2>
                    <el-table :data="schedules" style="width: 100%" border>
                        <el-table-column prop="scheduleId" label="ID" width="60"/>
                        <el-table-column prop="doctor.doctorName" label="医生名" width="100"/>
                        <el-table-column label="时间范围">
                            <template #default="{row}">
                                {{ formatDateTime(row.startTime) }} - {{ formatDateTime(row.endTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="maxReservations" label="最大预约数" width="120"/>
                        <el-table-column prop="currentReservations" label="当前预约数" width="120"/>
                        <el-table-column prop="status" label="排班状态" width="120">
                            <template #default="{row}">
                                <el-tag :type="row.status === 'finished' ? 'success' : 'primary'">
                                    {{ row.status }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="reservationStatus" label="预约状态" width="120">
                            <template #default="{row}">
                                <el-tag :type="row.reservationStatus === '已预约' ? 'success' : 'info'">
                                    {{ row.reservationStatus || '未预约' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120">
                            <template #default="{row}">
                                <el-button
                                    v-if="row.reservationStatus === '未预约'"
                                    type="primary"
                                    size="small"
                                    @click="handleReserve(row.scheduleId, row.doctor.doctorId)"
                                >
                                    预约
                                </el-button>
                                <el-button
                                    v-else-if="row.reservationStatus === '已预约'"
                                    type="danger"
                                    size="small"
                                    @click="handleCancelReservation(row.scheduleId)"
                                >
                                    取消预约
                                </el-button>
                                <el-button
                                    v-else
                                    type="info"
                                    size="small"
                                    disabled
                                >
                                    {{ row.reservationStatus }}
                                </el-button>
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
import { ElMessage, ElTag, ElButton } from 'element-plus';
import { useRouter } from "vue-router";
import { axiosInstance, useStore } from "@/main";
import { storeToRefs } from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";

const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
const schedules = ref([]);

// 格式化时间
function formatDateTime(datetime) {
    return new Date(datetime).toLocaleString();
}

// 获取排班信息
async function fetchSchedules() {
    isUser();
    try {
        const response = await axiosInstance.get('/schedule/getAllSchedules');
        // 过滤掉已完成的排班，并为每个排班添加预约状态
        schedules.value = response.data
            .filter(schedule => schedule.status !== 'finished')
            .map(schedule => {
                // 检查当前用户是否已预约该排班
                const reservation = schedule.reservations?.find(res => res.user.userId === user.value.userId);
                schedule.reservationStatus = reservation ? reservation.status : '未预约';
                return schedule;
            });
    } catch (error) {
        ElMessage.error('获取排班数据失败');
        console.error(error);
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

// 处理预约
async function handleReserve(scheduleId, doctorId) {
    try {
        const response = await axiosInstance.post('/reservation/createReservation', {
            scheduleId: scheduleId,
            userId: user.value.userId,
            doctorId: doctorId,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        if (response.data) {
            ElMessage.success('预约成功');
            await router.push({
                path: "/reservation"
            })

        } else {
            ElMessage.error('预约失败');
        }
    } catch (error) {
        ElMessage.error('预约失败: ' + (error.response?.data || '未知错误'));
    }
}

// 处理取消预约
async function handleCancelReservation(scheduleId) {
    try {
        const response = await axiosInstance.post('/reservation/deleteReservation', {
            scheduleId: scheduleId,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        if (response.data) {
            ElMessage.success('取消预约成功');
            await router.push({
                path: "/reservation"
            })
        } else {
            ElMessage.error('取消预约失败');
        }
    } catch (error) {
        ElMessage.error('取消预约失败: ' + (error.response?.data || '未知错误'));
    }
}

onMounted(() => {
    fetchSchedules();
});
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
    margin-left: 470px;
    margin-top: 10px;
}

.el-table {
    margin-top: 20px;
}
</style>
