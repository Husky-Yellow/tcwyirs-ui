<template>
  <Drawer
    v-model="drawerVisible"
    :title="isEdit ? '编辑项目' : '新增项目'"
    size="500px"
    direction="rtl"
    :before-close="handleClose"
    class="project-form-drawer"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="auto"
      label-position="top"
    >
      <!-- 项目名称 -->
      <el-form-item label="项目名称" prop="name" required>
        <el-input
          v-model="formData.name"
          placeholder="请输入项目名称"
          maxlength="50"
          clearable
        />
      </el-form-item>

      <!-- 项目周期 -->
      <el-form-item label="项目周期" prop="dateRange" required>
        <el-date-picker
          v-model="formData.dateRange"
          type="daterange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="w-full"
        />
      </el-form-item>

      <!-- 项目类型 -->
      <el-form-item label="项目类型" prop="type" required>
        <el-select v-model="formData.type" placeholder="请选择项目类型" class="w-full" clearable>
          <el-option
            v-for="type in projectTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>

      <!-- 项目经理 -->
      <el-form-item label="项目经理" prop="leaderId" required>
        <el-select
          v-model="formData.leaderId"
          placeholder="请选择项目经理"
          class="w-full"
          clearable
          filterable
          :disabled="isProjectManager"
        >
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.nickname"
            :value="user.id"
          />
        </el-select>
      </el-form-item>

      <!-- 项目成员 -->
      <el-form-item label="项目成员" prop="members" required>
        <el-select
          v-model="formData.members"
          placeholder="请选择项目成员"
          class="w-full"
          multiple
          clearable
          filterable
          collapse-tags
          collapse-tags-tooltip
        >
          <el-option
            v-for="user in availableUsers"
            :key="user.id"
            :label="user.nickname"
            :value="user.id"
          />
        </el-select>
      </el-form-item>

      <!-- 项目说明 -->
      <el-form-item label="项目说明" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入详论"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Drawer } from '@/components/Drawer'
import type { ProjectVO } from '@/api/resource/project'
import { createProject, updateProject } from '@/api/resource/project'
import { getUserSimplePage } from '@/api/system/user'
import type { UserVO } from '@/api/system/user'
import { useUserStore } from '@/store/modules/user'

interface ProjectFormData {
  name: string
  dateRange: [string, string] | []
  type: string
  leaderId: number | undefined
  members: number[]
  description: string
}

interface Props {
  projectData?: ProjectVO
}

const props = defineProps<Props>()

const emit = defineEmits<{
  success: []
  close: []
}>()

// 获取用户 store
const userStore = useUserStore()

// 判断是否为项目经理角色
const isProjectManager = computed(() => userStore.currentRole === 'project_manager')

// 项目类型选项
const projectTypes = ref([
  { label: '信息化系统开发', value: 'info-system' },
  { label: '数据分析', value: 'data-analysis' },
  { label: '基础设施建设', value: 'infrastructure' },
  { label: '研发创新', value: 'innovation' },
  { label: '其他', value: 'other' }
])

// 抽屉显示状态
const drawerVisible = ref(false)

// 是否为编辑模式
const isEdit = ref(false)

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<ProjectFormData>({
  name: '',
  dateRange: [],
  type: '',
  leaderId: undefined,
  members: [],
  description: ''
})

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  dateRange: [{ required: true, message: '请选择项目周期', trigger: 'change' }],
  type: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
  leaderId: [{ required: true, message: '请选择项目经理', trigger: 'change' }],
  members: [{ required: true, message: '请至少选择一个项目成员', trigger: 'change' }]
}

// 用户列表
const userList = ref<UserVO[]>([])

// 可用的用户（排除项目经理）
const availableUsers = computed(() => {
  return userList.value.filter((user) => user.id !== formData.leaderId)
})

// 加载用户列表
const loadUsers = async () => {
  try {
    const res = await getUserSimplePage()
    userList.value = res
  } catch (error) {
    console.error('加载用户列表失败:', error)
  }
}

// 打开抽屉
const open = (projectData?: ProjectVO) => {
  drawerVisible.value = true
  isEdit.value = !!projectData

  if (projectData) {
    // 编辑模式
    formData.name = projectData.name || ''
    formData.dateRange = projectData.startTime && projectData.endTime
      ? [
          new Date(projectData.startTime).toISOString().split('T')[0],
          new Date(projectData.endTime).toISOString().split('T')[0]
        ]
      : []
    formData.type = '' // TODO: 从 projectData 中获取类型
    formData.leaderId = projectData.leaderId
    formData.description = projectData.description || ''
    // TODO: 加载项目成员
  } else {
    // 新增模式：如果是项目经理角色，自动设置项目经理为当前用户
    if (isProjectManager.value) {
      formData.leaderId = userStore.user.id
    }
  }

  loadUsers()
}

// 关闭抽屉
const close = () => {
  drawerVisible.value = false
  emit('close')
  // 重置表单
  formRef.value?.resetFields()
}

const handleClose = () => {
  close()
}

// 监听项目经理变化，如果经理在成员列表中则移除
watch(
  () => formData.leaderId,
  (newLeaderId) => {
    if (newLeaderId && formData.members.includes(newLeaderId)) {
      formData.members = formData.members.filter((id) => id !== newLeaderId)
    }
  }
)

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      const projectData: ProjectVO = {
        name: formData.name,
        startTime: formData.dateRange[0] ? new Date(formData.dateRange[0]) : undefined,
        endTime: formData.dateRange[1] ? new Date(formData.dateRange[1]) : undefined,
        leaderId: formData.leaderId,
        description: formData.description
      }

      if (isEdit.value && props.projectData?.id) {
        // 编辑
        projectData.id = props.projectData.id
        await updateProject(projectData)
        ElMessage.success('更新成功')
      } else {
        // 新增
        await createProject(projectData)
        ElMessage.success('创建成功')
      }

      // TODO: 保存项目成员

      emit('success')
      close()
    } catch (error) {
      console.error('保存项目失败:', error)
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    }
  })
}

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>

<script lang="ts">
export default {
  name: 'ProjectFormDrawer'
}
</script>

<style scoped lang="scss">
.project-form-drawer {
  :deep(.el-form-item__label) {
    font-weight: 600;
  }
}
</style>
