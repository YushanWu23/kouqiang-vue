<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>模型问答</h2>
                    <div class="chat-container"><!-- 聊天历史 -->
                        <div v-for="(msg, index) in messages" :key="index" class="message"
                             :class="{ 'user-msg': msg.role === 'user', 'bot-msg': msg.role === 'bot' }">
                            <div class="message-content">
                                {{ msg.content }}
                            </div>
                        </div>
                    </div>
                    <div class="input-area"><!-- 输入 -->
                        <textarea
                                v-model="userInput"
                                placeholder="请输入您的法律问题..."
                                @keyup.enter.exact.prevent="sendMessage"
                        ></textarea>
                        <button @click="sendMessage">发送</button>
                    </div>
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
const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
const messages = ref([
    { role: 'bot', content: '您好！我是口腔健康咨询助手，请问有什么可以帮您？' }
]);
const userInput = ref('');
const isLoading = ref(false);

const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return;
    // 添加用户消息
    messages.value.push({
        role: 'user',
        content: userInput.value
    });
    // 添加加载状态
    const loadingMsgIndex = messages.value.push({
        role: 'bot',
        content: '思考中...',
        loading: true
    }) - 1;

    isLoading.value = true;
    const currentInput = userInput.value;
    userInput.value = '';

    try {
        const response = await axiosInstance.post('/callModel', {
            prompt: currentInput,
            max_length: 2048,  // 可调整为参数
            top_p: 0.7,
            temperature: 0.95
        });
        // 更新最后一条消息
        messages.value[loadingMsgIndex] = {
            role: 'bot',
            content: response.data.response.replace(/\\n/g, '\n')
        };
    } catch (error) {
        console.error('API Error:', error);
        messages.value[loadingMsgIndex] = {
            role: 'bot',
            content: '服务暂时不可用，请稍后再试。'
        };
    } finally {
        isLoading.value = false;
    }
};
onBeforeMount(()=>{
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
.chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 20px;
    background: #f9f9f9;
}

.message {
    margin: 10px 0;
    display: flex;
}

.message-content {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 15px;
    word-break: break-word;
}

.user-msg {
    justify-content: flex-end;
}

.user-msg .message-content {
    background: #1890ff;
    color: white;
}

.bot-msg {
    justify-content: flex-start;
}

.bot-msg .message-content {
    background: #f0f0f0;
    color: #333;
}

.input-area {
    display: flex;
    gap: 10px;
}

textarea {
    flex: 1;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    resize: none;
    height: 80px;
}

button {
    padding: 0 24px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background: #40a9ff;
}

/* 自动滚动到最新消息 */
.message:last-child {
    margin-bottom: 20px;
}
</style>
