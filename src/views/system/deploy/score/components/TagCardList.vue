<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
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


defineOptions({ name: 'TagCardList' })

const props = defineProps({
  data: { type: Array as PropType<TagCardItem[]>, default: () => [] },
  modelValue: propTypes.oneOfType([String, Number])
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  edit: [item: TagCardItem]
  delete: [item: TagCardItem]
  statusChange: [item: TagCardItem, status: boolean]
}>()

const selectedId = computed({
  get: () => props.modelValue,
  set: (val: string | number | undefined) => val && emit('update:modelValue', val)
})

const handleAction = (type: 'edit' | 'delete', item: TagCardItem, e: MouseEvent) => {
  e.stopPropagation()
  if (type === 'edit') {
    emit('edit', item)
  } else {
    emit('delete', item)
  }
}

const weightClasses: Record<string, string> = {
  高权重: 'bg-[#E8F4FF] text-[#1890FF]',
  中权重: 'bg-[#EAFDFF] text-[#25C8DA]',
  低权重: 'bg-[#F7F9FB] text-[#858F98]'
}

const isActive = (status: string) => status === '启用中'
</script>

<template>
  <div class="w-full">
    <div class="grid grid-cols-4 gap-x-14px gap-y-12px">
      <div
        v-for="item in data"
        :key="item.id"
        class="cursor-pointer border border-[#dcdfe6] rounded-12px bg-white transition-all duration-300"
        :class="selectedId === item.id
          ? 'border-[#409eff]! shadow-[0_0_0_1px_rgba(64,158,255,0.2)]'
          : 'hover:shadow-[0_1px_6px_0_rgba(0,0,0,0.08)]'"
        @click="selectedId = item.id"
      >
        <div class="flex items-center justify-between border-b border-[#ebeef5] px-24px py-13px">
          <span class="min-w-0 flex-1 truncate text-14px text-[#303133] font-500">
            {{ item.title }}
          </span>
          <el-switch
            :model-value="isActive(item.status)"
            @change="(val: boolean) => emit('statusChange', item, val)"
            @click.stop
          />
        </div>

        <div class="flex flex-col border-b border-[#ebeef5] px-24px py-16px">
          <div class="mb-12px flex items-center text-13px">
            <span class="mr-6px flex-shrink-0 text-[#909399]">状态:</span>
            <span class="flex items-center gap-1.5" :class="isActive(item.status) ? 'text-[#409eff]' : 'text-[#909399]'">
              <span class="h-5px w-5px rounded-full" :class="isActive(item.status) ? 'bg-[#409eff]' : 'bg-[#909399]'" />
              {{ item.status }}
            </span>
          </div>
          <div class="mb-12px flex items-center text-13px">
            <span class="min-w-68px flex-shrink-0 text-[#909399]">分数类型:</span>
            <span class="text-[#606266]">{{ item.scoreType }}</span>
          </div>
          <div class="mb-12px flex items-center text-13px">
            <span class="min-w-68px flex-shrink-0 text-[#909399]">分数权重:</span>
            <span class="inline-block rounded-2px px-2 py-0.5 text-12px" :class="weightClasses[item.weight]">
              {{ item.weight }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-around py-10px">
          <Icon
            icon="ep:edit"
            :size="16"
            class="cursor-pointer text-[#909399] transition-colors duration-300 hover:text-[#409eff]"
            @click="handleAction('edit', item, $event)"
          />
          <Icon
            icon="ep:delete"
            :size="16"
            class="cursor-pointer text-[#909399] transition-colors duration-300 hover:text-[#409eff]"
            @click="handleAction('delete', item, $event)"
          />
        </div>
      </div>
    </div>

    <el-empty v-if="!data?.length" description="暂无数据" />
  </div>
</template>

