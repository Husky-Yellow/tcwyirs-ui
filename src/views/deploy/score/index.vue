<template>
    <div class="flex items-center justify-between">
      <div>评分管理</div>
      <!-- 操作按钮区域 -->
      <div class="mb-16px flex items-center gap-12px">
        <el-button type="primary" @click="handleAdd">新增标签</el-button>
        <el-button @click="handleOpenConfig">配置权重分数</el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="mb-16px">
      <SearchForm
        :schema="tagSearchSchema"
        :model="tagSearchModel"
        :cols-per-row="3"
        :show-expand="false"
        label-width="90px"
        @search="handleTagSearch"
        @reset="handleTagSearchReset"
      />
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
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { SearchForm } from '@/components/SearchForm'
import type { SearchFormSchema } from '@/components/SearchForm'
import { TagCardList } from '@/components/TagCardList'
import type { TagCardItem } from '@/components/TagCardList'
import ScoreConfigDrawer from './components/ScoreConfigDrawer.vue'
import type { ScoreConfig } from './components/ScoreConfigDrawer.vue'
import TagFormDrawer from './components/TagFormDrawer.vue'
import type { TagFormData } from './components/TagFormDrawer.vue'

defineOptions({ name: 'ScorePage' })

// Type definitions
type Recordable = Record<string, any>

// 抽屉 ref
const scoreConfigDrawerRef = ref<InstanceType<typeof ScoreConfigDrawer>>()
const tagFormDrawerRef = ref<InstanceType<typeof TagFormDrawer>>()

// 分数配置数据
const scoreConfig = ref<ScoreConfig>({
  category: '标签分类',
  scoreDirection: 'up',
  highWeight: 10,
  mediumWeight: 5,
  lowWeight: 2
})

// TagCardList 标签卡片列表演示
const selectedTagId = ref(1)

const tagSearchModel = ref({
  name: '',
  scoreType: '',
  weight: ''
})

const tagSearchSchema: SearchFormSchema[] = [
  {
    field: 'name',
    label: '标签名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入'
    }
  },
  {
    field: 'scoreType',
    label: '分数类型',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      options: [
        { label: '上降', value: 'up' },
        { label: '下降', value: 'down' }
      ]
    }
  },
  {
    field: 'weight',
    label: '分数权重',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      options: [
        { label: '高权重', value: 'high' },
        { label: '中权重', value: 'medium' },
        { label: '低权重', value: 'low' }
      ]
    }
  }
]

const tagCardData = ref<TagCardItem[]>([
  {
    id: 1,
    title: '资源内容丰富',
    icon: 'ep:document',
    status: '启用中',
    scoreType: '上降',
    weight: '高权重'
  },
  {
    id: 2,
    title: '操作使用便捷',
    icon: 'ep:finished',
    status: '启用中',
    scoreType: '上降',
    weight: '中权重'
  },
  {
    id: 3,
    title: '资源数据精准',
    icon: 'ep:data-line',
    status: '启用中',
    scoreType: '上降',
    weight: '中权重'
  },
  {
    id: 4,
    title: '符合需求',
    icon: 'ep:circle-check',
    status: '启用中',
    scoreType: '上降',
    weight: '低权重'
  },
  {
    id: 5,
    title: '体验不佳',
    icon: 'ep:circle-close',
    status: '启用中',
    scoreType: '下降',
    weight: '高权重'
  },
  {
    id: 6,
    title: '内容出错',
    icon: 'ep:warning',
    status: '启用中',
    scoreType: '下降',
    weight: '中权重'
  },
  {
    id: 7,
    title: '与业务场景大不匹配',
    icon: 'ep:close',
    status: '启用中',
    scoreType: '下降',
    weight: '中权重'
  },
  {
    id: 8,
    title: '数据出现报错',
    icon: 'ep:warning-filled',
    status: '停用',
    scoreType: '下降',
    weight: '低权重'
  },
  {
    id: 9,
    title: '体验不佳',
    icon: 'ep:circle-close',
    status: '启用中',
    scoreType: '下降',
    weight: '高权重'
  }
])

const handleTagSearch = (values: Recordable) => {
  console.log('标签搜索:', values)
  ElMessage.success('搜索成功!')
}

const handleTagSearchReset = () => {
  console.log('重置标签搜索')
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
    title: item.title,
    icon: item.icon,
    status: item.status,
    scoreType: item.scoreType,
    weight: item.weight,
    enabled: item.status === '启用中'
  }
  tagFormDrawerRef.value?.open(formData)
}

const handleTagDelete = (item: TagCardItem) => {
  ElMessageBox.confirm(`确定要删除 "${item.title}" 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = tagCardData.value.findIndex((t) => t.id === item.id)
      if (index > -1) {
        tagCardData.value.splice(index, 1)
        ElMessage.success('删除成功!')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const handleTagStatusChange = (item: TagCardItem, status: boolean) => {
  const tag = tagCardData.value.find((t) => t.id === item.id)
  if (tag) {
    tag.status = status ? '启用中' : '停用'
    ElMessage.success(`${item.title}: 已${status ? '启用' : '停用'}`)
  }
}

// 配置分数相关
const handleConfigConfirm = (data: ScoreConfig) => {
  scoreConfig.value = { ...data }
  console.log('配置分数:', data)
  ElMessage.success('配置保存成功!')
}

const handleConfigCancel = () => {
  console.log('取消配置')
}

// 标签表单相关
const handleTagFormConfirm = (data: TagFormData) => {
  if (data.id) {
    // 编辑
    const index = tagCardData.value.findIndex((t) => t.id === data.id)
    if (index > -1) {
      tagCardData.value[index] = {
        id: data.id,
        title: data.title,
        icon: data.icon || 'ep:document',
        status: data.enabled ? '启用中' : '停用',
        scoreType: data.scoreType,
        weight: data.weight
      }
      ElMessage.success('编辑成功!')
    }
  } else {
    // 新增
    const newId = Math.max(...tagCardData.value.map((t) => t.id || 0)) + 1
    tagCardData.value.push({
      id: newId,
      title: data.title,
      icon: data.icon || 'ep:document',
      status: data.enabled ? '启用中' : '停用',
      scoreType: data.scoreType,
      weight: data.weight
    })
    ElMessage.success('新增成功!')
  }
  console.log('保存标签:', data)
}

const handleTagFormCancel = () => {
  console.log('取消保存')
}
</script>
