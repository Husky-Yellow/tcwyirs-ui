<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import type { TagCardItem } from './types'

defineOptions({ name: 'TagCardList' })

const props = defineProps({
  // 卡片数据
  data: {
    type: Array as PropType<TagCardItem[]>,
    default: () => []
  },
  // 是否显示单选按钮
  showRadio: propTypes.bool.def(true),
  // 当前选中的卡片ID
  modelValue: propTypes.oneOfType([String, Number]),
  // 每行显示的卡片数量
  colsPerRow: propTypes.number.def(4),
  // 是否显示操作按钮
  showActions: propTypes.bool.def(true),
  // 是否显示状态开关
  showStatusSwitch: propTypes.bool.def(true)
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'edit': [item: TagCardItem]
  'delete': [item: TagCardItem]
  'statusChange': [item: TagCardItem, status: boolean]
}>()

// 选中的卡片
const selectedId = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 处理卡片选中
const handleSelectCard = (item: TagCardItem) => {
  if (props.showRadio) {
    selectedId.value = item.id
  }
}

// 处理状态切换
const handleStatusChange = (item: TagCardItem, value: boolean, e: Event) => {
  e.stopPropagation()
  emit('statusChange', item, value)
}

// 编辑
const handleEdit = (item: TagCardItem, e: Event) => {
  e.stopPropagation()
  emit('edit', item)
}

// 删除
const handleDelete = (item: TagCardItem, e: Event) => {
  e.stopPropagation()
  emit('delete', item)
}

// 获取权重颜色类
const getWeightClass = (weight: string) => {
  const weightMap: Record<string, string> = {
    '高权重': 'high',
    '中权重': 'medium',
    '低权重': 'low'
  }
  return weightMap[weight] || 'medium'
}

// 判断是否启用状态
const isActive = (status: string) => {
  return status === '启用中'
}
</script>

<template>
  <div class="tag-card-list">
    <div
      class="tag-card-list-grid"
      :style="{
        gridTemplateColumns: `repeat(${colsPerRow}, 1fr)`
      }"
    >
      <el-card
        v-for="item in data"
        :key="item.id"
        shadow="hover"
        class="tag-card"
        :class="{ 'is-selected': showRadio && selectedId === item.id }"
        @click="handleSelectCard(item)"
      >
        <!-- 卡片头部 -->
        <template #header>
          <div class="tag-card-header">
            <div class="tag-card-header-title">
              <Icon v-if="item.icon" :icon="item.icon" :size="20" color="#409EFF" />
              <span class="tag-card-title">{{ item.title }}</span>
            </div>

            <!-- 状态开关 (右上角) -->
            <el-switch
              v-if="showStatusSwitch"
              :model-value="isActive(item.status)"
              @change="(val) => handleStatusChange(item, val, $event)"
              @click.stop
            />

            <!-- 单选按钮 (右上角) - 备用 -->
            <el-radio
              v-else-if="showRadio"
              :model-value="selectedId"
              :value="item.id"
              @change="handleSelectCard(item)"
            >
              <span></span>
            </el-radio>
          </div>
        </template>

        <!-- 卡片内容 -->
        <div class="tag-card-content">
          <div class="tag-card-row">
            <span class="tag-card-label">状态:</span>
            <el-tag :type="isActive(item.status) ? 'success' : 'info'" size="small">
              {{ item.status }}
            </el-tag>
          </div>

          <div class="tag-card-row">
            <span class="tag-card-label">分数类型:</span>
            <span class="tag-card-value">{{ item.scoreType }}</span>
          </div>

          <div class="tag-card-row">
            <span class="tag-card-label">分数权重:</span>
            <span
              class="tag-card-weight"
              :class="`tag-card-weight--${getWeightClass(item.weight)}`"
            >
              {{ item.weight }}
            </span>
          </div>
        </div>

        <!-- 卡片底部操作 -->
        <template v-if="showActions" #footer>
          <div class="tag-card-footer">
            <el-button text @click="handleEdit(item, $event)">
              <Icon icon="ep:edit" :size="16" class="mr-4px" />
            </el-button>
            <el-button text @click="handleDelete(item, $event)">
              <Icon icon="ep:delete" :size="16" class="mr-4px" />
            </el-button>
          </div>
        </template>
      </el-card>
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!data || data.length === 0" description="暂无数据" />
  </div>
</template>

<style lang="scss" scoped>
.tag-card-list {
  width: 100%;

  &-grid {
    display: grid;
    gap: 16px;
  }
}

.tag-card {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    :deep(.el-card__header) {
      border-bottom-color: var(--el-color-primary);
    }
  }

  &.is-selected {
    :deep(.el-card) {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }
  }

  :deep(.el-card__header) {
    padding: 12px 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-card__body) {
    padding: 16px;
  }

  :deep(.el-card__footer) {
    padding: 8px 16px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    &-title {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }
  }

  &-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &-row {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  &-label {
    color: var(--el-text-color-secondary);
    margin-right: 8px;
    min-width: 70px;
  }

  &-value {
    color: var(--el-text-color-primary);
  }

  &-weight {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;

    &--high {
      background: #fef0f0;
      color: #f56c6c;
    }

    &--medium {
      background: #ecf5ff;
      color: #409eff;
    }

    &--low {
      background: #f0f9ff;
      color: #67c23a;
    }
  }

  &-footer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;

    :deep(.el-button) {
      padding: 4px 8px;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
