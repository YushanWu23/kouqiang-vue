<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>在线咨询</h2>
                    <div v-if="currentConsultation" class="consultation-container">
                        <!-- 聊天区域 -->
                        <div class="chat-area">
                            <div v-for="(message, index) in messages"
                                 :key="index"
                                 :class="['message', message.sender === '用户' ? 'user' : 'doctor']">
                                <div class="message-content">
                                    <div class="message-sender">{{ message.sender }}</div>
                                    <div v-if="message.type === 'text'" class="message-text">{{ message.content }}</div>
                                    <img v-else :src="getImageUrl(message.content)" class="message-image" alt="图片"/>
                                    <div class="message-time">{{ formatTime(message.sendTime) }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 输入区域 -->
                        <div class="input-area">
                            <input v-model="newMessage"
                                   @keyup.enter="sendMessage"
                                   placeholder="输入消息..."/>
                            <button @click="sendMessage">发送</button>
                            <input type="file" @change="handleFileUpload" accept="image/*"/>
                        </div>
                    </div>

                    <!-- 未开始咨询时的界面 -->
                    <div v-if="!currentConsultation" class="start-consultation">
                        <select v-model="selectedDoctor">
                            <option v-for="doctor in doctors"
                                    :value="doctor.doctorId"
                                    :key="doctor.doctorId">
                                {{ doctor.doctorName }} - {{ doctor.specialty }}
                            </option>
                        </select>
                        <button @click="startConsultation">开始咨询</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/main';
import { storeToRefs } from "pinia";
import { axiosInstance, connectWebSocket } from '@/main';
import TopComponent from "@/components/basic/TopComponent.vue";
import SockJS from 'sockjs-client';
const store = useStore();
const { user } = storeToRefs(store);
const doctors = ref([]);
const selectedDoctor = ref('');
const stompClient = ref(null);
const currentConsultation = ref(null);
const messages = ref([]);
const newMessage = ref('');

// 获取在线医生列表（修改）
const fetchOnlineDoctors = async () => {
    const response = await axiosInstance.get('/doctor/getOnlineDoc');
    doctors.value = response.data;
};

// 开始咨询
const startConsultation = async () => {
    const response = await axiosInstance.post('/consultation/start', {
        doctorId: selectedDoctor.value
    });
    if (response.data) {
        currentConsultation.value = response.data;
        await fetchMessages(currentConsultation.value.consultationId);
        connectWebSocket();
    }
};

// 发送消息
const sendMessage = async () => {
    if (!newMessage.value.trim()) return;

    const message = {
        content: newMessage.value,
        type: 'text'
    };

    stompClient.value.publish({
        destination: `/app/consultation/${currentConsultation.value.consultationId}/message`,
        body: JSON.stringify(message)
    });

    newMessage.value = '';
};

// 文件上传
const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/upload', formData);
    const message = {
        content: response.data.filePath,
        type: 'image'
    };

    stompClient.value.publish({
        destination: `/app/consultation/${currentConsultation.value.consultationId}/message`,
        body: JSON.stringify(message)
    });
};

// 获取图片 URL
const getImageUrl = (filePath) => {
    return `http://localhost:8082/kouqiang-user/uploads/${filePath}`;
};

// 格式化时间
const formatTime = (time) => {
    return new Date(time).toLocaleTimeString();
};

// 获取历史消息（新增）
const fetchMessages = async (consultationId) => {
    const response = await axiosInstance.get(`/consultation/messages/${consultationId}`);
    messages.value = response.data;
};

onMounted(() => {
    fetchOnlineDoctors(); // 修改为获取在线医生
    connectWebSocket((message) => {
        messages.value.push(JSON.parse(message));
    });
});
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
    overflow: auto;/*当内容超出容器高度时，会自动显示滚动条。*/
}

.container {
    display: flex;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
    width: 1300px;
    margin-right: 20px;
    height:680px;
    margin-top: 80px;
}

.body {
    padding: 20px;
    flex-grow: 1; /* 使内容区域占据剩余空间 */
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-left: 80px;
    overflow: auto;
    margin-right: 50px;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 470px;
    margin-top: 10px;
}
.consultation-container {
    display: flex;
    flex-direction: column;
    height: 600px;
    width: 100%;
}

.chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
}

.message {
    margin: 10px 0;
    display: flex;
}

.message.user {
    justify-content: flex-end;
}

.message.doctor {
    justify-content: flex-start;
}

.message-content {
    max-width: 70%;
    padding: 10px;
    border-radius: 8px;
    background: #f0f0f0;
}

.message.user .message-content {
    background: #1890ff;
    color: white;
}

.message-sender {
    font-size: 0.8em;
    margin-bottom: 4px;
}

.message-time {
    font-size: 0.7em;
    text-align: right;
    color: #666;
}

.input-area {
    display: flex;
    gap: 10px;
}

input[type="text"] {
    flex: 1;
    padding: 8px;
}

button {
    padding: 8px 16px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.request-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.request-item {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}

.request-item:hover {
    background: #f5f5f5;
}

.message-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 4px;
}
</style>
