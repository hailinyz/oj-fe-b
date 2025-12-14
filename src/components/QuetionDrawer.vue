<template >
	<el-drawer v-model="visibleDrawer" :with-header="false" size="50%" destroy-on-close = "true">
		<el-form :model="formModel" ref="formRef">
			<el-form-item label="题目标题:">
				<el-input style="width:387px !important" v-model="formQuestion.title" placeholder="请输入标题"></el-input>
			</el-form-item>
			<el-form-item label="题目难度:">
				<selector style="width:387px !important" v-model="formQuestion.difficulty" width="100%"
					placeholder="请选择题目难度">
				</selector>
			</el-form-item>
			<el-form-item label="时间限制（单位毫秒）:">
				<el-input style="width:300px !important" v-model="formQuestion.timeLimit"
					placeholder="请输入时间限制"></el-input>
			</el-form-item>
			<el-form-item label="空间限制（单位字节）:">
				<el-input style="width:300px !important" v-model="formQuestion.spaceLimit"
					placeholder="请输入空间限制"></el-input>
			</el-form-item>
			<el-form-item label="题目内容:">
				<div class="editor">
					<quill-editor placeholder="请输入题目内容" v-model:content="formQuestion.content" content-type="html"></quill-editor>
				</div>
			</el-form-item>
			<el-form-item label="题目用例:">
				<el-input style="width:387px !important" v-model="formQuestion.questionCase"
					placeholder="请输入题目用例"></el-input>
			</el-form-item>
			<el-form-item label="默认代码块:">
        <code-editor @update:value="handleEditorContent" ref="defaultCodeRef"></code-editor>
			</el-form-item>
			<el-form-item label="main函数:">
				<code-editor @update:value="handleEditorMainFunc" ref="mainFuncRef"></code-editor>
			</el-form-item>
			<el-form-item>
				<el-button class="question-button" type="primary" plain @click="onSubmit()">发布</el-button>
			</el-form-item>
		</el-form>
	</el-drawer>
</template>



<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import CodeEditor from '@/components/CodeEditor.vue'
import{ reactive, ref } from 'vue'
import Selector from '@/components/questionSelector.vue'
import { ElMessage } from 'element-plus'
import { addQuestionService, getQuestionDetailService,editQuestionService } from '@/apis/question'

const visibleDrawer = ref(false)
const formQuestion = reactive({ //表单数据，向后台发请求时的参数，动态绑定
  questionId: '',
  title: '',
  difficulty: '',
  timeLimit: '',
  spaceLimit: '',
  content: '',
  questionCase: '',
  defaultCode: '',
  mainFunc: ''
})

const defaultCodeRef = ref()
const mainFuncRef = ref()

async function open(questionId){
  visibleDrawer.value = true
  //清空表单数据
  for (const key in formQuestion) {
    if(formQuestion.hasOwnProperty(key)){
      formQuestion[key] = ''
    }
  }
  if(questionId){ 
    //根据题目id获取题目详情
    const questionDetail = await getQuestionDetailService(questionId)
    Object.assign(formQuestion, questionDetail.data) //将获取到的题目详情赋值给表单数据
    //将获取到的题目详情赋值给代码编辑器
    defaultCodeRef.value.setAceCode(formQuestion.defaultCode)
    mainFuncRef.value.setAceCode(formQuestion.mainFunc)
  }
}
defineExpose({ //暴露给父组件的方法
  open
})

//向后台发请求
function validate() {
  let msg = ''
  if (!formQuestion.title) {
    msg = '请添加题目标题'
  } else if (formQuestion.difficulty === '') {
    msg = '请选择题目难度'
  } else if (!formQuestion.timeLimit) {
    msg = '请输入时间限制'
  } else if (!formQuestion.spaceLimit) {
    msg = '请输入空间限制'
  } else if (!formQuestion.content) {
    msg = '请输入题目内容信息'
  } else if (!formQuestion.questionCase) {
    msg = '请输入题目用例名称'
  } else if (!formQuestion.defaultCode) {
    msg = '请输入默认代码'
  } else if (!formQuestion.mainFunc) {
    msg = '请输入main函数'
  } else {
    msg = ''
  }
  return msg
}

async function onSubmit() {
  const errorMessage = validate()
  if (errorMessage) {
    ElMessage.error(errorMessage);
    return false
  }
  
  if(formQuestion.questionId){
  //发起的是编辑题目请求
  await editQuestionService(formQuestion)
  ElMessage.success('编辑成功')
  emit('success', 'edit') //触发编辑成功的事件
  }else{ 
  await addQuestionService(formQuestion)
  ElMessage.success('添加成功')
  emit('success', 'add') //触发添加成功的事件
  }
  visibleDrawer.value = false
}

function handleEditorContent(content) {
  formQuestion.defaultCode = content
}

function handleEditorMainFunc(content) {
  formQuestion.mainFunc = content
}

const emit = defineEmits(['success']) //向父组件传递添加成功的消息

</script>







<style lang="scss">
	.question-button {
		width: 200px;
	}
</style>