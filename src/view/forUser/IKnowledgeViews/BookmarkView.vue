<template>
    <TopComponent/>
    <SideBar/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>收藏夹</h2>
                    <ul class="knowledgeList">
                        <li v-for="bookmark in bookmarks" @click="getBookmarkInfo(bookmark.knowledge.knowledgeId)">
                            <div class="text">
                                {{bookmark.knowledge.knowledgeTitle}}
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
const bookmarks = ref([]);
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
function fetchBookmarks(){
    isUser();
    axiosInstance.get('/bookmark/getBookmarkAll',{
        params:{
            userId : user.value.userId,
        }
    }).then(response => {
        bookmarks.value.push(...response.data)
    }).catch(error => {
        console.error(error);
    });
}
onBeforeMount(()=>{
    fetchBookmarks();
});

function getBookmarkInfo(knowledgeId) {
    router.push({
        path : "/knowledgeInfo",
        query :{
            knowledgeId : knowledgeId
        }
    })
}
function logout() {
    router.push({ path: "/login" });
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
    margin-left: 270px;
    margin-top: 10px;
}
.knowledgeList{
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
    width:700px;
    font-size: 20px;
}
</style>
