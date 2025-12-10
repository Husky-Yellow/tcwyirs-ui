<template>
  <Drawer
    v-model="visible"
    :title="title"
    size="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="top"
    >
      <!-- 资源信息 -->
      <div class="mb-24px">
        <div class="mb-16px text-16px font-600">资源信息</div>

        <!-- 资源名称与资源标签 -->
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="资源名称" prop="name" required>
              <el-input
                v-model="formData.name"
                placeholder="请输入"
                maxlength="50"
                show-word-limit
              />
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

        <!-- 归集数量、联系人 -->
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item>
              <template #label>
                归集数量
                <el-tooltip effect="dark" content="如数据库表行数" placement="top">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
              <el-input-number
                v-model="formData.dataExt.dataRow"
                :min="0"
                controls-position="right"
                class="w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="formData.linkPerson" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 联系方式、归属方 -->
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input v-model="formData.linkPhone" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属方">
              <el-input v-model="formData.belong" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 归属应用 -->
        <el-form-item label="归属应用">
          <el-input v-model="formData.dataExt.belongApp" placeholder="请输入" />
        </el-form-item>

        <!-- 资源介绍 -->
        <el-form-item label="资源介绍">
          <el-input
            v-model="formData.introduction"
            type="textarea"
            :rows="3"
            placeholder="请输入"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <!-- 介绍封面 -->
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

        <!-- 描述 -->
        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </div>

      <!-- 数据信息 -->
      <div class="mb-24px">
        <div class="mb-16px text-16px font-600">数据信息</div>
        <!-- 数据库表格式 -->
        <DynamicDataTable
          v-model="formData.dataExt.fieldsJson"
          :columns="dataTableColumns"
          title="数据库表格式"
          :min-rows="1"
        />
      </div>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="flex justify-end gap-8px">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="handleSave">仅保存</el-button>
        <el-button type="primary" @click="handleSaveAndPublish"> 新增并上架 </el-button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Drawer } from '@/components/Drawer'
import { DynamicDataTable } from '@/components/DynamicDataTable'
import { DynamicSelect } from '@/components/DynamicSelect'
import { UploadImg } from '@/components/UploadFile'
import { useResourceTag } from '@/hooks/web/useResourceTag'
import type { TableColumn } from '@/components/DynamicDataTable'
import type { DynamicSelectOption } from '@/components/DynamicSelect'
import type { ResourceInfoSaveReqVO, ResourceDataExtVO, FieldInfo } from '@/api/resource/info'
import type { ResourceTagVO } from '@/api/resource/tag'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ResourceType } from '@/api/resource/types'
defineOptions({ name: 'DataResourceForm' })

// Props
interface Props {
  modelValue: boolean
  data?: ResourceInfoSaveReqVO | null
  isEdit?: boolean
  tagList?: ResourceTagVO[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  data: null,
  isEdit: false,
  tagList: () => []
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [data: ResourceInfoSaveReqVO, publish: boolean]
}>()

// 数据表格列配置
const dataTableColumns: TableColumn[] = [
  { key: 'fieldName', label: '字段名称', width: '30%', placeholder: '请输入字段名称' },
  { key: 'fieldDesc', label: '字段介绍', width: '30%', placeholder: '请输入字段介绍' },
  { key: 'fieldType', label: '字段类型', width: '30%', placeholder: '请输入字段类型' }
]

// 使用标签管理 Hook（使用页面传入的标签列表，避免重复加载）
const {
  tagOptions,
  loading: tagLoading,
  addTag,
  editTag,
  deleteTag,
  handleOptionsChange
} = useResourceTag({
  autoLoad: false,
  initialOptions: props.tagList
})

// 表单引用
const formRef = ref()

// 表单数据（完全符合 ResourceInfoSaveReqVO 结构）
const formData = ref<ResourceInfoSaveReqVO>({
  name: '',
  type: 1, // 1-数据资源
  resourceTagId: undefined,
  description: '',
  introduction: '',
  coverUrl: '',
  linkPerson: '',
  linkPhone: '',
  belong: '',
  dataExt: {
    belongApp: '',
    dataRow: 0,
    fieldsJson: []
  }
})

// 处理添加标签
const handleAddTag = async (option: DynamicSelectOption) => {
  const newTagId = await addTag(option)
  // 添加成功后，自动选中新标签
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
const title = computed(() => (props.isEdit ? '编辑数据资源' : '新建数据资源'))

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }]
}

// 重置表单
const resetForm = () => {
  formData.value = {
    name: '',
    type: ResourceType.DATA,
    resourceTagId: undefined,
    description: '',
    introduction: '',
    coverUrl: '',
    linkPerson: '',
    linkPhone: '',
    belong: '',
    dataExt: {
      belongApp: '',
      dataRow: 0,
      fieldsJson: []
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
        type: ResourceType.DATA,
        resourceTagId: newData.resourceTagId,
        description: newData.description || '',
        introduction: newData.introduction || '',
        coverUrl: newData.coverUrl || '',
        linkPerson: newData.linkPerson || '',
        linkPhone: newData.linkPhone || '',
        belong: newData.belong || '',
        dataExt: {
          belongApp: newData.dataExt?.belongApp || '',
          dataRow: newData.dataExt?.dataRow || 0,
          fieldsJson: newData.dataExt?.fieldsJson || []
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
    emit('save', formData.value, false)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 新增并上架
const handleSaveAndPublish = async () => {
  try {
    await formRef.value?.validate()
    // 设置直接上架标志
    const submitData: ResourceInfoSaveReqVO = {
      ...formData.value,
      publishDirectly: true
    }
    emit('save', submitData, true)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 暴露方法
defineExpose({
  resetForm
})
</script>
