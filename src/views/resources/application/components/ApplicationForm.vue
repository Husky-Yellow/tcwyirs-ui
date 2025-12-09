<template>
  <Drawer
    v-model="drawerVisible"
    :title="isEdit ? '编辑应用资源' : '新增应用资源'"
    size="720px"
    direction="rtl"
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
          <el-form-item label="资源标签" prop="tagId">
            <el-select v-model="formData.tagId" placeholder="请选择标签" class="w-full">
              <el-option label="标签一" value="1" />
              <el-option label="标签二" value="2" />
              <el-option label="标签三" value="3" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：物联网是否接入设备、应用地址 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物联网是否接入设备" prop="hasIotDevice">
            <el-radio-group v-model="formData.hasIotDevice">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用地址" prop="appUrl">
            <el-input
              v-model="formData.appUrl"
              placeholder="请输入应用地址"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：设备类型、设备数量 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备类型" prop="deviceType">
            <el-input
              v-model="formData.deviceType"
              placeholder="请输入设备类型"
              :disabled="!formData.hasIotDevice"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备数量" prop="deviceCount">
            <el-input-number
              v-model="formData.deviceCount"
              :min="0"
              :disabled="!formData.hasIotDevice"
              placeholder="请输入设备数量"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行：联系人、联系方式 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系人" prop="contactName">
            <el-input
              v-model="formData.contactName"
              placeholder="请输入联系人"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="contactPhone">
            <el-input
              v-model="formData.contactPhone"
              placeholder="请输入联系方式"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行：归属方 -->
      <el-form-item label="归属方" prop="owner">
        <el-input
          v-model="formData.owner"
          placeholder="请输入归属方"
        />
      </el-form-item>

      <!-- 第六行：资源介绍 -->
      <el-form-item label="资源介绍" prop="introduction">
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
      <el-form-item label="介绍封面" prop="coverImage">
        <div class="w-full">
          <el-upload
            v-model:file-list="coverImageList"
            :action="uploadAction"
            :before-upload="beforeImageUpload"
            :on-success="handleCoverImageSuccess"
            :on-remove="handleCoverImageRemove"
            list-type="picture-card"
            :limit="1"
          >
            <Icon icon="ep:plus" class="text-24px" />
            <template #tip>
              <div class="el-upload__tip">支持 png, jpg, jpeg 格式，不超过 5 MB</div>
            </template>
          </el-upload>
        </div>
      </el-form-item>

      <!-- 第八行：功能模块描述 -->
      <el-form-item label="功能模块描述" prop="moduleDescription">
        <el-input
          v-model="formData.moduleDescription"
          type="textarea"
          :rows="4"
          placeholder="请输入功能模块描述"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 第九行：应用资源文档 -->
      <el-form-item label="应用资源文档" prop="documents">
        <div class="w-full">
          <el-upload
            v-model:file-list="documentList"
            :action="uploadAction"
            :before-upload="beforeDocumentUpload"
            :on-success="handleDocumentSuccess"
            :on-remove="handleDocumentRemove"
            multiple
            :limit="5"
          >
            <el-button type="primary">
              <Icon icon="ep:upload" class="mr-6px" />
              上传文档
            </el-button>
            <template #tip>
              <div class="el-upload__tip">支持 pdf, doc, docx 格式，不超过 20 MB</div>
            </template>
          </el-upload>
        </div>
      </el-form-item>

      <!-- 第十行：介绍场景（包含介绍图和介绍文本） -->
      <el-form-item label="介绍场景">
        <div class="w-full space-y-12px">
          <div
            v-for="(item, index) in formData.scenarios"
            :key="index"
            class="border border-gray-200 rounded-4px border-solid p-16px"
          >
            <div class="mb-12px flex items-center justify-between">
              <span class="text-14px font-500">场景 {{ index + 1 }}</span>
              <el-button
                type="danger"
                link
                @click="removeScenario(index)"
                :disabled="formData.scenarios.length === 1"
              >
                删除
              </el-button>
            </div>
            <div class="space-y-12px">
              <div>
                <div class="mb-8px text-12px text-gray-500">介绍图</div>
                <el-upload
                  v-model:file-list="scenarioImageLists[index]"
                  :action="uploadAction"
                  :before-upload="beforeImageUpload"
                  :on-success="(response, file) => handleScenarioImageSuccess(response, file, index)"
                  :on-remove="() => handleScenarioImageRemove(index)"
                  list-type="picture-card"
                  :limit="1"
                >
                  <Icon icon="ep:plus" class="text-24px" />
                  <template #tip>
                    <div class="el-upload__tip">支持 png, jpg, jpeg 格式，不超过 5 MB</div>
                  </template>
                </el-upload>
              </div>
              <div>
                <div class="mb-8px text-12px text-gray-500">介绍文本</div>
                <el-input
                  v-model="item.text"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入介绍文本"
                  maxlength="300"
                  show-word-limit
                />
              </div>
            </div>
          </div>
          <el-button type="primary" link @click="addScenario">
            <Icon icon="ep:plus" class="mr-6px" />
            新增场景
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave(false)">保存</el-button>
        <el-button type="success" @click="handleSave(true)">直接提交上架</el-button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules, type UploadUserFile } from 'element-plus'

interface ScenarioItem {
  image: string
  text: string
}

interface FormData {
  name: string
  tagId: string
  hasIotDevice: boolean
  appUrl: string
  deviceType: string
  deviceCount: number
  contactName: string
  contactPhone: string
  owner: string
  introduction: string
  coverImage: string
  moduleDescription: string
  documents: string[]
  scenarios: ScenarioItem[]
}

