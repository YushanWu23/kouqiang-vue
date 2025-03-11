<template>
    <TopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>知识科普</h2>
                    <div class="search">
                        <input type="text" v-model="searchKeyword" placeholder="输入关键词搜索" @input="searchKnowledges" />
                    </div>
                    <ul class="KnowledgeList">
                        <li v-for="searchingKnowledge in searchingKnowledges" @click="getKnowledgeInfo(searchingKnowledge.knowledgeId)">
                            <div class="text">
                                {{searchingKnowledge.knowledgeTitle}}
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
const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
const knowledges = ref([]);
const searchKeyword =ref("");
const searchingKnowledges = ref([]);
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
function fetchKnowledges(){
    isUser();
    axiosInstance.get('/knowledge/getAll',
    ).then(response => {
        console.log(response.data);
        knowledges.value.push(...response.data);
        searchingKnowledges.value=knowledges.value;
        console.log(knowledges);
    }).catch(error =>{
        console.error(error)
    });
}
onBeforeMount(()=>{
    fetchKnowledges();
});
function getKnowledgeInfo(knowledgeId){
    router.push({
        path : "/knowledgeInfo",
        query :{
            knowledgeId : knowledgeId
        }
    })
}
function searchKnowledges(){
    if (searchKeyword.value.trim() === "") {
        searchingKnowledges.value = knowledges.value; // 如果搜索框为空，显示所有知识
    } else {
        searchingKnowledges.value = [];
        const keyword = searchKeyword.value.toLowerCase(); // 转换为小写以便不区分大小写搜索
        /*searchingKnowledges.value = knowledges.value.filter(knowledge =>
            knowledge.knowledgeExplain.toLowerCase().includes(keyword) // 根据知识解释进行搜索
        );*/
        axiosInstance.get('/knowledge/getByKnowledgeTitleContaining',{
            params:{
                knowledgeTitle : keyword,
            }
        }).then(response => {
            console.log(response.data)
            searchingKnowledges.value.push(...response.data)
            console.log(searchingKnowledges);
        }).catch(error =>{
            console.error(error)
        });
    }
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
.KnowledgeList{
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
}
.search{
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    width: 800px;
    margin-left: 50px;
    margin-bottom: 20px;
}
.search input{
    color: #999999;
    font-size: 14px;
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: white;
    width: 100%;
    padding: 10px 20px;
}
</style>
