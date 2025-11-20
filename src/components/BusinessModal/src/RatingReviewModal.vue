<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import type { RatingTag, RatingReviewFormData, RatingReviewResult } from './types'

defineOptions({ name: 'RatingReviewModal' })

const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('评分/评论'),
  maxLength: propTypes.number.def(200),
  minSelection: propTypes.number.def(1),
  positiveTags: {
    type: Array as PropType<RatingTag[]>,
    default: () => [
      { label: '资源内容丰富', value: 'content_rich', type: 'positive' },
      { label: '操作使用便捷', value: 'easy_to_use', type: 'positive' },
      { label: '资源数据精准', value: 'accurate_data', type: 'positive' },
      { label: '符合日常需求', value: 'meets_needs', type: 'positive' },
      { label: '这是一个好评', value: 'good_review', type: 'positive' }
    ]
  },
  negativeTags: {
    type: Array as PropType<RatingTag[]>,
    default: () => [
      { label: '体验不佳', value: 'bad_experience', type: 'negative' },
      { label: '内容出错', value: 'content_error', type: 'negative' },
      { label: '与业务场景太不匹配', value: 'not_match', type: 'negative' },
      { label: '数据出现报错', value: 'data_error', type: 'negative' }
    ]
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: RatingReviewResult]
  cancel: []
}>()

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('rating-review-modal')

// 内部状态
const formData = ref<RatingReviewFormData>({
  tags: [],
  review: ''
})

const errorMessage = ref<string>('')

// 双向绑定对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 计算字符数
const currentLength = computed(() => formData.value.review.length)

// 是否可以提交
const canSubmit = computed(() => {
  return formData.value.tags.length >= props.minSelection || formData.value.review.trim().length > 0
})

// 显示错误提示
const showError = computed(() => {
  return errorMessage.value !== ''
})

// 切换标签选择
const toggleTag = (tagValue: string) => {
  const index = formData.value.tags.indexOf(tagValue)
  if (index > -1) {
    formData.value.tags.splice(index, 1)
  } else {
    formData.value.tags.push(tagValue)
  }
  // 清除错误信息
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

// 检查标签是否被选中
const isTagSelected = (tagValue: string) => {
  return formData.value.tags.includes(tagValue)
}

// 获取所有标签(正面+负面)
const allTags = computed(() => {
  return [...props.positiveTags, ...props.negativeTags]
})

// 获取已选择的标签对象列表
const selectedTagObjects = computed(() => {
  return formData.value.tags
    .map((tagValue) => allTags.value.find((tag) => tag.value === tagValue))
    .filter((tag): tag is RatingTag => tag !== undefined)
})

// 移除已选择的标签
const removeTag = (tagValue: string) => {
  const index = formData.value.tags.indexOf(tagValue)
  if (index > -1) {
    formData.value.tags.splice(index, 1)
  }
}

// 处理提交
const handleSubmit = () => {
  // 验证
  if (!canSubmit.value) {
    errorMessage.value = '发布失败,请至少选择一个标签或输入评论'
    return
  }

  emit('submit', {
    tags: formData.value.tags,
    review: formData.value.review
  })

  // 重置表单
  resetForm()
  dialogVisible.value = false
}

// 处理取消
const handleCancel = () => {
  resetForm()
  emit('cancel')
  dialogVisible.value = false
}

// 重置表单
const resetForm = () => {
  formData.value = {
    tags: [],
    review: ''
  }
  errorMessage.value = ''
}

// 监听对话框关闭时重置表单
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<template>
  <Dialog
    v-model="dialogVisible"
    :title="title"
    width="600px"
    max-height="600px"
    :class="prefixCls"
  >
    <div :class="`${prefixCls}__content`">
      <!-- 正面标签选择区 -->
      <div :class="`${prefixCls}__section`">
        <div :class="`${prefixCls}__section-title`">标签选择</div>
        <div :class="`${prefixCls}__tags`">
          <div
            v-for="tag in positiveTags"
            :key="tag.value"
            :class="[
              `${prefixCls}__tag`,
              `${prefixCls}__tag--positive`,
              { [`${prefixCls}__tag--selected`]: isTagSelected(tag.value) }
            ]"
            @click="toggleTag(tag.value)"
          >
            {{ tag.label }}
          </div>
        </div>
      </div>

      <!-- 负面标签选择区 -->
      <div :class="`${prefixCls}__section`">
        <div :class="`${prefixCls}__section-title`">标签选择</div>
        <div :class="`${prefixCls}__tags`">
          <div
            v-for="tag in negativeTags"
            :key="tag.value"
            :class="[
              `${prefixCls}__tag`,
              `${prefixCls}__tag--negative`,
              { [`${prefixCls}__tag--selected`]: isTagSelected(tag.value) }
            ]"
            @click="toggleTag(tag.value)"
          >
            {{ tag.label }}
          </div>
        </div>
      </div>

      <!-- 评论输入区 -->
      <div :class="`${prefixCls}__section`">
        <ElInput
          v-model="formData.review"
          type="textarea"
          :rows="6"
          :maxlength="maxLength"
          placeholder="请输入评论"
          :class="`${prefixCls}__textarea`"
          show-word-limit
        />
        <div :class="`${prefixCls}__counter`"> {{ currentLength }} / {{ maxLength }} </div>
      </div>

      <!-- 已选择标签显示区 -->
      <div v-if="selectedTagObjects.length > 0" :class="`${prefixCls}__section`">
        <div :class="`${prefixCls}__section-title`"> 已选择 ({{ selectedTagObjects.length }}) </div>
        <div :class="`${prefixCls}__selected-tags`">
          <div
            v-for="tag in selectedTagObjects"
            :key="tag.value"
            :class="[`${prefixCls}__selected-tag`, `${prefixCls}__selected-tag--${tag.type}`]"
          >
            <span :class="`${prefixCls}__selected-tag-label`">{{ tag.label }}</span>
            <Icon
              icon="ep:close"
              :size="14"
              :class="`${prefixCls}__selected-tag-close`"
              @click="removeTag(tag.value)"
            />
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="showError" :class="`${prefixCls}__error`">
        {{ errorMessage }}
      </div>
    </div>

    <template #footer>
      <div :class="`${prefixCls}__footer`">
        <ElButton @click="handleCancel">取 消</ElButton>
        <ElButton type="primary" :disabled="!canSubmit" @click="handleSubmit"> 发 布 </ElButton>
      </div>
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-rating-review-modal;

