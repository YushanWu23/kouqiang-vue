<template>
    <DocTopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>咨询管理</h2>
                    <!-- 医生在线状态切换 -->
                    <div class="online-status">
                        <button @click="toggleOnlineStatus">
                            {{ doctor.onlineStatus ? '切换为离线' : '切换为在线' }}
                        </button>
                        <span>当前状态：{{ doctor.onlineStatus ? '在线' : '离线' }}</span>
                    </div>

                    <!-- 请求列表 -->
                    <div class="request-list">
                        <div v-for="request in consultationRequests"
                             :key="request.consultationId"
                             class="request-item"
                             @click="acceptConsultation(request.consultationId)">
                            <div>用户：{{ request.user.userId }}</div>
                            <div>时间：{{ formatTime(request.startTime) }}</div>
                        </div>
                    </div>

                    <!-- 当前咨询界面 -->
                    <div v-if="currentConsultation" class="consultation-container">
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
                        <div class="input-area">
                            <input v-model="newMessage"
                                   @keyup.enter="sendMessage"
                                   placeholder="输入消息..."/>
                            <button @click="sendMessage">发送</button>
                            <input type="file" @change="handleFileUpload" accept="image/*"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/main';
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { axiosInstance, connectWebSocket } from '@/main';
import DocTopComponent from "@/components/basic/DocTopComponent.vue";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
const store = useStore();
const stompClient = ref(null);
const consultationRequests = ref([]);
const currentConsultation = ref(null);
const messages = ref([]);
const newMessage = ref('');
const { doctor } = storeToRefs(store);
const router = useRouter();
function isDoctor() {
    if (doctor.value.doctorId ===''){
        alert("先登陆")
        router.push({
            path:"/docLogin"
        })
    }
}
onMounted(() => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    alert('请先登录');
    router.push('/docLogin');
    return;
  }

  const socket = new SockJS(`http://localhost:8082/kouqiang-user/ws/consultation?token=${token}`);
  stompClient.value = Stomp.over(socket);

  stompClient.value.connect({}, () => {
    console.log('WebSocket连接成功');

    // 订阅新请求
    stompClient.value.subscribe(
        `/user/queue/consultation/requests`,
        (message) => {
          consultationRequests.value = [
            ...consultationRequests.value,
            JSON.parse(message.body)
          ];
        }
    );

    // 订阅状态更新
    stompClient.value.subscribe(
        `/user/queue/consultation/status`,
        (message) => {
          const consultation = JSON.parse(message.body);
          currentConsultation.value = consultation;
          if (consultation.status === '已结束') {
            messages.value = [];
          }
        }
    );

    // 订阅消息
    stompClient.value.subscribe(
        `/user/queue/consultation/messages`,
        (message) => {
          messages.value.push(JSON.parse(message.body));
        }
    );

    fetchConsultationRequests();
  }, (error) => {
    console.error('WebSocket连接失败:', error);
  });
});
// 获取咨询请求
const fetchConsultationRequests = async () => {
    isDoctor();
    const response = await axiosInstance.get('/consultation/requests');
    consultationRequests.value = response.data;
};

// 接受咨询
const acceptConsultation = (consultationId) => {
  stompClient.value.send(
      "/app/consultation/accept",
      {},
      JSON.stringify({ consultationId })
  );

  currentConsultation.value = consultationRequests.value.find(
      c => c.consultationId === consultationId
  );
  fetchMessages(consultationId);
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

    const response = await axiosInstance.post('/upload', formData,{
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded"
      }});
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

// 获取历史消息
const fetchMessages = async (consultationId) => {
    const response = await axiosInstance.get(`/consultation/messages/${consultationId}`);
    messages.value = response.data;
};

// 切换医生在线状态（新增）
const toggleOnlineStatus = async () => {
    const newStatus = !doctor.value.onlineStatus;
    const response = await axiosInstance.post('/doctor/updateOnlineStatus', {
        doctorId: doctor.value.doctorId,
        onlineStatus: newStatus
    },{
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded"
      }});
    if (response.data === 1) {
        doctor.value.onlineStatus = newStatus;
        alert(`状态已切换为：${newStatus ? '在线' : '离线'}`);
    }
};

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
.online-status {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.online-status button {
    padding: 8px 16px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.online-status span {
    font-size: 14px;
}
</style>
