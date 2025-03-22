<template>
    <AdminTopComponent/>
    <div class="background">
        <div class="wrapper">
            <div class="container">
                <div class="body">
                    <h2>排班管理</h2>
                    <div class="operation-bar">
                        <el-button type="primary" @click="showAddDialog">新增排班</el-button>
                    </div>
                    <el-table :data="schedules" style="width: 100%" border>
                        <el-table-column prop="scheduleId" label="ID" width="80"/>
                        <el-table-column prop="doctor.doctorId" label="医生ID"/>
                        <el-table-column prop="doctor.doctorName" label="医生名" width="120"/>
                        <el-table-column label="时间范围">
                            <template #default="{row}">
                                {{ formatDateTime(row.startTime) }} - {{ formatDateTime(row.endTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="maxReservations" label="最大预约数" width="120"/>
                        <el-table-column prop="currentReservations" label="当前预约数" width="120"/>
                        <el-table-column prop="status" label="状态" width="120">
                          <template #default="{row}">
                            {{ formatStatus(row.status) }}
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template #default="{row}">
                                <el-button size="small" @click="showEditDialog(row)">编辑</el-button>
                                <el-button size="small" type="danger" @click="handleDelete(row.scheduleId)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!-- 新增/编辑对话框 -->
                    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑排班' : '新增排班'">
                        <el-form :model="form" label-width="120px">
                            <el-form-item label="医生ID" required>
                                <el-input v-model="form.doctorId"/>
                            </el-form-item>
                            <el-form-item label="开始时间" required>
                                <el-date-picker
                                    v-model="form.startTime"
                                    type="datetime"
                                    placeholder="选择开始时间"
                                    value-format="YYYY-MM-DD HH:mm:ss"
                                    @change="handleDateChange('startTime')"
                                />
                            </el-form-item>
                            <el-form-item label="结束时间" required>
                                <el-date-picker
                                    v-model="form.endTime"
                                    type="datetime"
                                    placeholder="选择结束时间"
                                    value-format="YYYY-MM-DD HH:mm:ss"
                                    @change="handleDateChange('endTime')"
                                />
                            </el-form-item>
                            <el-form-item label="最大预约数" required>
                                <el-input-number v-model="form.maxReservations" :min="1"/>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                            <el-button @click="dialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="submitForm">确认</el-button>
                        </template>
                    </el-dialog>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { ElMessage, ElMessageBox, ElButton, ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElDatePicker, ElInputNumber } from 'element-plus';
import { useRouter } from "vue-router";
import {axiosInstance, useStore} from "@/main";
import { storeToRefs } from "pinia";
import AdminTopComponent from "@/components/basic/AdminTopComponent.vue";
const router = useRouter();
const store = useStore();
const { admin } = storeToRefs(store);
const schedules = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentScheduleId = ref(null);
const form = ref({
    doctorId: '',
    startTime: '',
    endTime: '',
    maxReservations: 15
});
function isAdmin() {
    if (admin.value.adminId ===''){
        alert("先登陆")
        router.push({
            path:"/adminLogin"
        })
    }
}
onBeforeMount(async () => {
    await fetchSchedule();
});
function formatStatus(status) {
  switch (status) {
    case 0:
      return "活跃";
    case 1:
      return "已满";
    case 2:
      return "结束";
    default:
      return "未知";
  }
}
function formatDateTime(datetime) {
    return new Date(datetime).toLocaleString();
}
function handleDateChange(field) {
    if (form.value[field]) {
        // 确保日期格式为 yyyy-MM-dd HH:mm:ss
        const date = new Date(form.value[field]);
        const pad = n => n.toString().padStart(2, '0');
        form.value[field] = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
}
async function fetchSchedule() {
    isAdmin();
    try {
        const response = await axiosInstance.get('/schedule/getAllSchedules');
        schedules.value = response.data;
    } catch (error) {
        ElMessage.error('获取排班数据失败');
        console.error(error);
    }
}

function showAddDialog() {
    isEdit.value = false;
    form.value = {
        doctorId: '',
        startTime: '',
        endTime: '',
        maxReservations: 15
    };
    dialogVisible.value = true;
}

function showEditDialog(row) {
    isEdit.value = true;
    currentScheduleId.value = row.scheduleId;
    form.value = {
        doctorId: row.doctor.doctorId,
        startTime: formatBackendTime(row.startTime),
        endTime:  formatBackendTime(row.endTime),
        maxReservations: row.maxReservations
    };
    dialogVisible.value = true;
}
function formatBackendTime(time) {
    // 如果已经是字符串直接返回
    if (typeof time === 'string') return time;

    // 将 LocalDateTime 对象转换为字符串
    const date = new Date(time);
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}
            ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
async function submitForm() {
    try {
        if (!form.value.doctorId) {
            alert('医生Id不能为空！');
            return;
        }
        if (!form.value.startTime) {
            alert('开始时间不能为空！');
            return;
        }
        if (!form.value.endTime) {
            alert('结束时间不能为空！');
            return;
        }
        if (form.value.startTime) {
            const date = new Date(form.value.startTime);
            const pad = n => n.toString().padStart(2, '0');
            form.value.startTime = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        }
        if (form.value.endTime) {
            const date = new Date(form.value.endTime);
            const pad = n => n.toString().padStart(2, '0');
            form.value.endTime = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        }

        const params = new URLSearchParams();
        params.append('doctorId', form.value.doctorId);
        params.append('startTime', form.value.startTime);
        params.append('endTime', form.value.endTime);
        params.append('maxReservations', form.value.maxReservations);

        if (isEdit.value) {
            params.append('scheduleId', currentScheduleId.value);
            const response = await axiosInstance.post('/schedule/updateSchedule', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (!response.data) {
                alert('医生ID不正确！');
                return;
            }
            ElMessage.success('更新成功');
        } else {
            const response = await axiosInstance.post('/schedule/createSchedule', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (!response.data) {
                alert('医生ID不正确！');
                return;
            }
            ElMessage.success('创建成功');
        }
        dialogVisible.value = false;
        await fetchSchedule();
    } catch (error) {
        alert('操作失败: ' + (error.response?.data || '未知错误'));
    }
}

async function handleDelete(scheduleId) {
    try {
        await ElMessageBox.confirm('确认删除该排班？', '警告', { type: 'warning' });
        const response = await axiosInstance.post('/schedule/deleteSchedule', { scheduleId }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (!response.data) {
            alert('删除失败: ' + (response.response?.data || '未知错误'));
            return;
        }
        ElMessage.success('删除成功');
        await fetchSchedule();
    } catch (error) {
        if (error !== 'cancel') {
            alert('删除失败: ' + (error.response?.data || '未知错误'));
        }
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
    margin-left: 130px;
}

h2 {
    margin-bottom: 20px;
    font-size: 30px;
    margin-left: 370px;
    margin-top: 10px;
}
.operation-bar {
    margin-bottom: 20px;
}

.el-table {
    margin-top: 20px;
}

.el-date-editor {
    width: 100%;
}
</style>
