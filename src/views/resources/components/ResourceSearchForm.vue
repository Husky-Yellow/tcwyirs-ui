<template>
  <ContentWrap class="mb-16px" :bodyStyle="{ padding: '20px 24px 2px' }">
    <el-form :model="modelValue" :inline="true" label-width="80px">
      <el-form-item label="资源名称">
        <el-input
          :model-value="modelValue.name"
          placeholder="请输入"
          clearable
          class="!w-240px"
          @update:model-value="handleUpdate('name', $event)"
        />
      </el-form-item>
      <el-form-item label="资源标签">
        <el-select
          :model-value="modelValue.tagId"
          placeholder="全部"
          clearable
          class="!w-240px"
          @update:model-value="handleUpdate('tagId', $event)"
        >
          <el-option v-for="tag in tagList" :key="tag.id" :label="tag.name" :value="tag.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select
          :model-value="modelValue.status"
          placeholder="全部"
          clearable
          class="!w-240px"
          @update:model-value="handleUpdate('status', $event)"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PRODUCT_LISTING_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleReset">
          <Icon icon="ep:refresh" class="mr-6px" />
          重置
        </el-button>
        <el-button type="primary" @click="handleSearch">
          <Icon icon="ep:search" class="mr-6px" />
          查询
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import type { ResourceTagVO } from '@/api/resource/tag'

interface SearchForm {
  name: string
  tagId: number | undefined
  status: number | undefined
}

interface Props {
  modelValue: SearchForm
  tagList: ResourceTagVO[]
}

interface Emits {
  (e: 'update:modelValue', value: SearchForm): void
  (e: 'search'): void
  (e: 'reset'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleUpdate = (key: keyof SearchForm, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const handleSearch = () => {
  emit('search')
}

const handleReset = () => {
  emit('reset')
}
</script>
