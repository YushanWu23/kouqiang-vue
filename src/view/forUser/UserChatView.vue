<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>在线咨询</h2>
                  <div v-if="currentConsultation" class="consultation-container">
                    <button @click="endConsultation">结束咨询</button>
                    <div class="chat-area">
                      <div v-for="(message, index) in messages"
                           :key="index"
                           :class="['message', message.sender === '用户' ? 'user' : 'doctor']">
                        <div class="message-content">
                          <div class="message-sender">{{ message.sender }}</div>
                          <div v-if="message.type === 'text'" class="message-text">{{ message.content }}</div>
                          <div v-else>
                            <a :href="getImageUrl(message.content)" target="_blank">
                              <img :src="getImageUrl(message.content)" class="message-image" alt="图片"/>
                            </a>
                          </div>
                          <div class="message-time">{{ formatTime(message.sendTime) }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="input-area">
                      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="输入消息..."/>
                      <button @click="sendMessage">发送</button>
                      <!-- 图片上传组件 -->
                      <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="file-input"/>
                      <!-- 显示上传预览 -->
                      <div v-if="imageUrl" class="image-preview">
                        <div class="image-item">
                          <a :href="imageUrl" target="_blank">
                            <img :src="imageUrl" alt="Uploaded Image" class="preview-image" />
                          </a>
                          <button @click="removeFile">删除</button>
                        </div>
                      </div>
                      <button v-if="imageUrl" @click="sendImageMessage">发送图片</button>
                    </div>
                  </div>
                    <!-- 未开始咨询时的界面 -->
                    <div v-else class="start-consultation">
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
import {Stomp} from "@stomp/stompjs";
import router from "@/router";
const store = useStore();
const { user } = storeToRefs(store);
const doctors = ref([]);
const selectedDoctor = ref('');
const stompClient = ref(null);
const currentConsultation = ref(null);
const messages = ref([]);
const newMessage = ref('');
const fileInput = ref(null);
const imageUrl = ref(null);//只存储一个图片
const currentFile = ref(null);
function isUser() {
  if (user.value.userId ===''){
    alert("先登陆")
    router.push({
      path:"/login"
    })
  }
}
// 初始化 WebSocket 连接
onMounted(() => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    alert('请先登录');
    router.push('/login');
    return;
  }

  const socket = new SockJS(`http://localhost:8082/kouqiang-user/ws/consultation?token=${token}`);
  stompClient.value = Stomp.over(socket);

  stompClient.value.connect({}, () => {
    console.log('WebSocket连接成功');

    // 订阅状态更新
    stompClient.value.subscribe(
        `/user/queue/consultation/status`,
        (message) => {
          console.log('收到状态更新消息:', message.body);
          currentConsultation.value = JSON.parse(message.body);
          if (currentConsultation.value) {
            fetchMessages(currentConsultation.value.consultationId);
          }
        }
    );

    // 订阅消息
    stompClient.value.subscribe(
        `/user/queue/consultation/messages`,
        (message) => {
          console.log('收到消息:', message.body);
          const parsedMessage = JSON.parse(message.body);
          console.log('解析后的消息:', parsedMessage);
          messages.value.push(parsedMessage);
          console.log('消息已添加到 messages 数组:', messages.value);
        }
    );
  }, (error) => {
    console.error('WebSocket连接失败:', error);
  });

  fetchOnlineDoctors();
});
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    currentFile.value = file;
    imageUrl.value = URL.createObjectURL(file); // 生成临时 URL
  }
}

/*function handleFileUpload(event) {
  const files = event.target.files;
  if (files && files.length > 0) {
    // 清空之前的预览
    imageUrls.value = [];
    // 将新选择的文件追加到现有列表中
    for (const file of files) {
      note.value.imageUrls.push(file);
    }
    previewImages(); // 预览图片
  }
}*/
/*function previewImages() {
  imageUrls.value = []; // 清空之前的预览
  Array.from(note.value.imageUrls).forEach(file => {
    const url = URL.createObjectURL(file); // 生成临时 URL
    imageUrls.value.push(url);
  });
}*/
function removeFile() {
  currentFile.value = null;
  imageUrl.value = null;
}
// 结束对话
const endConsultation = () => {
  stompClient.value.send(
      `/app/${currentConsultation.value.consultationId}/end`,
      {},
      JSON.stringify({})
  );
  currentConsultation.value = null;
  messages.value = [];
  router.push("/userInfo")
};
// 获取在线医生列表
const fetchOnlineDoctors = async () => {
  isUser();
    const response = await axiosInstance.get('/doctor/getOnlineDoc');
    doctors.value = response.data;
};

// 开始咨询
const startConsultation = async () => {
  if (!selectedDoctor.value) {
    alert("请选择医生");
    return;
  }
  console.log('尝试发起咨询，医生 ID:', selectedDoctor.value);
  try {
    // 使用HTTP创建咨询
    const response = await axiosInstance.post('/consultation/start', {
      doctorId: selectedDoctor.value
    });

    // 通过WebSocket通知医生
    stompClient.value.send(
        "/app/notify/newRequest",
        {},
        JSON.stringify(response.data)
    );

    currentConsultation.value = response.data;
  } catch (error) {
    console.error('发起咨询失败:', error);
    alert(`错误: ${error.response?.data?.message || error.message}`);
  }
};

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const message = {
    content: newMessage.value,
    type: 'text',
    sender: '用户'
  };
  /*messages.value.push({
    ...message,
    sendTime: new Date().toISOString()
  });*/
  console.log('准备发送消息:', message);
  // 统一使用 stompClient.value
  stompClient.value.send(
      `/app/${currentConsultation.value.consultationId}/message`,
      {},
      JSON.stringify(message)
  );
  console.log('消息已发送');
  newMessage.value = '';
};

// 文件上传
/*const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  const message = {
    content: response.data.filePath,
    type: 'image',
    sender: 'user'
  };

  stompClient.value.send(
      `/app/${currentConsultation.value.consultationId}/message`,
      {},
      JSON.stringify(message)
  );
};*/
// 发送图片消息
const sendImageMessage = async () => {
  if (!currentFile.value) return;

  const formData = new FormData();
  formData.append("file", currentFile.value);

  try {
    const response = await axiosInstance.post('/consultation/uploadImage', formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    const message = {
      content: response.data,
      type: 'image',
      sender: '用户'
    };
    stompClient.value.send(
        `/app/${currentConsultation.value.consultationId}/message`,
        {},
        JSON.stringify(message)
    );

    // 清空文件输入框和预览
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    currentFile.value = null;
    imageUrl.value = null;
  } catch (error) {
    console.error('图片上传失败:', error);
  }
};
// 获取图片 URL
const getImageUrl = (filePath) => {
    return `http://localhost:8082/kouqiang-user${filePath}`;
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

</script>
<style scoped>
.image-preview{
  display: flex;
}
.image-item{
  display: flex;
  width:110px;
  margin-right: 25px;
}
.image-item a{
  height: 73px;
}
.image-item button{
  padding-left: 5px;
}
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
    overflow: auto;
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
