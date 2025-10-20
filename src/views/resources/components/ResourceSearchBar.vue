<template>
  <ContentWrap>
    <SearchForm
      ref="searchFormRef"
      :model="searchForm"
      :schema="searchSchema"
      :cols-per-row="3"
      :show-expand="false"
      label-width="80px"
      @search="handleSearch"
      @reset="handleReset"
    >
      <!-- 自定义插槽支持 -->
      <template v-for="slotName in slots" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </SearchForm>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ref, computed, useSlots } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { SearchForm } from '@/components/SearchForm'
import type { SearchFormSchema } from '@/components/SearchForm'

defineOptions({ name: 'ResourceSearchBar' })

interface SearchFormData {
  name: string
  type: string
}

interface TypeOption {
  label: string
  value: string
}

interface Props {
  typeOptions?: TypeOption[]
  modelValue?: SearchFormData
}

const props = withDefaults(defineProps<Props>(), {
  typeOptions: () => [],
  modelValue: () => ({ name: '', type: '' })
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: SearchFormData): void
  (e: 'search', value: SearchFormData): void
  (e: 'reset'): void
}>()

const slots = useSlots()
const searchFormRef = ref()
const searchForm = ref<SearchFormData>({ ...props.modelValue })

// 搜索表单配置
const searchSchema = computed<SearchFormSchema[]>(() => [
  {
    field: 'name',
    label: '资源名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      clearable: true
    }
  },
  {
    field: 'type',
    label: '资源类型',
    component: 'Select',
    componentProps: {
      placeholder: '全部',
      clearable: true,
      options: props.typeOptions
    }
  }
])

const handleSearch = (values: SearchFormData) => {
  searchForm.value = values
  emit('update:modelValue', values)
  emit('search', values)
}

const handleReset = () => {
  searchForm.value = { name: '', type: '' }
  emit('update:modelValue', searchForm.value)
  emit('reset')
}

// 暴露方法
defineExpose({
  validate: () => searchFormRef.value?.validate(),
  resetFields: () => searchFormRef.value?.resetFields()
})
</script>
