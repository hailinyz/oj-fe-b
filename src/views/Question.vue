<template>
  <el-form inline="true">
    <el-form-item>
      <selector v-model="params.difficulty" placeholder="请选择题目难度" style="width: 200px;"></selector>
    </el-form-item>
    <el-form-item>
      <el-input v-model="params.title" placeholder="请您输入要搜索的题目标题" />
    </el-form-item>
    <el-form-item>
      <el-button plain @Click="onSearch">搜索</el-button>
      <el-button plain type="info" @Click="onReset">重置</el-button>
      <el-button plain type="primary" :icon="Plus" @Click="onAddQuestion">添加题目</el-button>
    </el-form-item>
  </el-form>

  <el-table height="526px" :data="questionList">
    <el-table-column prop="questionId" width="180px" label="题目id" />
    <el-table-column prop="title" label="题目标题" />
    <el-table-column prop="difficulty" label="题目难度" width="90px">
      <template #default="{ row }">
        <div v-if="row.difficulty === 1" style="color:#3EC8FF;">简单</div>
        <div v-if="row.difficulty === 2" style="color:#FE7909;">中等</div>
        <div v-if="row.difficulty === 3" style="color:#FD4C40;">困难</div>
      </template>
    </el-table-column>
    <el-table-column prop="createName" label="创建人" width="140px" />
    <el-table-column prop="createTime" label="创建时间" width="180px" />
    <el-table-column label="操作" width="100px" fixed="right">
        <template #default="{ row }"> <!-- 这个插槽是为了获取题目id -->
        <el-button type="text" @Click="onEdit(row.questionId)">编辑
        </el-button>
        <el-button type="text" class="red" @Click="onDelete(row.questionId)">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页器 -->
  <el-pagination background layout="total, sizes, prev, pager, next, jumper":total="total" 
  :page-sizes="[1, 5, 10, 15, 20]" 
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
  v-model:current-page="params.pageNum"
  v-model:page-size="params.pageSize"/>

  <!-- 抽屉子组件 -->
  <quetion-drawer ref="questionDrawerRef" @success="onSuccess"></quetion-drawer>
</template>

<script setup>
import { Plus } from "@element-plus/icons-vue"
import Selector from "@/components/questionSelector.vue"
import { getQuestionListService , delQuestionService} from "@/apis/question"
import { reactive, ref } from "vue"
import QuetionDrawer from "@/components/QuetionDrawer.vue"

async function onDelete(questionId){
  try {
    await ElMessageBox.confirm(
      '确定要删除这道题目吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await delQuestionService(questionId)
    ElMessage.success('删除成功')
    params.pageNum = 1
    getQuestionList()
  } catch {
    // 用户点击取消，不做任何操作
  }
  //重新获取题目列表
  getQuestionList()
}

async function onEdit(questionId){
  questionDrawerRef.value.open(questionId)
}

function onSuccess(service){
  if(service === 'add'){
      //重新到1页
    params.pageNum = 1
  }
  //重新获取题目列表
  getQuestionList()
  
}

const params = reactive({
  pageNum: 1,
  pageSize: 10,
  difficulty: '',
  title: ''
})

const questionList = ref([])
const total = ref(0)
async function getQuestionList(){
    const result = await getQuestionListService(params)
    console.log("题目列表: ", result);
    questionList.value = result.rows
    total.value = result.total
}
getQuestionList()

function handleSizeChange(newSize){
  //跳回第一页
  params.pageNum = 1
  //重新获取数据像后端发起请求
  getQuestionList()
}

function handleCurrentChange(newPage){
  getQuestionList()
}

function onSearch(){
  //重置页码
  params.pageNum = 1
  //重新获取数据
  getQuestionList()
}

function onReset(){
  //将搜索条件置空
  params.pageNum = 1
  params.pageSize = 10
  params.title = ''
  params.difficulty = ''
  //重新获取数据
  getQuestionList()
}

const questionDrawerRef = ref()
function onAddQuestion(){
  //打开抽屉
  questionDrawerRef.value.open()
}

</script>