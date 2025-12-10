<template>
  <Drawer
    v-model="visible"
    :title="title"
    size="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      label-position="top"
    >
      <!-- 资源信息 -->
      <div class="form-section-title">资源信息</div>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入资源名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资源标签">
            <DynamicSelect
              v-model="formData.resourceTagId"
              :options="tagOptions"
              :loading="tagLoading"
              placeholder="请选择标签"
              @add-option="handleAddTag"
              @edit-option="handleEditTag"
              @delete-option="handleDeleteTag"
              @options-change="handleOptionsChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系人" prop="linkPerson">
            <el-input v-model="formData.linkPerson" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="linkPhone">
            <el-input v-model="formData.linkPhone" placeholder="请输入联系方式" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="归属方" prop="belong">
        <el-input v-model="formData.belong" placeholder="请输入归属方" />
      </el-form-item>

      <el-form-item label="资源介绍">
        <el-input
          v-model="formData.introduction"
          type="textarea"
          :rows="4"
          placeholder="请输入资源介绍"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="介绍封面">
        <UploadImg
          v-model="formData.coverUrl"
          :file-size="5"
          :file-type="['image/jpeg', 'image/png', 'image/jpg']"
          width="100%"
          height="120px"
        >
          <template #tip>
            <span class="text-12px text-[#909399]">支持 jpg, jpeg, png 格式，不超过 5 MB</span>
          </template>
        </UploadImg>
      </el-form-item>

      <el-form-item label="功能模块描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入功能模块描述"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 组件配置 -->
      <div class="form-section-title mt-24px">组件配置</div>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="对接方式">
            <el-select v-model="formData.componentExt.dockingType" placeholder="请选择" class="w-full">
              <el-option label="GET" :value="1" />
              <el-option label="POST" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件地址">
            <el-input v-model="formData.componentExt.componentUrl" placeholder="请输入组件地址" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="请求地址">
        <el-input v-model="formData.componentExt.requestUrl" placeholder="请输入请求地址">
          <template #prepend>
            {{ formData.componentExt.dockingType === 2 ? 'POST' : 'GET' }}
          </template>
        </el-input>
      </el-form-item>

      <!-- 输入参数 -->
      <el-form-item label="输入参数">
        <div class="w-full">
          <el-table :data="formData.componentExt.inputParamsJson" border class="mb-12px">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="参数名称" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.paramName" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="参数类型" min-width="100">
              <template #default="{ row }">
                <el-input v-model="row.paramType" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="参数描述" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.paramDesc" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="是否必填" width="100" align="center">
              <template #default="{ row }">
                <el-checkbox v-model="row.required" />
              </template>
            </el-table-column>
            <el-table-column label="参数位置" min-width="100">
              <template #default="{ row }">
                <el-input v-model="row.paramPosition" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="关联表信息" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.relTableInfo" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" fixed="right">
              <template #default="{ $index }">
                <el-button link type="primary" size="small" @click="addInputParam($index)">
                  添加
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="removeInputParam($index)"
                  :disabled="formData.componentExt.inputParamsJson!.length === 1"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button text @click="addInputParam()">
            <Icon icon="ep:plus" class="mr-4px" />
            添加一行
          </el-button>
        </div>
      </el-form-item>

      <!-- 输出参数 -->
      <el-form-item label="输出参数">
        <div class="w-full">
          <el-table :data="formData.componentExt.outputParamsJson" border class="mb-12px">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="参数名称" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.paramName" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="参数类型" min-width="100">
              <template #default="{ row }">
                <el-input v-model="row.paramType" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="参数描述" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.paramDesc" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="是否必填" width="100" align="center">
              <template #default="{ row }">
                <el-checkbox v-model="row.required" />
              </template>
            </el-table-column>
            <el-table-column label="参数位置" min-width="100">
              <template #default="{ row }">
                <el-input v-model="row.paramPosition" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="关联表信息" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.relTableInfo" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" fixed="right">
              <template #default="{ $index }">
                <el-button link type="primary" size="small" @click="addOutputParam($index)">
                  添加
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="removeOutputParam($index)"
                  :disabled="formData.componentExt.outputParamsJson!.length === 1"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button text @click="addOutputParam()">
            <Icon icon="ep:plus" class="mr-4px" />
            添加一行
          </el-button>
        </div>
      </el-form-item>

      <!-- 示例代码 -->
      <el-form-item label="示例代码">
        <el-input
          v-model="formData.componentExt.sampleCode"
          type="textarea"
          :rows="8"
          placeholder="请输入示例代码"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-8px">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="handleSave">仅保存</el-button>
        <el-button type="primary" @click="handleSaveAndPublish">新增并上架</el-button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { Drawer } from '@/components/Drawer'
import { DynamicSelect } from '@/components/DynamicSelect'
import { UploadImg } from '@/components/UploadFile'
import { Icon } from '@/components/Icon'
import { useResourceTag } from '@/hooks/web/useResourceTag'
import type { DynamicSelectOption } from '@/components/DynamicSelect'
import type { ResourceInfoSaveReqVO, ParamInfo } from '@/api/resource/info'
import { createResourceInfo, updateResourceInfo } from '@/api/resource/info'

defineOptions({ name: 'SubassemblyForm' })

