<template>
  <Drawer
    v-model="visible"
    :title="title"
    size="720px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      label-position="top"
    >
      <!-- 第一行：资源名称、资源标签 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="资源名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入资源名称"
              maxlength="100"
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

      <!-- 第二行：物联网是否接入设备、设备地址 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物联网是否接入设备">
            <el-radio-group v-model="formData.appExt.connDeviceFlag">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备地址">
            <el-input
              v-model="formData.appExt.deviceAddr"
              placeholder="请输入设备地址"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：设备类型、设备数量 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备类型">
            <el-input-number
              v-model="formData.appExt.deviceType"
              :min="0"
              placeholder="请输入设备类型"
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备数量">
            <el-input-number
              v-model="formData.appExt.deviceNum"
              :min="0"
              placeholder="请输入设备数量"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行：联系人、联系方式 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系人" prop="linkPerson">
            <el-input
              v-model="formData.linkPerson"
              placeholder="请输入联系人"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="linkPhone">
            <el-input
              v-model="formData.linkPhone"
              placeholder="请输入联系方式"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行：归属方 -->
      <el-form-item label="归属方" prop="belong">
        <el-input
          v-model="formData.belong"
          placeholder="请输入归属方"
        />
      </el-form-item>

      <!-- 第六行：资源介绍 -->
      <el-form-item label="资源介绍">
        <el-input
          v-model="formData.introduction"
          type="textarea"
          :rows="3"
          placeholder="请输入资源介绍"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 第七行：介绍封面 -->
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

      <!-- 第八行：功能模块描述 -->
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

      <!-- 第九行:应用资源文档 -->
      <el-form-item label="应用资源文档">
        <UploadFile
          v-model="formData.appExt.docFileIds"
          :file-type="['pdf', 'doc', 'docx']"
          :file-size="20"
          :limit="5"
        />
      </el-form-item>

      <!-- 第十行：介绍场景 -->
      <el-form-item label="介绍场景">
        <div class="w-full space-y-12px">
          <div
            v-for="(scene, index) in formData.appExt.introScenes"
            :key="index"
            class="border border-gray-200 rounded-4px border-solid p-16px"
          >
            <div class="mb-12px flex items-center justify-between">
              <span class="text-14px font-500">场景 {{ index + 1 }}</span>
              <el-button
                type="danger"
                link
                @click="removeScene(index)"
                :disabled="formData.appExt.introScenes!.length === 1"
              >
                删除
              </el-button>
            </div>
            <div class="space-y-12px">
              <div>
                <div class="mb-8px text-12px text-gray-500">介绍图</div>
                <UploadImg
                  v-model="scene.imgUrl"
                  :file-size="5"
                  :file-type="['image/jpeg', 'image/png', 'image/jpg']"
                  width="100%"
                  height="120px"
                >
                  <template #tip>
                    <span class="text-12px text-[#909399]">支持 jpg, jpeg, png 格式，不超过 5 MB</span>
                  </template>
                </UploadImg>
              </div>
              <div>
                <div class="mb-8px text-12px text-gray-500">介绍文本</div>
                <el-input
                  v-model="scene.introText"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入介绍文本"
                  maxlength="300"
                  show-word-limit
                />
              </div>
            </div>
          </div>
          <el-button type="primary" link @click="addScene">
            <Icon icon="ep:plus" class="mr-6px" />
            新增场景
          </el-button>
        </div>
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
import { UploadImg, UploadFile } from '@/components/UploadFile'
import { Icon } from '@/components/Icon'
import { useResourceTag } from '@/hooks/web/useResourceTag'
import type { DynamicSelectOption } from '@/components/DynamicSelect'
import type { ResourceInfoSaveReqVO, ResourceAppExtVO, IntroScene } from '@/api/resource/info'
import type { ResourceTagVO } from '@/api/resource/tag'
import { createResourceInfo, updateResourceInfo } from '@/api/resource/info'

defineOptions({ name: 'ApplicationForm' })

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
  success: []
}>()

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
const formRef = ref<FormInstance>()

// 表单数据（完全符合 ResourceInfoSaveReqVO 结构）
const formData = ref<ResourceInfoSaveReqVO>({
  name: '',
  type: 2, // 2-应用资源
  resourceTagId: undefined,
  description: '',
  introduction: '',
  coverUrl: '',
  linkPerson: '',
  linkPhone: '',
  belong: '',
  appExt: {
    connDeviceFlag: false,
    deviceAddr: '',
    deviceType: undefined,
    deviceNum: 0,
    docFileIds: '',
    introScenes: [
      { imgUrl: '', introText: '' }
    ]
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
const title = computed(() => (props.isEdit ? '编辑应用资源' : '新建应用资源'))

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
  linkPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  linkPhone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
  ],
  belong: [{ required: true, message: '请输入归属方', trigger: 'blur' }]
}

// 重置表单
const resetForm = () => {
  formData.value = {
    name: '',
    type: 2,
    resourceTagId: undefined,
    description: '',
    introduction: '',
    coverUrl: '',
    linkPerson: '',
    linkPhone: '',
    belong: '',
    appExt: {
      connDeviceFlag: false,
      deviceAddr: '',
      deviceType: undefined,
      deviceNum: 0,
      docFileIds: '',
      introScenes: [
        { imgUrl: '', introText: '' }
      ]
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
        type: newData.type || 2,
        resourceTagId: newData.resourceTagId,
        description: newData.description || '',
        introduction: newData.introduction || '',
        coverUrl: newData.coverUrl || '',
        linkPerson: newData.linkPerson || '',
        linkPhone: newData.linkPhone || '',
        belong: newData.belong || '',
        appExt: {
          connDeviceFlag: newData.appExt?.connDeviceFlag || false,
          deviceAddr: newData.appExt?.deviceAddr || '',
          deviceType: newData.appExt?.deviceType,
          deviceNum: newData.appExt?.deviceNum || 0,
          docFileIds: newData.appExt?.docFileIds || '',
          introScenes: newData.appExt?.introScenes || [{ imgUrl: '', introText: '' }]
        }
      }
    } else {
      resetForm()
    }
  },
  { immediate: true, deep: true }
)

// 添加场景
const addScene = () => {
  if (!formData.value.appExt!.introScenes) {
    formData.value.appExt!.introScenes = []
  }
  formData.value.appExt!.introScenes!.push({ imgUrl: '', introText: '' })
}

// 删除场景
const removeScene = (index: number) => {
  if (formData.value.appExt!.introScenes!.length > 1) {
    formData.value.appExt!.introScenes!.splice(index, 1)
  }
}

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
