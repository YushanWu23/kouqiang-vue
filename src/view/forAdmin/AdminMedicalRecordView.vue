<template>
    <AdminTopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>所有病历记录</h2>
                    <div class="filter-section">
                        <el-input
                            v-model="searchKeyword"
                            placeholder="请输入患者、医生的姓名或ID进行搜索"
                            @input="searchMedicalRecords"
                            style="width: 300px; margin-right: 10px;"
                        />
                        <el-date-picker
                            v-model="selectedDate"
                            type="date"
                            placeholder="选择日期"
                            value-format="YYYY-MM-DD"
                            @change="searchMedicalRecords"
                        />
                    </div>

                    <ul class="medicalRecordList">
                        <li v-for="medicalRecord in searchingMedicalRecords" @click="viewMedicalRecordDetail(medicalRecord.medicalRecordId)">
                            <div class="text">
                                <strong>患者姓名：</strong>{{ medicalRecord.user?.userName || '--' }}
                                <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;患者ID：</strong>{{ medicalRecord.user?.userId || '--' }}<br>
                                <strong>主治医生：</strong>{{ medicalRecord.doctor?.doctorName || '--' }}
                                <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;医生ID：</strong>{{ medicalRecord.doctor?.doctorId || '--' }}<br>
                                <strong>就诊时间：</strong>{{ formatDateTime(medicalRecord.visitTime) }}<br>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { axiosInstance } from "@/main";
import AdminTopComponent from "@/components/basic/AdminTopComponent.vue";

const router = useRouter();
const medicalRecords = ref([]); // 存储所有病历数据
const searchKeyword = ref(""); // 搜索关键词
const selectedDate = ref(null); // 选择的日期
const searchingMedicalRecords = ref([]); // 存储搜索后的病历数据

// 加载所有病历记录
const fetchMedicalRecords = () => {
    axiosInstance.get('/medicalRecord/getAllMedicalRecord')
        .then(response => {
            medicalRecords.value = response.data;
            searchingMedicalRecords.value = medicalRecords.value; // 初始化时显示所有病历
        })
        .catch(error => {
            console.error('病历记录加载失败', error);
        });
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

// 搜索病历记录
const searchMedicalRecords = () => {
    if (searchKeyword.value.trim() === "" && !selectedDate.value) {
        searchingMedicalRecords.value = medicalRecords.value; // 如果搜索框和日期都为空，显示所有病历
    } else {
        const keyword = searchKeyword.value.toLowerCase(); // 转换为小写以便不区分大小写搜索
        const date = selectedDate.value ? selectedDate.value : null;
        searchingMedicalRecords.value = medicalRecords.value.filter(record => {
            const matchKeyword =
                (record.user?.userName?.toLowerCase().includes(keyword)) || // 根据患者名搜索
                (record.user?.userId?.toLowerCase().includes(keyword)) || // 根据患者ID搜索
                (record.doctor?.doctorId?.toLowerCase().includes(keyword)) || // 根据医生 ID 搜索
                (record.doctor?.doctorName?.toLowerCase().includes(keyword)); // 根据医生名搜索

            const visitDate = new Date(record.visitTime).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '-'); // 转换为 YYYY-MM-DD 格式

            const matchDate = date ? visitDate === date : true; // 根据日期搜索

            return matchKeyword && matchDate;
        });
    }
};

// 查看病历详情
const viewMedicalRecordDetail = (recordId) => {
    router.push({
        path: '/docMedicalRecordInfo',
        query: { recordId }
    });
};

// 在页面加载前获取数据
onBeforeMount(() => {
    fetchMedicalRecords();
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
    margin-left: 180px;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 370px;
    margin-top: 10px;
}

.medicalRecordList {
    margin-top: 20px;
    margin-bottom: 20px;
    overflow-y: auto;
}

.text {
    word-wrap: break-word;
    white-space: pre-line;
}

li {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px 20px;
    margin-bottom: 20px;
    width: 900px;
    font-size: 16px;
    cursor: pointer;
}

li:hover {
    background-color: #f5f5f5;
}

.filter-section {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.filter-section .el-input {
    margin-right: 10px;
}
</style>
