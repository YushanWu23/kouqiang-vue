<template>
    <TopComponent/>
    <SideBar/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>我的记录</h2>
                    <div class="addTheNote">
                        <button @click="addTheNote">添加新记录</button>
                    </div>
                    <ul class="noteList">
                        <li v-for="(note, index) in notes" :key="note.noteId">
                            <div class="buttons">
                                <div class="part">
                                    <button @click="editNote(note.noteId)">修改</button>
                                </div>
                                <div class="part">
                                    <button @click="deleteNote(note.noteId)">删除</button>
                                </div>
                            </div>
                            <div class="text" v-html="note.noteExplain"></div>
                            <!-- 显示图片 -->
                            <div class="image-preview" v-if="note.imageUrls && note.imageUrls.length > 0">
                                <div v-for="(url, imgIndex) in note.imageUrls" :key="imgIndex" class="image-item">
                                    <a :href="getImageUrl(url)" target="_blank">
                                        <img :src="getImageUrl(url)" alt="Note Image" class="preview-image" />
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
import TopComponent from "@/components/basic/TopComponent.vue";
import SideBar from "@/components/basic/SideBar.vue";
const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
const notes = ref([]);
function isUser() {
    if (user.value.userId ===''){
        alert("先登陆")
        router.push({
            path:"/login"
        })
    }
}
function fetchNotes(){
    isUser();
    axiosInstance.get('/note/getNoteByUserId',{
        params:{
            userId : user.value.userId,
        }
    }).then(response => {
        notes.value.push(...response.data)
    }).catch(error => {
        console.error(error);
    });
}
onBeforeMount(()=>{
    fetchNotes();
});
function getImageUrl(imagePath) {
    return `http://localhost:8082/kouqiang-user${imagePath}`;
}
function editNote(noteId){
    router.push(
        {path:'/updateNote',
            query: {
                noteId: noteId
            }
        });
}
function deleteNote(noteId){
    axiosInstance.get('/note/removeNote',{
        params:{
            noteId : noteId,
            userId : user.value.userId,
        }
    }).then(response => {
        notes.value =[];
        router.push({ path: "/note" });
        fetchNotes()
    }).catch(error => {
        console.error(error);
    });
}
function addTheNote() {
    router.push({ path: "/addNote" });
}
</script>
<style scoped>
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
.addTheNote {
    display: flex;
    margin-left: 50px;
}
button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none; /* 按钮无边框 */
    border-radius: 4px; /* 按钮圆角 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    font-size: 14px;
}
.noteList{
    margin-top: 20px;
    margin-bottom: 20px;
    overflow-y: auto;/*滑动*/
}
.part{
    margin-right: 20px;
}
li{
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px 20px;
    margin-bottom: 20px;
    width:700px;
    font-size: 20px;
    word-wrap: break-word; /* 允许在单词内换行 */
    white-space: normal; /* 允许内容正常换行 */
}
.text {
    word-wrap: break-word; /* 允许在单词内换行 */
    white-space: pre-line; /* 保留换行符并正常换行 */
}
.buttons{
    display: flex;
    margin-bottom: 10px;
    margin-left: 520px;
}
.edit-input{
    width: 100%;
}
</style>
