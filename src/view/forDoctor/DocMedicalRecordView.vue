<template>
    <DocTopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>患者病历记录</h2>
                    <div class="button1">
                        <el-button type="primary" @click="router.go(-1)">返回</el-button>
                    </div>
                    <div class="filter-section">
                        <el-date-picker
                                v-model="selectedDate"
                                type="date"
                                placeholder="选择日期"
                                value-format="YYYY-MM-DD"
                                @change="loadRecords"
                        />
                    </div>

                    <!-- 病历列表 -->
                    <div class="section">
                        <el-table :data="medicalRecords" style="width: 100%">
                            <el-table-column prop="visitTime" label="就诊时间" width="200">
                                <template #default="{row}">
                                    {{ formatDateTime(row.visitTime) }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="diagnosis" label="诊断结果" />
                            <el-table-column label="操作" width="120">
                                <template #default="{row}">
                                    <el-button
                                            type="text"
                                            @click="viewMedicalRecordDetail(row.medicalRecordId)"
                                    >
                                        查看详情
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
import { useRoute, useRouter } from "vue-router";
import {axiosInstance, useStore} from "@/main";
import { ElMessage } from "element-plus";
import DocTopComponent from "@/components/basic/DocTopComponent.vue";
import {storeToRefs} from "pinia";
const store = useStore();
const route = useRoute();
const router = useRouter();
const medicalRecords = ref([]);
const selectedDate = ref(null); // 新增：日期筛选
const { doctor } = storeToRefs(store);
function isDoctor(){
    if (!doctor.value.doctorId) {
        ElMessage.warning('请先登录');
        router.push('/docLogin');
    }
}
// 加载病历记录
const loadRecords = async () => {
    isDoctor();
    try {
        const res = await axiosInstance.get('/medicalRecord/searchMedicalRecords', {
            params: {
                doctorId: route.query.doctorId,
                userId: route.query.userId,
                date: selectedDate.value // 传递日期参数
            }
        });
        medicalRecords.value = res.data;
    } catch (error) {
        ElMessage.error('病历记录加载失败');
        console.error(error);
    }
};

// 时间格式化
const formatDateTime = (datetime) => {
    if (!datetime) return '--';
    return new Date(datetime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// 查看病历详情
const viewMedicalRecordDetail = (recordId) => {
    router.push({
        path: '/docMedicalRecordInfo',
        query: { recordId }
    });
};

// 初始化加载数据
onMounted(() => {
    loadRecords();
});
</script>

<style scoped>

.filter-section {
    margin-bottom: 20px;
}

.button1{
    width: 50px;
    margin-bottom: 10px;
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
</style>
