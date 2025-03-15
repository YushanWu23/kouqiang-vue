<template>
    <DocTopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>接诊</h2>
                    <div class="button1">
                        <el-button @click="router.go(-1)">返回</el-button>
                    </div>
                    <div class="detail-section">
                        <el-descriptions title="患者信息" border>
                            <el-descriptions-item label="患者账号">{{ userId }}</el-descriptions-item>
                            <el-descriptions-item label="患者姓名">{{ userName }}</el-descriptions-item>
                        </el-descriptions>
                    </div>
                    <div class="detail-section">
                        <h3>诊断结果</h3>
                        <el-input
                            v-model="diagnosis"
                            type="textarea"
                            :rows="4"
                            placeholder="请输入诊断结果"
                        />
                    </div>

                    <div class="detail-section">
                        <h3>治疗方案</h3>
                        <el-input
                            v-model="treatmentPlan"
                            type="textarea"
                            :rows="4"
                            placeholder="请输入治疗方案"
                        />
                    </div>
                    <div class="detail-section">
                        <h3>相关影像</h3>
                        <input
                            type="file"
                            ref="fileInput"
                            multiple
                            @change="handleFileUpload"
                            accept="image/*"
                            class="file-input"
                        />
                        <div v-if="imageUrls.length > 0" class="image-preview">
                            <div v-for="(url, index) in imageUrls" :key="index" class="image-item">
                                <a :href="url" target="_blank">
                                    <img :src="url" alt="Uploaded Image" class="preview-image" />
                                </a>
                                <button @click="removeFile(index)">删除</button>
                            </div>
                        </div>
                    </div>
                    <div class="button2">
                        <el-button type="primary" @click="submitMedicalRecord">提交病历</el-button>
                        <el-button @click="saveDraft">保存草稿</el-button>
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
const { doctor } = storeToRefs(store);
const route = useRoute();
const router = useRouter();

const userId = ref(route.query.userId || "--");
const userName = ref(route.query.userName || "--");
const diagnosis = ref("");
const treatmentPlan = ref("");
const fileInput = ref(null);
const imageUrls = ref([]);
const files = ref([]);
// 诊断模板
const diagnosisTemplates = ref([
    { label: "感冒", value: "患者主诉鼻塞、流涕，诊断为普通感冒。" },
    { label: "胃炎", value: "患者主诉上腹疼痛，诊断为急性胃炎。" },
    { label: "高血压", value: "患者血压偏高，诊断为原发性高血压。" }
]);
const selectedDiagnosisTemplate = ref("");

// 治疗模板
const treatmentTemplates = ref([
    { label: "感冒治疗", value: "建议多休息，服用感冒药，多喝水。" },
    { label: "胃炎治疗", value: "建议服用胃药，避免辛辣食物。" },
    { label: "高血压治疗", value: "建议低盐饮食，定期监测血压。" }
]);
const selectedTreatmentTemplate = ref("");

// 应用诊断模板
const applyDiagnosisTemplate = (value) => {
    diagnosis.value = value;
};

// 应用治疗模板
const applyTreatmentTemplate = (value) => {
    treatmentPlan.value = value;
};

// 提交病历
const submitMedicalRecord = async () => {
    if (!diagnosis.value || !treatmentPlan.value) {
        ElMessage.warning("请填写诊断结果和治疗方案");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("doctorId", route.query.doctorId);
        formData.append("userId", userId.value);
        formData.append("diagnosis", diagnosis.value);
        formData.append("treatmentPlan", treatmentPlan.value);
        files.value.forEach(file => {
            formData.append("files", file);
        });
        // 打印 FormData 内容
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        const res = await axiosInstance.post("/medicalRecord/createMedicalRecord", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (res.data && res.data.medicalRecordId) {
            ElMessage.success("病历提交成功");
            await router.push({
                path: "/docMedicalRecordInfo",
                query: { recordId: res.data.medicalRecordId }
            });
        } else {
            ElMessage.error("病历提交失败：未返回病历ID");
        }
    } catch (error) {
        ElMessage.error("病历提交失败");
        console.error(error);
    }
};

// 保存草稿
const saveDraft = () => {
    const draft = {
        diagnosis: diagnosis.value,
        treatmentPlan: treatmentPlan.value,
        imageUrls: imageUrls.value
    };
    localStorage.setItem("medicalRecordDraft", JSON.stringify(draft));
    ElMessage.success("草稿已保存");
};

// 加载草稿
const loadDraft = () => {
    const draft = localStorage.getItem("medicalRecordDraft");
    if (draft) {
        const { diagnosis: draftDiagnosis, treatmentPlan: draftTreatmentPlan, imageUrls: draftImageUrls } = JSON.parse(draft);
        diagnosis.value = draftDiagnosis;
        treatmentPlan.value = draftTreatmentPlan;
        imageUrls.value = draftImageUrls || [];
    }
};

// 文件上传前的校验
const beforeUpload = (file) => {
    const isAllowedType = ["image/jpeg", "image/png", "image/gif"].includes(file.type);
    const isWithinSize = file.size / 1024 / 1024 < 10; // 10MB

    if (!isAllowedType) {
        ElMessage.error("仅支持上传 JPG/PNG/GIF 格式的文件");
        return false;
    }
    if (!isWithinSize) {
        ElMessage.error("单个文件大小不能超过 10MB");
        return false;
    }
    return true;
};

// 文件超出限制时的提示
const handleExceed = () => {
    ElMessage.warning("最多上传 5 个文件");
};

// 文件上传成功
const handleUploadSuccess = (response, file) => {
    if (response && response.url) {
        file.url = response.url; // 假设后端返回文件URL
        ElMessage.success("文件上传成功");
    } else {
        ElMessage.error("文件上传失败");
    }
};
const handleFileUpload = (event) => {
    const newFiles = event.target.files;
    if (newFiles && newFiles.length > 0) {
        for (const file of newFiles) {
            files.value.push(file);
        }
        previewImages();
    }
};
const previewImages = () => {
    imageUrls.value = [];
    files.value.forEach(file => {
        const url = URL.createObjectURL(file);
        imageUrls.value.push(url);
    });
};
const removeFile = (index) => {
    files.value.splice(index, 1);
    previewImages();
};
// 加载患者信息
const loadUserInfo = async () => {
    try {
        const res = await axiosInstance.get(`/user/getUserInfo`, {
            params: { userId: userId.value }
        });
        if (res.data && res.data.userName) {
            userName.value = res.data.userName;
        } else {
            ElMessage.error("患者信息加载失败");
        }
    } catch (error) {
        ElMessage.error("患者信息加载失败");
        console.error(error);
    }
};
function isDoctor(){
    if (!doctor.value.doctorId) {
        ElMessage.warning('请先登录');
        router.push('/docLogin');
    }
}
// 初始化加载患者信息
onMounted(() => {
    isDoctor();
    if (!userId.value) {
        ElMessage.warning("患者信息缺失");
        router.push("/docReservation");
    } else {
        loadUserInfo(); // 加载患者信息
    }

    // 加载草稿
    loadDraft();
});
</script>
<style scoped>
.button1{
    margin-bottom: 5px;
}
.button2{
    padding-top: 5px;
}
.image-preview{
    display: flex;
}
.image-item{
    display: flex;
    width:110px;
    margin-right: 25px;
}
.image-item a{
    height: 89px;
}
.image-item button{
    padding-left: 5px;
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
    margin-left: 470px;
    margin-top: 10px;
}
h3 {
    margin-top: 10px;
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
    font-weight: 550;
}
.file-input {
    margin-bottom: 10px;
}
</style>
