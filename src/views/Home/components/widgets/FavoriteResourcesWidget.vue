<template>
  <AppCard class="mt-16px">
    <template #header>
      <div class="py-11px px-20px flex justify-between items-center">
        <span>{{ title }}</span>
        <el-link v-if="showViewAll" type="primary" :underline="false">全部</el-link>
      </div>
    </template>

    <el-row :gutter="16" class="mb-16px">
      <el-col :span="12">
        <div class="stat-item">
          <div class="text-14px text-gray-400 mb-8px">最近浏览</div>
          <div class="text-24px font-600">{{ favoriteResources.recent }}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="stat-item">
          <div class="text-14px text-gray-400 mb-8px">全部数量</div>
          <div class="text-24px font-600">{{ favoriteResources.total }}</div>
        </div>
      </el-col>
    </el-row>

    <div class="favorite-list">
      <div
        v-for="item in favoriteList"
        :key="item.id"
        class="favorite-item flex items-center py-8px cursor-pointer hover:bg-gray-50 transition-colors"
        @click="handleClick(item)"
      >
        <Icon icon="carbon:user-avatar" class="text-20px text-primary mr-8px" />
        <span class="text-14px">{{ item.name }}</span>
      </div>
    </div>
  </AppCard>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Icon } from '@/components/Icon'
import { AppCard } from '@/components/AppCard'
import { FAVORITE_RESOURCES, FAVORITE_LIST } from '../../mock/data'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'FavoriteResourcesWidget' })

interface Props {
  title?: string
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '我收藏的资源',
  showViewAll: true
})

const favoriteResources = reactive({ ...FAVORITE_RESOURCES })
const favoriteList = ref([...FAVORITE_LIST])

const handleClick = (item: any) => {
  ElMessage.info(`打开: ${item.name}`)
}
</script>
