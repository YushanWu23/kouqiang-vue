<template>
    <TopComponent/>
    <SideBar/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>我的反馈</h2>
                    <div class="content">
                        <!-- 图片上传组件 -->
                        <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="file-input"/>
                        <textarea
                            v-model="feedback.feedbackExplain"
                            placeholder="请输入反馈"
                            class="feedback-textarea"
                        ></textarea>
                    </div>
                    <div class="button2">
                        <button @click="submit">提交</button>
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
import SideBar from "@/components/basic/SideBar.vue";
import logger from "@fortawesome/vue-fontawesome/src/logger";
const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
const feedback = ref({
    feedbackExplain : '',
    imageFile: null,
})
const fileInput = ref(null); // 获取文件输入框的引用
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
onBeforeMount(()=>{
    isUser();
});
function handleFileUpload(event) {
    feedback.value.imageFile = event.target.files[0]; // 获取上传的文件
}
function submit () {
    axiosInstance.post('/feedback/saveFeedback',{
        feedbackExplain : feedback.value.feedbackExplain,
        file : feedback.value.imageFile,
        userId : user.value.userId,
    },{
        headers : {
            "Content-Type" : "multipart/form-data"// 使用 multipart/form-data 格式上传文件
        }
    }).then(response => {
        console.log(feedback.value.imageFile);
        alert("提交成功");
        feedback.value.feedbackExplain = "";
        feedback.value.imageFile = null;
        // 清空文件输入框的值
        if (fileInput.value) {
            fileInput.value.value = ""; // 重置文件输入框
        }
        router.push({
            path : "/feedback"
        })
    }).catch(error => {
        console.error(error);
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
    flex-grow: 1; /* 使内容区域占据剩余空间 */
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-left: 200px;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 250px;
    margin-top: 10px;
}
.file-input {
    margin-bottom: 10px;
}
.button2{
    display: flex;
    justify-items: center;
    align-items: center;
    margin-top: 70px;
}
.button2 button {
    width: 520px;
    padding: 10px 0px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px; /* 按钮圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    font-size: 14px;
    margin-left: 75px;
}

button:hover {
    background-color: #0056b3; /* 鼠标悬停时的背景颜色 */
}
.content{
    width:680px;
    height: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
.feedback-textarea{
    width: 100%;
    height: 100%;
    padding: 15px;
    font-size: 16px;
    border: none; /* 去掉边框 */
    border-radius: 4px;
    resize: none; /* 禁止用户调整大小 */
    box-sizing: border-box; /* 确保 padding 不影响整体大小 */
    vertical-align: top; /* 内容从顶部开始对齐 */
    background-color: #fff;
}
</style>
