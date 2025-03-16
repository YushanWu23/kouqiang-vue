<template>
    <TopComponent/>
    <SideBar/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>个人病历</h2>
                    <ul class="medicalRecordList">
                        <li v-for="medicalRecord in medicalRecords" @click="viewMedicalRecordDetail(medicalRecord.medicalRecordId)">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import {axiosInstance, useStore} from "@/main";
import { storeToRefs } from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";
import SideBar from "@/components/basic/SideBar.vue";
const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
const medicalRecords = ref([]);
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
function fetchMedicalRecords(){
    isUser();
    axiosInstance.get('/medicalRecord/getMedicalRecordByUserId',{
        params: {
            userId: user.value.userId
        }
    }).then(response => {
            medicalRecords.value = response.data;
        })
        .catch(error => {
            console.error('病历记录加载失败', error);
        });
}
onBeforeMount(()=>{
    fetchMedicalRecords();
});
function viewMedicalRecordDetail(recordId){
    router.push({
        path: '/docMedicalRecordInfo',
        query: { recordId }
    });
}
function formatDateTime(datetime){
    if (!datetime) return '--';
    return new Date(datetime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
</script>
<style scoped>
.background {
    background-color: #e9f2ff;
    height: 100%;
    width: 100%;
    z-index: -1; /* 确保背景图在最底层 */
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
    width: 1100px;
    margin-left: 190px;
    height:680px;
    margin-top: 80px;
}

.body {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-left: 70px;
    overflow: auto;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 380px;
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

.filter-section el-input {
    margin-right: 10px;
}
</style>