.#{$prefix-cls} {
  &__content {
    padding: 10px 0;
  }

  &__section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__tag {
    padding: 6px 16px;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
    border: 1px solid transparent;

    &--positive {
      color: #4080ff;
      background-color: #f0f5ff;
      border-color: #f0f5ff;

      &:hover {
        background-color: #e6f0ff;
        border-color: #4080ff;
      }

      &.#{$prefix-cls}__tag--selected {
        color: #ffffff;
        background-color: #4080ff;
        border-color: #4080ff;
      }
    }

    &--negative {
      color: #ff4d4f;
      background-color: #fff1f0;
      border-color: #fff1f0;

      &:hover {
        background-color: #ffe7e6;
        border-color: #ff4d4f;
      }

      &.#{$prefix-cls}__tag--selected {
        color: #ffffff;
        background-color: #ff4d4f;
        border-color: #ff4d4f;
      }
    }
  }

  &__textarea {
    width: 100%;

    :deep(.el-textarea__inner) {
      font-size: 14px;
      line-height: 1.6;
    }
  }

  &__counter {
    text-align: right;
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__selected-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px 4px 12px;
    font-size: 13px;
    border-radius: 4px;
    transition: all 0.3s ease;

    &--positive {
      color: #ffffff;
      background-color: #4080ff;
      border: 1px solid #4080ff;
    }

    &--negative {
      color: #ffffff;
      background-color: #ff4d4f;
      border: 1px solid #ff4d4f;
    }
  }

  &__selected-tag-label {
    line-height: 1;
  }

  &__selected-tag-close {
    cursor: pointer;
    transition: transform 0.2s ease;
    flex-shrink: 0;

    &:hover {
      transform: scale(1.2);
    }
  }

  &__error {
    margin-top: 12px;
    padding: 8px 12px;
    font-size: 14px;
    color: #ff4d4f;
    background-color: #fff1f0;
    border: 1px solid #ffccc7;
    border-radius: 4px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
