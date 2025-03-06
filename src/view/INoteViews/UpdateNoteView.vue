<template>
    <TopComponent/>
    <SideBar/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>修改记录</h2>
                    <div class="back">
                        <button @click="goBack">返回</button>
                    </div>
                    <!-- 图片上传组件 -->
                    <input type="file" ref="fileInput" multiple @change="handleFileUpload" accept="image/*" class="file-input"/>
                    <!-- 显示上传的图片 -->
                    <div v-if="imageUrls.length > 0" class="image-preview">
                        <div v-for="(item, index) in imageUrls" :key="index" class="image-item">
                            <a :href="item.url" target="_blank">
                                <img :src="item.url" alt="Uploaded Image" class="preview-image" />
                            </a>
                            <button @click="removeFile(index)">删除</button>
                        </div>
                    </div>
                    <div class="content">
                        <textarea
                            v-model="note.noteExplain"
                            placeholder="请输入新记录"
                            class="note-textarea"
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
import {useRoute, useRouter} from "vue-router";
import {axiosInstance, useStore} from "@/main";
import { storeToRefs } from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";
import SideBar from "@/components/basic/SideBar.vue";
const router = useRouter();
const store = useStore();
const route = useRoute()
const { user } = storeToRefs(store);
const note = ref({
    noteExplain : '',
    imageUrls : [],
});
const fileInput = ref(null); // 获取文件输入框的引用
const imageUrls = ref([]);
const noteId = route.query.noteId;
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}

onBeforeMount(()=>{
    fetchNote(noteId);
});
function fetchNote(noteId){
    isUser();
    axiosInstance.get('/note/getNoteByNoteId', {
        params: {
            noteId: noteId,
        }
    }).then(response => {
        note.value = response.data;
        note.value.imageUrls = response.data.imageUrls.map(url => ({
            type: 'url', // 标记为 URL 类型
            data: url,   // 存储图片 URL
        }));
        previewImages(); // 生成预览
    }).catch(error => {
        console.error(error);
    });
}
function getImageUrl(url) {
    return `http://localhost:8082/kouqiang-user${url}`;
}
function handleFileUpload(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
        // 将新选择的文件追加到现有列表中
        for (const file of files) {
            note.value.imageUrls.push({
                type: 'file', // 标记为文件类型
                data: file,   // 存储文件对象
            });
        }
        previewImages(); // 预览图片
    }
}
function previewImages() {
    imageUrls.value = []; // 清空之前的预览
    note.value.imageUrls.forEach(item => {
        if (item.type === 'url') {
            // 如果是 URL 类型，直接使用
            imageUrls.value.push({
                url: getImageUrl(item.data), // 生成完整的图片 URL
            });
        } else if (item.type === 'file') {
            // 如果是文件类型，生成临时 URL
            imageUrls.value.push({
                url: URL.createObjectURL(item.data), // 生成临时 URL
            });
        }
    });
}
function removeFile(index) {
    note.value.imageUrls.splice(index, 1); // 删除指定索引的文件
    previewImages(); // 重新生成预览
}
function goBack(){
    router.go(-1)
}
function submit () {
    const formData = new FormData();
    formData.append("noteId", noteId);
    // 添加之前保留的图片 URL
    const retainedImageUrlsJson = note.value.imageUrls
        .filter(item => item.type === 'url') // 只保留 URL 类型的图片
        .map(item => item.data); // 提取 URL
    formData.append("retainedImageUrlsJson", JSON.stringify(retainedImageUrlsJson));

    // 添加新上传的图片文件
    note.value.imageUrls.forEach(item => {
        if (item.type === 'file') {
            formData.append("files", item.data); // 只上传文件类型的图片
        }
    });
    formData.append("noteExplain", note.value.noteExplain);
    axiosInstance.post('/note/updateNote',formData,{
        headers : {
            "Content-Type" : "multipart/form-data"
        }
    }).then(response => {
        alert("修改成功");
        router.push({
            path : "/note"
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
    margin-left: 270px;
    margin-top: 10px;
}

.back button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px; /* 按钮圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    font-size: 14px;
    margin-bottom: 5px;
}

li{
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px 20px;
    margin-bottom: 20px;
    width:700px;
    font-size: 20px;
}
.note-textarea{
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
.content{
    width:680px;
    height: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
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
</style>
