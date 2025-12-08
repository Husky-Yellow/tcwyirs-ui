<template>
    <div class="flex items-center justify-between">
      <div>评分管理</div>
      <!-- 操作按钮区域 -->
      <div class="mb-16px flex items-center gap-12px">
        <el-button type="primary" @click="handleAdd">新增评分标签</el-button>
        <el-button @click="handleOpenConfig">配置权重分数</el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="mb-16px">
      <SearchForm
        :model="tagSearchModel"
        :cols-per-row="3"
        label-width="90px"
        @search="handleTagSearch"
        @reset="handleTagSearchReset"
      >
        <template #default="{ model }">
          <el-form-item label="标签名称">
            <el-input v-model="model.name" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="分数类型">
            <el-select v-model="model.scoreType" placeholder="全部" clearable>
              <el-option label="上升" value="1" />
              <el-option label="下降" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="分数权重">
            <el-select v-model="model.weight" placeholder="全部" clearable>
              <el-option label="高权重" value="1" />
              <el-option label="中权重" value="2" />
              <el-option label="低权重" value="3" />
            </el-select>
          </el-form-item>
        </template>
      </SearchForm>
    </div>

    <!-- 卡片列表 -->
    <div class="mb-16px">
      <TagCardList
        v-model="selectedTagId"
        :data="tagCardData"
        @edit="handleTagEdit"
        @delete="handleTagDelete"
        @status-change="handleTagStatusChange"
      />
    </div>

    <!-- 配置分数抽屉 -->
    <ScoreConfigDrawer
      ref="scoreConfigDrawerRef"
      @confirm="handleConfigConfirm"
      @cancel="handleConfigCancel"
    />

    <!-- 新增/编辑标签抽屉 -->
    <TagFormDrawer
      ref="tagFormDrawerRef"
      @confirm="handleTagFormConfirm"
      @cancel="handleTagFormCancel"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { SearchForm } from '@/components/SearchForm'
import TagCardList from './components/TagCardList.vue'
import ScoreConfigDrawer from './components/ScoreConfigDrawer.vue'
import type { ScoreConfig } from './components/ScoreConfigDrawer.vue'
import TagFormDrawer from './components/TagFormDrawer.vue'
import type { TagFormData } from './components/TagFormDrawer.vue'
import {
  getScoreTagList,
  createScoreTag,
  updateScoreTag,
  deleteScoreTag,
  type ScoreTagVO
} from '@/api/resource/scoreTag'

defineOptions({ name: 'ScorePage' })

// 常量定义
const SCORE_TYPE_MAP = { 1: '上升', 2: '下降' } as const
const WEIGHT_MAP = { 1: '高权重', 2: '中权重', 3: '低权重' } as const
const SCORE_TYPE_REVERSE_MAP = { 上升: '1', 下降: '2' } as const
const WEIGHT_REVERSE_MAP = { 高权重: '1', 中权重: '2', 低权重: '3' } as const

type Recordable = Record<string, any>
interface TagCardItem {
  // 唯一标识
  id: string | number
  // 标题
  title: string
  // 图标
  icon?: string
  // 状态
  status: '启用中' | '停用'
  // 分数类型
  scoreType: string
  // 分数权重
  weight: string
  // 其他自定义字段
  [key: string]: any
}

// 抽屉 ref
const scoreConfigDrawerRef = ref<InstanceType<typeof ScoreConfigDrawer>>()
const tagFormDrawerRef = ref<InstanceType<typeof TagFormDrawer>>()

// 状态
const loading = ref(false)
const selectedTagId = ref<number>()

// 分数配置
const scoreConfig = ref<ScoreConfig>({
  initScore: '60',
  scoreType: '1',
  highWeightScore: 10,
  mediumWeightScore: 5,
  lowWeightScore: 2
})

// 标签数据
const tagCardData = ref<TagCardItem[]>([])
const allTagCardData = ref<TagCardItem[]>([])

// 搜索
const tagSearchModel = ref({
  name: '',
  scoreType: '',
  weight: ''
})

// 数据转换：ScoreTagVO -> TagCardItem
const convertToTagCardItem = (tag: ScoreTagVO): TagCardItem => ({
  id: tag.id!,
  title: tag.name,
  icon: 'ep:document',
  status: tag.showFlag ? '启用中' : '停用',
  scoreType: SCORE_TYPE_MAP[tag.type] || '上升',
  weight: tag.weight ? WEIGHT_MAP[tag.weight] : '低权重'
})

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const data = await getScoreTagList(tagSearchModel.value)
    tagCardData.value = data.map(convertToTagCardItem)
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleTagSearch = (values: Recordable) => {
  tagSearchModel.value.name = values.name
  tagSearchModel.value.scoreType = values.scoreType
  tagSearchModel.value.weight = values.weight
  loadData()
  ElMessage.success('搜索成功!')
}

const handleTagSearchReset = () => {
  tagSearchModel.value.name = ''
  tagSearchModel.value.scoreType = ''
  tagSearchModel.value.weight = ''
  loadData()
}

// 打开配置分数抽屉
const handleOpenConfig = () => {
  scoreConfigDrawerRef.value?.open(scoreConfig.value)
}

// 新增标签
const handleAdd = () => {
  tagFormDrawerRef.value?.open()
}

// 编辑标签
const handleTagEdit = (item: TagCardItem) => {
  const formData: TagFormData = {
    id: item.id,
    name: item.title,
    confId: '1',
    type: SCORE_TYPE_REVERSE_MAP[item.scoreType as keyof typeof SCORE_TYPE_REVERSE_MAP] || '1',
    weight: WEIGHT_REVERSE_MAP[item.weight as keyof typeof WEIGHT_REVERSE_MAP] || '1',
    showFlag: item.status === '启用中'
  }
  tagFormDrawerRef.value?.open(formData)
}

// 删除标签
const handleTagDelete = async (item: TagCardItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除 "${item.title}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteScoreTag(item.id)
    ElMessage.success('删除成功!')
    await loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 启用/停用标签 - 使用 updateScoreTag
const handleTagStatusChange = async (item: TagCardItem, status: boolean) => {
  try {
    // 从原始数据中找到对应的标签
    const originalTag = tagCardData.value.find((tag) => tag.id === item.id)
    if (!originalTag) {
      ElMessage.error('标签数据未找到')
      return
    }

    // 更新标签状态
    await updateScoreTag({
      ...originalTag,
      showFlag: status
    })

    ElMessage.success(`${item.title}: 已${status ? '启用' : '停用'}`)
    await loadData()
  } catch (error) {
    console.error('状态切换失败:', error)
    ElMessage.error('状态切换失败')
  }
}

// 配置分数
const handleConfigConfirm = (data: ScoreConfig) => {
  scoreConfig.value = { ...data }
  ElMessage.success('配置保存成功!')
}

const handleConfigCancel = () => {
  console.log('取消配置')
}

// 标签表单
const handleTagFormConfirm = async (data: TagFormData) => {
  try {
    if (data.id) {
      await updateScoreTag(data)
      ElMessage.success('编辑成功!')
    } else {
      await createScoreTag(data)
      ElMessage.success('新增成功!')
    }
    await loadData()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

const handleTagFormCancel = () => {
  console.log('取消保存')
}

// 页面加载
onMounted(() => {
  loadData()
})
</script>
