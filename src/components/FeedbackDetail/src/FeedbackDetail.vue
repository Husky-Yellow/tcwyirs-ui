<script lang="ts" setup>
import { ElRadioGroup, ElRadio, ElInput, ElButton, ElEmpty, ElImage } from 'element-plus'
import { Drawer } from '@/components/Drawer'
import { FeedbackStatus, type FeedbackDetail, type FeedbackOption } from './types'

defineOptions({ name: 'FeedbackDetail' })

const props = withDefaults(
  defineProps<{
    /** 是否显示 */
    modelValue: boolean
    /** 反馈详情数据 */
    data: FeedbackDetail
    /** 反馈方式选项 */
    feedbackOptions?: FeedbackOption[]
  }>(),
  {
    modelValue: false,
    feedbackOptions: () => [
      { label: '口述法', value: 'oral' },
      { label: '采用汉', value: 'adopt' },
      { label: '暂缓投诉', value: 'defer' }
    ]
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [feedbackWay?: string, reply?: string]
  cancel: []
}>()

// 状态样式配置
const statusStyleMap = {
  [FeedbackStatus.PENDING]: { color: '#909399', text: '待处理' },
  [FeedbackStatus.RESOLVED]: { color: '#67C23A', text: '已结束' },
  [FeedbackStatus.UNRESOLVED]: { color: '#F56C6C', text: '其他问题' }
}

// 获取状态样式
const getStatusStyle = (status: FeedbackStatus) => {
  return statusStyleMap[status] || { color: '#909399', text: '未知' }
}

// 反馈方式
const feedbackWay = ref('')
// 回复内容
const replyContent = ref('')

// 是否显示
const drawerVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 是否可以回复（待处理和未解决状态）
const canReply = computed(() => {
  return props.data.status === FeedbackStatus.PENDING || props.data.status === FeedbackStatus.UNRESOLVED
})

// 是否已结束
const isResolved = computed(() => {
  return props.data.status === FeedbackStatus.RESOLVED
})

// 确认
const handleConfirm = () => {
  if (canReply.value) {
    emit('confirm', feedbackWay.value, replyContent.value)
  } else {
    emit('confirm')
  }
  drawerVisible.value = false
}

// 取消
const handleCancel = () => {
  emit('cancel')
  drawerVisible.value = false
}

// 重置
const reset = () => {
  feedbackWay.value = ''
  replyContent.value = ''
}

// 监听抽屉关闭，重置表单
watch(drawerVisible, (val) => {
  if (!val) {
    reset()
  }
})
</script>

<template>
  <Drawer
    v-model="drawerVisible"
    title="反馈详情"
    size="500px"
    direction="rtl"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <!-- 反馈信息 -->
    <div class="border-b border-b-[#e4e7ed] pb-16px">
      <div class="mb-16px text-14px text-[#303133] font-500">反馈内容</div>

      <!-- 第一行：反馈状态、反馈资源、反馈时间 -->
      <div class="mb-12px flex flex-wrap">
        <div class="mb-8px flex-33.333% text-12px text-[#606266]">
          <span class="text-[#909399]">反馈状态：</span>
          <span class="inline-flex items-center gap-4px text-[#606266]">
            <span
              class="inline-block h-6px w-6px rd-50%"
              :style="{ backgroundColor: getStatusStyle(data.status).color }"
            ></span>
            {{ getStatusStyle(data.status).text }}
          </span>
        </div>
        <div class="mb-8px flex-33.333% text-12px text-[#606266]">
          <span class="text-[#909399]">反馈资源：</span>
          <span class="text-[#606266]">{{ data.resource }}</span>
        </div>
        <div class="mb-8px flex-33.333% text-12px text-[#606266]">
          <span class="text-[#909399]">反馈时间：</span>
          <span class="text-[#606266]">{{ data.time }}</span>
        </div>
      </div>

      <!-- 第二行：反馈类型 -->
      <div class="mb-12px flex flex-wrap">
        <div class="mb-8px text-12px text-[#606266]">
          <span class="text-[#909399]">反馈类型：</span>
          <span v-if="isResolved" class="inline-flex items-center gap-4px text-[#67c23a]">
            <span class="inline-block h-6px w-6px rd-50% bg-[#67c23a]"></span>
            已结束
          </span>
          <span v-else class="text-[#606266]">{{ data.type }}</span>
        </div>
      </div>

      <!-- 问题描述 -->
      <div class="mb-12px flex flex-wrap">
        <div class="mb-8px flex-100% text-12px text-[#606266]">
          <span class="text-[#909399]">问题描述：</span>
          <span class="text-[#606266]">{{ data.description || data.content }}</span>
        </div>
      </div>

      <!-- 问题截图 -->
      <div v-if="data.screenshot" class="flex flex-wrap">
        <div class="mb-8px flex-100% text-12px text-[#606266]">
          <span class="text-[#909399]">问题截图：</span>
        </div>
        <div class="mt-8px h-80px w-80px overflow-hidden rd-4px border border-[#e4e7ed]">
          <el-image
            :src="data.screenshot"
            fit="cover"
            :preview-src-list="[data.screenshot]"
            preview-teleported
            class="h-full! w-full!"
          >
            <template #error>
              <div
                class="flex h-full w-full items-center justify-center bg-[#f5f7fa] text-[#909399]"
              >
                <Icon icon="ep:picture" :size="24" />
              </div>
            </template>
          </el-image>
        </div>
      </div>
    </div>

    <!-- 反馈回复 -->
    <div class="border-b border-b-[#e4e7ed] py-16px">
      <div class="mb-16px flex items-center justify-between text-14px text-[#303133] font-500">
        <span>反馈回复</span>
        <span v-if="canReply" class="flex items-center gap-4px text-12px text-[#909399] font-400">
          <Icon icon="ep:user" :size="14" />
          处理人：刘梦楠
        </span>
      </div>

      <!-- 回复列表 -->
      <div v-if="data.replies && data.replies.length > 0">
        <div v-for="reply in data.replies" :key="reply.id" class="mb-16px last:mb-0">
          <!-- 时间戳 -->
          <div class="mb-12px text-center text-12px text-[#909399]">{{ reply.time }}</div>
          <!-- 消息内容 -->
          <div :class="['mb-8px flex', reply.isSelf ? 'justify-end' : 'justify-start']">
            <div
              :class="[
                'max-w-70% break-words rd-8px px-12px py-10px text-13px leading-1.6',
                reply.isSelf
                  ? 'border border-[#91d5ff] bg-[#e6f7ff] text-[#303133]'
                  : 'border border-[#e4e7ed] bg-[#f5f7fa] text-[#303133]'
              ]"
            >
              {{ reply.content }}
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="py-20px">
        <ElEmpty description="暂无回复" :image-size="80" />
      </div>
    </div>

    <!-- 操作区域 -->
    <div v-if="canReply" class="pt-16px">
      <div class="mb-8px text-12px text-[#909399]">是否已解决：</div>
      <div class="mb-12px">
        <ElRadioGroup v-model="feedbackWay">
          <ElRadio
            v-for="option in feedbackOptions"
            :key="option.value"
            :value="option.value"
            class="mr-16px!"
            >{{ option.label }}</ElRadio
          >
        </ElRadioGroup>
      </div>
      <div class="mt-12px">
        <ElInput
          v-model="replyContent"
          type="textarea"
          :rows="3"
          placeholder="请输入反馈回复..."
          maxlength="200"
          show-word-limit
        />
      </div>
    </div>

    <!-- 已结束状态提示 -->
    <div v-if="isResolved" class="flex items-center gap-8px pt-16px">
      <div class="text-12px text-[#909399]">是否已解决：</div>
      <div class="flex items-center gap-4px text-12px text-[#67c23a]">
        <span class="inline-block h-6px w-6px rd-50% bg-[#67c23a]"></span>
        <span>已结束</span>
      </div>
    </div>

    <template #footer>
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" @click="handleConfirm">确定</ElButton>
    </template>
  </Drawer>
</template>
