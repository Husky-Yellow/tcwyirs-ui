<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineOptions({ name: 'SearchForm' })

const props = defineProps({
  // 表单模型
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  // 每行显示的搜索项数量
  colsPerRow: propTypes.number.def(3),
  // label 宽度
  labelWidth: propTypes.string.def('100px'),
  // 是否显示搜索按钮
  showSearch: propTypes.bool.def(true),
  // 是否显示重置按钮
  showReset: propTypes.bool.def(true)
})

const emit = defineEmits<{
  search: [values: Recordable]
  reset: []
}>()

// 表单引用
const formRef = ref()

// 表单数据
const formData = ref<Recordable>({ ...props.model })

// 搜索
const handleSearch = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit('search', formData.value)
    }
  })
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}

// 暴露方法给父组件
defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
  getFormData: () => formData.value,
  setFormData: (data: Recordable) => {
    formData.value = { ...formData.value, ...data }
  }
})
</script>

<template>
  <ContentWrap shadow="always">
    <el-form ref="formRef" :model="formData" :label-width="labelWidth">
      <div
        class="search-form-grid"
        :style="{
          gridTemplateColumns: `repeat(${colsPerRow}, 1fr)`
        }"
      >
        <!-- 搜索项 - 通过默认插槽传入 -->
        <slot :model="formData"></slot>

        <!-- 操作按钮区域 (固定在右下角) -->
        <div class="search-form-actions">
          <el-button v-if="showReset" @click="handleReset">
            <Icon icon="ep:refresh" class="mr-6px" />
            重置
          </el-button>
          <el-button v-if="showSearch" type="primary" @click="handleSearch">
            <Icon icon="ep:search" class="mr-6px" />
            搜索
          </el-button>
        </div>
      </div>
    </el-form>
  </ContentWrap>
</template>

<style lang="scss" scoped>
.search-form {
  width: 100%;

  &-grid {
    display: grid;
    gap: 16px;
    align-items: start;
  }

  &-item {
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  &-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    grid-column: -1;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }
}
</style>