interface Props {
  modelValue: boolean
  data?: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  data: null
})

const emit = defineEmits<Emits>()

const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const documentList = ref<UploadUserFile[]>([])
const coverImageList = ref<UploadUserFile[]>([])
const scenarioImageLists = ref<UploadUserFile[][]>([[]])

// 上传地址（需要根据实际情况配置）
const uploadAction = ref(import.meta.env.VITE_UPLOAD_URL || '/api/upload')

// 表单数据
const formData = reactive<FormData>({
  name: '',
  tagId: '1',
  hasIotDevice: false,
  appUrl: '',
  deviceType: '',
  deviceCount: 0,
  contactName: '',
  contactPhone: '',
  owner: '',
  introduction: '',
  coverImage: '',
  moduleDescription: '',
  documents: [],
  scenarios: [
    { image: '', text: '' }
  ]
})

// 表单验证规则
const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入资源名称', trigger: 'blur' }
  ],
  tagId: [
    { required: true, message: '请选择资源标签', trigger: 'change' }
  ],
  appUrl: [
    { required: true, message: '请输入应用地址', trigger: 'blur' }
  ],
  contactName: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  owner: [
    { required: true, message: '请输入归属方', trigger: 'blur' }
  ]
})

// 监听抽屉显示状态
watch(
  () => props.modelValue,
  (val) => {
    drawerVisible.value = val
    if (val) {
      // 重置表单
      resetForm()
      // 如果有传入数据，说明是编辑
      if (props.data) {
        isEdit.value = true
        loadFormData(props.data)
      } else {
        isEdit.value = false
      }
    }
  },
  { immediate: true }
)

// 监听抽屉关闭
watch(drawerVisible, (val) => {
  emit('update:modelValue', val)
})

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  formData.name = ''
  formData.tagId = '1'
  formData.hasIotDevice = false
  formData.appUrl = ''
  formData.deviceType = ''
  formData.deviceCount = 0
  formData.contactName = ''
  formData.contactPhone = ''
  formData.owner = ''
  formData.introduction = ''
  formData.coverImage = ''
  formData.moduleDescription = ''
  formData.documents = []
  formData.scenarios = [{ image: '', text: '' }]
  documentList.value = []
  coverImageList.value = []
  scenarioImageLists.value = [[]]
}

// 加载表单数据（编辑时）
const loadFormData = (data: any) => {
  Object.assign(formData, data)
  // 处理文档列表
  if (data.documents && Array.isArray(data.documents)) {
    documentList.value = data.documents.map((url: string, index: number) => ({
      name: `文档${index + 1}`,
      url
    }))
  }
  // 处理封面图片
  if (data.coverImage) {
    coverImageList.value = [{
      name: '封面图片',
      url: data.coverImage
    }]
  }
  // 处理场景图片
  if (data.scenarios && Array.isArray(data.scenarios)) {
    scenarioImageLists.value = data.scenarios.map((scenario: ScenarioItem, index: number) => {
      if (scenario.image) {
        return [{
          name: `场景${index + 1}图片`,
          url: scenario.image
        }]
      }
      return []
    })
  }
}

// 添加场景
const addScenario = () => {
  formData.scenarios.push({ image: '', text: '' })
  scenarioImageLists.value.push([])
}

// 删除场景
const removeScenario = (index: number) => {
  if (formData.scenarios.length > 1) {
    formData.scenarios.splice(index, 1)
    scenarioImageLists.value.splice(index, 1)
  }
}

// 图片上传前检查
const beforeImageUpload = (file: File) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
  const isAllowed = allowedTypes.includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isAllowed) {
    ElMessage.error('只能上传 png, jpg, jpeg 格式的图片!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 封面图片上传成功
const handleCoverImageSuccess = (response: any, file: any) => {
  if (response.data?.url) {
    formData.coverImage = response.data.url
    ElMessage.success('上传成功')
  }
}

// 删除封面图片
const handleCoverImageRemove = () => {
  formData.coverImage = ''
}

// 场景图片上传成功
const handleScenarioImageSuccess = (response: any, file: any, index: number) => {
  if (response.data?.url) {
    formData.scenarios[index].image = response.data.url
    ElMessage.success('上传成功')
  }
}

// 删除场景图片
const handleScenarioImageRemove = (index: number) => {
  formData.scenarios[index].image = ''
}

// 文档上传前检查
const beforeDocumentUpload = (file: File) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  const isAllowed = allowedTypes.includes(file.type)
  const isLt20M = file.size / 1024 / 1024 < 20

  if (!isAllowed) {
    ElMessage.error('只能上传 pdf, doc, docx 格式的文件!')
    return false
  }
  if (!isLt20M) {
    ElMessage.error('文件大小不能超过 20MB!')
    return false
  }
  return true
}

// 文档上传成功
const handleDocumentSuccess = (response: any, file: any) => {
  if (response.data?.url) {
    formData.documents.push(response.data.url)
    ElMessage.success('上传成功')
  }
}

// 删除文档
const handleDocumentRemove = (file: any) => {
  const index = formData.documents.findIndex((url) => url === file.url)
  if (index > -1) {
    formData.documents.splice(index, 1)
  }
}

// 关闭抽屉
const handleClose = () => {
  drawerVisible.value = false
}

// 保存
const handleSave = async (publish: boolean) => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // TODO: 调用 API 保存数据
    const action = publish ? '提交上架' : '保存'
    ElMessage.success(`${action}成功!`)

    // 关闭抽屉并触发成功事件
    drawerVisible.value = false
    emit('success')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped lang="scss">
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 20px;
}
</style>
