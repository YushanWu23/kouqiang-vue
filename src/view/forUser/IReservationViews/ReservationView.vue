<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>预约</h2>
                    <el-table :data="schedules" style="width: 100%" border>
                        <el-table-column prop="scheduleId" label="ID" width="60"/>
                        <el-table-column prop="doctor.doctorName" label="医生名" width="80"/>
                        <el-table-column prop="doctor.specialty" label="领域" width="80"/>
                        <el-table-column prop="doctor.title" label="职称" width="100"/>
                        <el-table-column label="时间范围">
                            <template #default="{row}">
                                {{ formatDateTime(row.startTime) }} - {{ formatDateTime(row.endTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="maxReservations" label="最大预约数" width="110"/>
                        <el-table-column prop="currentReservations" label="当前预约数" width="110"/>
                        <el-table-column label="排班状态" width="120">
                            <template #default="{row}">
                                <el-tag :type="{
                                     '活跃': 'primary',
                                     '已满': 'warning',
                                     '结束': 'success',
                                     '未知状态': 'danger'
                                }[row.statusDisplay]">
                                    {{ row.statusDisplay }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="预约状态" width="120">
                            <template #default="{row}">
                                <el-tag :type="{
                                    '未预约': 'info',
                                    '已预约': 'success',
                                     '已完成': 'success',
                                     '未知状态': 'danger'
                                }[row.reservationStatus]">
                                    {{ row.reservationStatus }}
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
const reservations = ref([]);
function formatDateTime(datetime) {
    return new Date(datetime).toLocaleString();
}
function fetchReservations(){
    axiosInstance.get('/reservation/getReservationByUserId',{
        params:{
            userId : user.value.userId,
        }
    }).then(response => {
        console.log(response.data);
        reservations.value=response.data;
    }).catch(error =>{
        console.error(error)
    });
}
async function fetchSchedules() {
    isUser();
    try {
        const response = await axiosInstance.get('/schedule/getAllSchedules');
        const allReservationsResponse = await axiosInstance.get('/reservation/getReservationByUserId', {
            params: {
                userId: user.value.userId
            }
        });

        console.log("All Reservations:", allReservationsResponse.data); // 打印后端返回的预约数据

        // 确保返回的是数组，即使为空
        //const allReservations = Array.isArray(allReservationsResponse.data) ? allReservationsResponse.data : [];

        schedules.value = await Promise.all(response.data
            .filter(schedule => schedule.status !== 2) // 状态为2的排班表示已结束，不显示
            .map(async schedule => {
                // 转换排班状态
                switch (schedule.status) {
                    case 0:
                        schedule.statusDisplay = '活跃';
                        break;
                    case 1:
                        schedule.statusDisplay = '已满';
                        break;
                    case 2:
                        schedule.statusDisplay = '结束';
                        break;
                    default:
                        schedule.statusDisplay = '未知状态';
                }

                // 检查当前用户是否已预约该排班
                //const reservation = allReservations.find(res => res.schedule?.scheduleId === schedule.scheduleId);
                const ReservationResponse = await axiosInstance.get('/reservation/getReservationByUserIdAndScheduleId', {
                    params: {
                        userId: user.value.userId,
                        scheduleId: schedule.scheduleId,
                    }
                });
                const reservation = ReservationResponse.data || {};                // 转换预约状态
                if (reservation.status !== undefined) {
                    switch (reservation.status) {
                        case 0:
                            schedule.reservationStatus = '未预约';
                            break;
                        case 1:
                            schedule.reservationStatus = '已预约';
                            break;
                        case 2:
                            schedule.reservationStatus = '已完成';
                            break;
                        default:
                            schedule.reservationStatus = '未知状态';
                    }
                } else {
                    schedule.reservationStatus = '未预约';
                }

                return schedule;
            }));

        console.log(response.data);
    } catch (error) {
        ElMessage.error('获取排班数据失败');
        console.error(error);
    }
}

function isUser() {
    if (user.value.userId === '') {
        alert("请先登录");
        router.push({
            path: "/login"
        });
    }
}

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
            await fetchSchedules(); // 刷新排班列表
        } else {
            ElMessage.error('预约失败');
        }
    } catch (error) {
        ElMessage.error('预约失败: ' + (error.response?.data || '未知错误'));
    }
}

async function handleCancelReservation(scheduleId) {
    try {
        const Reservation = await axiosInstance.get('/reservation/getReservationByUserIdAndScheduleId', {
            params: {
                userId: user.value.userId,
                scheduleId: scheduleId,
            }
        });
        const response = await axiosInstance.post('/reservation/deleteReservation', {
            reservationId: Reservation.data.reservationId,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        if (response.data) {
            ElMessage.success('取消预约成功');
            await fetchSchedules(); // 刷新排班列表
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