// Props
interface Props {
  modelValue: boolean
  data?: ResourceInfoSaveReqVO | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  data: null,
  isEdit: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

// 使用标签管理 Hook
const {
  tagOptions,
  loading: tagLoading,
  addTag,
  editTag,
  deleteTag,
  handleOptionsChange
} = useResourceTag()

// 表单引用
const formRef = ref<FormInstance>()

// 创建空参数
const createEmptyParam = (): ParamInfo => ({
  paramName: '',
  paramType: '',
  paramDesc: '',
  required: false,
  paramPosition: '',
  relTableInfo: ''
})

// 表单数据（完全符合 ResourceInfoSaveReqVO 结构）
const formData = ref<ResourceInfoSaveReqVO>({
  name: '',
  type: 3, // 3-组件资源
  resourceTagId: undefined,
  description: '',
  introduction: '',
  coverUrl: '',
  linkPerson: '',
  linkPhone: '',
  belong: '',
  componentExt: {
    dockingType: 1, // 默认 GET
    componentUrl: '',
    requestUrl: '',
    inputParamsJson: [createEmptyParam()],
    outputParamsJson: [createEmptyParam()],
    sampleCode: ''
  }
})

// 处理添加标签
const handleAddTag = async (option: DynamicSelectOption) => {
  const newTagId = await addTag(option)
  if (newTagId) {
    await nextTick()
    formData.value.resourceTagId = newTagId
  }
}

// 处理编辑标签
const handleEditTag = async (option: DynamicSelectOption) => {
  await editTag(option)
}

// 处理删除标签
const handleDeleteTag = async (value: string | number) => {
  await deleteTag(value)
}

// 双向绑定
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 标题
const title = computed(() => (props.isEdit ? '编辑组件资源' : '新建组件资源'))

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
  linkPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  linkPhone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  belong: [{ required: true, message: '请输入归属方', trigger: 'blur' }]
}

// 添加输入参数
const addInputParam = (index?: number) => {
  const newParam = createEmptyParam()
  if (index !== undefined) {
    formData.value.componentExt!.inputParamsJson!.splice(index + 1, 0, newParam)
  } else {
    formData.value.componentExt!.inputParamsJson!.push(newParam)
  }
}

// 删除输入参数
const removeInputParam = (index: number) => {
  if (formData.value.componentExt!.inputParamsJson!.length > 1) {
    formData.value.componentExt!.inputParamsJson!.splice(index, 1)
  }
}

// 添加输出参数
const addOutputParam = (index?: number) => {
  const newParam = createEmptyParam()
  if (index !== undefined) {
    formData.value.componentExt!.outputParamsJson!.splice(index + 1, 0, newParam)
  } else {
    formData.value.componentExt!.outputParamsJson!.push(newParam)
  }
}

// 删除输出参数
const removeOutputParam = (index: number) => {
  if (formData.value.componentExt!.outputParamsJson!.length > 1) {
    formData.value.componentExt!.outputParamsJson!.splice(index, 1)
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    name: '',
    type: 3,
    resourceTagId: undefined,
    description: '',
    introduction: '',
    coverUrl: '',
    linkPerson: '',
    linkPhone: '',
    belong: '',
    componentExt: {
      dockingType: 1,
      componentUrl: '',
      requestUrl: '',
      inputParamsJson: [createEmptyParam()],
      outputParamsJson: [createEmptyParam()],
      sampleCode: ''
    }
  }
  formRef.value?.clearValidate()
}

// 监听外部数据变化
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      formData.value = {
        id: newData.id,
        name: newData.name || '',
        type: newData.type || 3,
        resourceTagId: newData.resourceTagId,
        description: newData.description || '',
        introduction: newData.introduction || '',
        coverUrl: newData.coverUrl || '',
        linkPerson: newData.linkPerson || '',
        linkPhone: newData.linkPhone || '',
        belong: newData.belong || '',
        componentExt: {
          dockingType: newData.componentExt?.dockingType || 1,
          componentUrl: newData.componentExt?.componentUrl || '',
          requestUrl: newData.componentExt?.requestUrl || '',
          inputParamsJson: newData.componentExt?.inputParamsJson || [createEmptyParam()],
          outputParamsJson: newData.componentExt?.outputParamsJson || [createEmptyParam()],
          sampleCode: newData.componentExt?.sampleCode || ''
        }
      }
    } else {
      resetForm()
    }
  },
  { immediate: true, deep: true }
)

// 关闭抽屉
const handleClose = () => {
  resetForm()
  visible.value = false
}

// 仅保存
const handleSave = async () => {
  try {
    await formRef.value?.validate()

    if (props.isEdit && formData.value.id) {
      await updateResourceInfo(formData.value)
      ElMessage.success('更新成功!')
    } else {
      await createResourceInfo(formData.value)
      ElMessage.success('创建成功!')
    }

    visible.value = false
    emit('success')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

// 新增并上架
const handleSaveAndPublish = async () => {
  try {
    await formRef.value?.validate()
    const submitData: ResourceInfoSaveReqVO = {
      ...formData.value,
      publishDirectly: true
    }

    if (props.isEdit && submitData.id) {
      await updateResourceInfo(submitData)
      ElMessage.success('更新并上架成功!')
    } else {
      await createResourceInfo(submitData)
      ElMessage.success('创建并上架成功!')
    }

    visible.value = false
    emit('success')
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 暴露方法
defineExpose({
  resetForm
})
</script>

<style scoped lang="scss">
.form-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #409eff;
}

.mt-24px {
  margin-top: 24px;
}
</style>
