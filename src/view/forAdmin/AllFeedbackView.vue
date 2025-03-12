<template>
    <AdminTopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>反馈记录</h2>
                    <ul class="FeedList">
                        <li v-for="(feedback, index) in feedbacks" :key="feedback.feedbackId">
                            <div class="text" v-html="feedback.feedbackExplain"></div>
                            <!-- 显示图片 -->
                            <div class="image-preview" v-if="feedback.imageUrls && feedback.imageUrls.length > 0">
                                <div v-for="(url, imgIndex) in feedback.imageUrls" :key="imgIndex" class="image-item">
                                    <a :href="getImageUrl(url)" target="_blank">
                                        <img :src="getImageUrl(url)" alt="Feedback Image" class="preview-image" />
                                    </a>
                                </div>
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
import AdminTopComponent from "@/components/basic/AdminTopComponent.vue";
const router = useRouter();
const store = useStore();
const { admin } = storeToRefs(store);
const feedbacks = ref([]);
function isAdmin() {
    if (admin.value.adminId ===''){
        alert("先登陆")
        router.push({
            path:"/adminLogin"
        })
    }
}
function fetchFeedbacks(){
    isAdmin();
    axiosInstance.get('/feedback/getFeedbackAll',
    ).then(response => {
        console.log(response.data);
        feedbacks.value.push(...response.data);
    }).catch(error =>{
        console.error(error)
    });
}
onBeforeMount(()=>{
    fetchFeedbacks();
});
function getImageUrl(imagePath) {
    return `http://localhost:8082/kouqiang-user${imagePath}`;
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
    margin-left: 180px;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 370px;
    margin-top: 10px;
}
.FeedList{
    margin-top: 20px;
    margin-bottom: 20px;
    overflow-y: auto;
}
.text {
    word-wrap: break-word; /* 允许在单词内换行 */
    white-space: pre-line; /* 保留换行符并正常换行 */
}
li{
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px 20px;
    margin-bottom: 20px;
    width:900px;
    font-size: 20px;
    word-wrap: break-word; /* 允许在单词内换行 */
    white-space: normal; /* 允许内容正常换行 */
}
.image-preview{
    display: flex;
}
.image-item{
    display: flex;
    width:89px;
    margin-right: 25px;
    height: 89px;
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
</style>
