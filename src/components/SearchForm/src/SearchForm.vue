<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import type { SearchFormSchema } from './types'

defineOptions({ name: 'SearchForm' })

const props = defineProps({
  // 搜索表单配置
  schema: {
    type: Array as PropType<SearchFormSchema[]>,
    required: true
  },
  // 表单模型
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  // 每行显示的搜索项数量
  colsPerRow: propTypes.number.def(3),
  // 是否显示展开/收起按钮
  showExpand: propTypes.bool.def(true),
  // 默认是否展开
  defaultExpanded: propTypes.bool.def(false),
  // label 宽度
  labelWidth: propTypes.string.def('100px'),
  // 是否显示搜索按钮
  showSearch: propTypes.bool.def(true),
  // 是否显示重置按钮
  showReset: propTypes.bool.def(true)
})

const emit = defineEmits<{
  'search': [values: Recordable]
  'reset': []
}>()

// 展开/收起状态
const expanded = ref(props.defaultExpanded)

// 表单引用
const formRef = ref()

// 表单数据
const formData = ref<Recordable>({ ...props.model })

// 计算是否需要显示展开按钮
const needExpand = computed(() => {
  return props.showExpand && props.schema.length > props.colsPerRow
})

// 计算显示的表单项
const visibleSchema = computed(() => {
  if (!needExpand.value || expanded.value) {
    return props.schema
  }
  // 收起时只显示第一行,但要给按钮留一个位置
  return props.schema.slice(0, props.colsPerRow - 1)
})

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

// 切换展开/收起
const toggleExpand = () => {
  expanded.value = !expanded.value
}

// 计算 grid 列数
const gridCols = computed(() => {
  return props.colsPerRow
})

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
  <div class="search-form">
    <el-form ref="formRef" :model="formData" :label-width="labelWidth">
      <div
        class="search-form-grid"
        :style="{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`
        }"
      >
        <!-- 表单项 -->
        <div
          v-for="item in visibleSchema"
          :key="item.field"
          class="search-form-item"
        >
          <el-form-item
            :label="item.label"
            :prop="item.field"
            :rules="item.rules"
          >
            <!-- 输入框 -->
            <el-input
              v-if="item.component === 'Input'"
              v-model="formData[item.field]"
              v-bind="item.componentProps"
              :placeholder="item.componentProps?.placeholder || `请输入${item.label}`"
            />

            <!-- 选择器 -->
            <el-select
              v-else-if="item.component === 'Select'"
              v-model="formData[item.field]"
              v-bind="item.componentProps"
              :placeholder="item.componentProps?.placeholder || `请选择${item.label}`"
              class="w-full"
            >
              <el-option
                v-for="option in item.componentProps?.options || []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>

            <!-- 日期选择器 -->
            <el-date-picker
              v-else-if="item.component === 'DatePicker'"
              v-model="formData[item.field]"
              v-bind="item.componentProps"
              :placeholder="item.componentProps?.placeholder || `请选择${item.label}`"
              class="w-full"
            />

            <!-- 日期范围选择器 -->
            <el-date-picker
              v-else-if="item.component === 'DateRangePicker'"
              v-model="formData[item.field]"
              type="daterange"
              v-bind="item.componentProps"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="w-full"
            />

            <!-- 时间选择器 -->
            <el-time-picker
              v-else-if="item.component === 'TimePicker'"
              v-model="formData[item.field]"
              v-bind="item.componentProps"
              :placeholder="item.componentProps?.placeholder || `请选择${item.label}`"
              class="w-full"
            />

            <!-- 数字输入框 -->
            <el-input-number
              v-else-if="item.component === 'InputNumber'"
              v-model="formData[item.field]"
              v-bind="item.componentProps"
              class="w-full"
            />

            <!-- 自定义插槽 -->
            <slot v-else-if="item.component === 'slot'" :name="item.field" :model="formData"></slot>
          </el-form-item>
        </div>

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
          <el-button v-if="needExpand" text @click="toggleExpand">
            {{ expanded ? '收起' : '展开' }}
            <Icon :icon="expanded ? 'ep:arrow-up' : 'ep:arrow-down'" class="ml-4px" />
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
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
