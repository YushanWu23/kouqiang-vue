<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>{{ knowledge.knowledgeTitle }}</h2>
                    <div class="buttons">
                        <div class="back">
                            <button @click="back">返回</button>
                        </div>
                        <div class="bookmark">
                            <div class="bookText" v-show="isBookmarked">
                                <i class="fa-solid fa-star"></i>
                                已收藏
                            </div>
                            <div class="bookText" v-show="!isBookmarked">
                                <i class="fa-regular fa-star"></i>
                                未收藏
                            </div>
                            <i v-if="isBookmarked" @click="unbookmark"></i>
                            <i v-else @click="bookmark"></i>
                            <button @click="toggleBookmark">{{ isBookmarked ? '取消收藏' : '加入收藏夹' }}</button>
                        </div>
                    </div>
                    <div class="content">
                        {{knowledge.knowledgeExplain}}
                        <div class="image-preview" v-if="knowledge.imageUrls && knowledge.imageUrls.length > 0">
                            <div v-for="(url, imgIndex) in knowledge.imageUrls" :key="imgIndex" class="image-item">
                                <a :href="getImageUrl(url)" target="_blank">
                                    <img :src="getImageUrl(url)" alt="Note Image" class="preview-image" />
                                </a>
                            </div>
                        </div>
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
const router = useRouter();
const store = useStore();
const route = useRoute();
const { user } = storeToRefs(store);
const knowledgeId = route.query.knowledgeId;
const knowledge = ref('');
const isBookmarked = ref(false);
const bookmarks = ref([]);
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
function getImageUrl(imagePath) {
    return `http://localhost:8082/kouqiang-user${imagePath}`;
}
function fetchKnowledge(knowledgeId){
    isUser();
    axiosInstance.get('/knowledge/getKnowledgeByKnowledgeId',{
        params:{
            knowledgeId : knowledgeId,
        }
    }).then(response => {
        console.log(response.data);
        knowledge.value=response.data;
        bookmarkState();
    }).catch(error =>{
        console.error(error)
    });
}
onBeforeMount(()=>{
    fetchKnowledge(knowledgeId);
});
function toggleBookmark() {
    if (isBookmarked.value) {
        unbookmark();
    } else {
        bookmark();
    }
}
function bookmarkState(){
    axiosInstance.get('/bookmark/isBookmarked',{
        params:{
            userId : user.value.userId,
            knowledgeId :knowledgeId,
        }
    }).then(response => {
        console.log(response.data);
        isBookmarked.value=response.data;
    }).catch(error =>{
        console.error(error)
    });
}
function bookmark() {
    axiosInstance.post('/bookmark/insertKnowledgeIntoBookmark', {
        userId: user.value.userId,
        knowledgeId: knowledgeId
    },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        }
    }).then(response => {
            isBookmarked.value = true;
            alert("已加入收藏夹");
            router.push({
                path : "/knowledgeInfo",
                query :{
                    knowledgeId : knowledgeId
                }
            })
        })
        .catch(error => {
            console.error(error);
        });
}

function unbookmark() {
    axiosInstance.post('/bookmark/deleteBookmark', {
            userId: user.value.userId,
            knowledgeId: knowledgeId
    },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        }
    }).then(response => {
            isBookmarked.value = false;
            alert("已取消收藏");
            router.push({
                path : "/knowledgeInfo",
                query :{
                    knowledgeId : knowledgeId
                }
            })
        })
        .catch(error => {
            console.error(error);
        });
}
function back(){
    router.go(-1)
}

</script>
<style scoped>
.image-preview{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;/* 竖直排列 */
}
.image-item{
    width: 400px;
    margin-bottom: 10px;
    text-align: center;
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
    margin-left: 180px;
}

h2 {
    width:900px;
    margin-bottom: 10px;
    font-size: 30px;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    word-wrap: break-word; /* 允许在单词内换行 */
    white-space: pre-line; /* 保留换行符并正常换行 */
}
.buttons {
    display: flex;
    justify-content: space-between;
    margin-right: 180px;
    margin-left: 30px;
}
.buttons button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px; /* 按钮圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    font-size: 14px;
}
.content{
    width:900px;
    height: 500px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    word-wrap: break-word; /* 允许在单词内换行 */
    white-space: pre-line; /* 保留换行符并正常换行 */
    overflow: auto;/*滑动*/
    color: #555555;
}
.bookmark{
    display: flex;
}
.bookText{
    font-size: 14px;
    display: flex;
    justify-items: center;
    align-items: center;
    margin-right: 3px;
}
</style>
