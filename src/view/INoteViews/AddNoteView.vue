<template>
    <TopComponent/>
    <SideBar/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>我的记录</h2>
                    <div class="back">
                        <button @click="goBack">返回</button>
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
import { useRouter } from "vue-router";
import {axiosInstance, useStore} from "@/main";
import { storeToRefs } from "pinia";
import TopComponent from "@/components/basic/TopComponent.vue";
import SideBar from "@/components/basic/SideBar.vue";
const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
const note = ref({
    noteExplain : '',
});
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
function goBack(){
    router.go(-1)
}
function submit () {
    axiosInstance.post('/note/saveNote',{
        noteExplain : note.value.noteExplain,
        userId : user.value.userId,
    },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        }
    }).then(response => {
        alert("提交成功");
        note.value.noteExplain = "";
        router.push({
            path : "/note"
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
    margin-left: 270px;
    margin-top: 10px;
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
    margin-top: 25px;
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
