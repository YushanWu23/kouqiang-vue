<template>
    <DocTopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>患者管理</h2>
                    <div class="section">
                        <h3>当前排班患者</h3>
                        <el-table :data="currentReservations" style="width: 100%">
                            <el-table-column prop="user.userId" label="患者账号" width="180" />
                            <el-table-column prop="user.userName" label="患者姓名" width="120" />
                            <el-table-column label="排班时间" width="300">
                                <template #default="{row}">
                                    {{ formatTime(row.schedule.startTime) }}
                                    -
                                    {{ formatTime(row.schedule.endTime) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template #default="{row}">
                                    <el-button-group>
                                        <el-button
                                            type="primary"
                                            @click="viewUserMedicalRecords(row.user.userId)"
                                            size="small"
                                        >
                                            查看病历
                                        </el-button>
                                        <el-button
                                            type="success"
                                            @click="goToCreateMedicalRecord(row.user.userId)"
                                            v-if="isCurrentSchedule(row.schedule)"
                                            size="small"
                                        >
                                            接诊
                                        </el-button>
                                    </el-button-group>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="section">
                        <h3>历史就诊患者</h3>
                        <el-table :data="completedPatients" style="width: 100%">
                            <el-table-column prop="userId" label="患者账号" width="180" />
                            <el-table-column prop="userName" label="患者姓名" width="120" />
                            <el-table-column label="操作">
                                <template #default="{row}">
                                    <el-button
                                        type="primary"
                                        @click="viewUserMedicalRecords(row.userId)"
                                        size="small"
                                    >
                                        查看病历
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { axiosInstance, useStore } from "@/main";
import { storeToRefs } from "pinia";
import DocTopComponent from "@/components/basic/DocTopComponent.vue";
import { ElMessage } from "element-plus";

const router = useRouter();
const store = useStore();
const { doctor } = storeToRefs(store);
const currentReservations = ref([]);
const completedPatients = ref([]);

const initializeData = async () => {
    isDoctor();
    try {
        // 获取当前排班预约
        const currentRes = await axiosInstance.get('/reservation/getTodayReservation', {
            params: {
                doctorId: doctor.value.doctorId
            }
        });
        currentReservations.value = currentRes.data;
        // 获取已完成预约患者
        const completedRes = await axiosInstance.get('/reservation/getUserByDoctorIdAndReservationStatus', {
            params: {
                doctorId: doctor.value.doctorId,
                reservationStatus: 2
            }
        });
        completedPatients.value = completedRes.data;
    } catch (error) {
        ElMessage.error('数据加载失败');
        console.error(error);
    }
};

const formatTime = (datetime) => {
  return new Date(datetime).toLocaleString();
};

const isCurrentSchedule = (schedule) => {
    const now = new Date();
    const start = new Date(schedule.startTime);
    const end = new Date(schedule.endTime);
    return now >= start && now <= end;
};

const viewUserMedicalRecords = (userId) => {
    router.push({
        path: '/docMedicalRecord',
        query: {
            doctorId: doctor.value.doctorId,
            userId
        }
    });
};

const goToCreateMedicalRecord = (userId) => {
    router.push({
        path: '/docCreateMedicalRecord',
        query: {
            doctorId: doctor.value.doctorId,
            userId
        }
    });
};

function isDoctor(){
    if (!doctor.value.doctorId) {
        ElMessage.warning('请先登录');
        router.push('/docLogin');
    }
}

onMounted(() => {
    initializeData();
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
    margin-left: 430px;
    margin-top: 10px;
}

.section {
    margin-bottom: 40px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.el-button-group {
    display: flex;
    gap: 8px;
}
</style>
