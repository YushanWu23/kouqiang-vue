<template>
    <DocTopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>病历详情</h2>
                    <div class="button1">
                        <el-button type="primary" @click="router.go(-1)">返回</el-button>
                    </div>
                    <div class="detail-section">
                        <el-descriptions title="基本信息" border>
                            <el-descriptions-item label="患者账号">{{ record.user?.userId || '--' }}</el-descriptions-item>
                            <el-descriptions-item label="患者姓名">{{ record.user?.userName || '--' }}</el-descriptions-item>
                            <el-descriptions-item label="就诊时间">{{ formatDateTime(record.visitTime) }}</el-descriptions-item>
                            <el-descriptions-item label="主治医生">{{ record.doctor?.doctorName || '--' }}</el-descriptions-item>
                        </el-descriptions>
                    </div>
                    <div class="detail-section">
                        <h3>诊断结果</h3>
                        <el-input
                            v-model="record.diagnosis"
                            type="textarea"
                            :rows="4"
                            placeholder="暂无诊断结果"
                            readonly
                        />
                    </div>
                    <div class="detail-section">
                        <h3>治疗方案</h3>
                        <el-input
                            v-model="record.treatmentPlan"
                            type="textarea"
                            :rows="4"
                            placeholder="暂无治疗方案"
                            readonly
                        />
                    </div>
                    <div class="detail-section" v-if="record.imageUrls?.length">
                        <h3>相关影像</h3>
                        <div class="image-preview">
                            <div v-for="(url, index) in record.imageUrls" :key="index" class="image-item">
                                <a :href="getImageUrl(url)" target="_blank">
                                    <img :src="getImageUrl(url)" alt="Uploaded Image" class="preview-image" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { axiosInstance, useStore } from "@/main";
import { ElMessage } from "element-plus";
import DocTopComponent from "@/components/basic/DocTopComponent.vue";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();
const record = ref({
    user: {},
    doctor: {},
    imageUrls: [] // 存储相关影像的 URL
});
const store = useStore();
const { doctor } = storeToRefs(store);



/*function goback() {
    router.push({
        path: '/docReservation',
    });
}*/

// 生成完整的图片 URL
function getImageUrl(imagePath) {
    return `http://localhost:8082/kouqiang-user${imagePath}`;
}

const loadRecordDetail = async () => {
    try {
        const res = await axiosInstance.get(`/medicalRecord/getMedicalRecordById`, {
            params: {
                medicalRecordId: route.query.recordId,
            }
        });
        record.value = res.data;

        // 如果后端返回的影像 URL 是字符串，需要转换为数组
        if (typeof record.value.imageUrls === 'string') {
            record.value.imageUrls = record.value.imageUrls.split(',');
        }
    } catch (error) {
        ElMessage.error('病历详情加载失败');
        console.error(error);
    }
};

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

onMounted(() => {
    loadRecordDetail();
});
</script>

<style scoped>
.button1 {
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
    overflow: auto;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 430px;
    margin-top: 10px;
}

.detail-section {
    margin-bottom: 10px;
}

.image-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-item {
    display: flex;
    width: 110px;
    margin-right: 25px;
}

.image-item a {
    height: 89px;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}
</style>
