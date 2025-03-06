<template>
    <TopComponent/>
    <SideBar/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>我的反馈</h2>
                    <!-- 图片上传组件 -->
                    <input type="file" ref="fileInput" multiple @change="handleFileUpload" accept="image/*" class="file-input"/>
                    <!-- 显示上传的图片 -->
                    <div v-if="imageUrls.length > 0" class="image-preview">
                        <div v-for="(url, index) in imageUrls" :key="index" class="image-item">
                            <a :href="url" target="_blank">
                                <img :src="url" alt="Uploaded Image" class="preview-image" />
                            </a>
                            <button @click="removeFile(index)">删除</button>
                        </div>
                    </div>
                    <div class="content">
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
const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
const feedback = ref({
    feedbackExplain : '',
    imageUrls : [],
})
const fileInput = ref(null); // 获取文件输入框的引用
const imageUrls = ref([]);
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
    const files = event.target.files;
    if (files && files.length > 0) {
        // 将新选择的文件追加到现有列表中
        for (const file of files) {
            feedback.value.imageUrls.push(file);
        }
        previewImages(); // 预览图片
    }
}
function previewImages() {
    imageUrls.value = []; // 清空之前的预览
    Array.from(feedback.value.imageUrls).forEach(file => {
        const url = URL.createObjectURL(file); // 生成临时 URL
        imageUrls.value.push(url);
    });
}
function removeFile(index) {
    feedback.value.imageUrls.splice(index, 1); // 删除指定索引的文件
    previewImages(); // 重新生成预览
}

function submit () {
    const formData = new FormData();
    formData.append("feedbackExplain", feedback.value.feedbackExplain);


    // 添加多张图片到 FormData
    if (feedback.value.imageUrls  && feedback.value.imageUrls .length > 0) {
        feedback.value.imageUrls .forEach((file, index) => {
            formData.append("files", file); // 注意字段名称与后端一致
        });
    }
    formData.append("userId", user.value.userId);
    axiosInstance.post('/feedback/saveFeedback',formData,{
        headers : {
            "Content-Type" : "multipart/form-data"// 使用 multipart/form-data 格式上传文件
        }
    }).then(response => {
        alert("提交成功");
        feedback.value.feedbackExplain = "";
        feedback.value.imageUrls  = [];
        // 清空文件输入框的值
        if (fileInput.value) {
            fileInput.value.value = ""; // 重置文件输入框
        }
        imageUrls.value = [];
        router.push({
            path : "/feedback"
        })
    }).catch(error => {
        console.error(error);
    });
}
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
    height: 89px;
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
    margin-top: 15px;
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
