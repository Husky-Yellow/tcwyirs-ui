<template>
  <div class="w-full">
    <el-select
      ref="selectRef"
      v-model="localValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :filterable="filterable"
      class="w-full"
      popper-class="dynamic-select-popper"
      @change="handleChange"
      @visible-change="handleVisibleChange"
    >
      <!-- 常规选项 -->
      <el-option
        v-for="item in internalOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        class="!h-auto !p-0 !leading-normal"
      >
        <div
          class="group min-h-34px flex items-center justify-between gap-2 px-3 py-1.5 transition-all"
        >
          <!-- 编辑模式 -->
          <div
            v-if="editingValue === item.value"
            class="flex flex-1 items-center gap-2"
            @click.stop
            @mousedown.stop
          >
            <el-input
              ref="editInputRef"
              v-model="editingLabel"
              size="small"
              class="edit-input flex-1"
              @keyup.enter="saveEdit"
              @keyup.esc="cancelEdit"
              @blur="handleEditBlur"
              @click.stop
            />
            <el-icon
              class="text-success h-18px w-18px cursor-pointer text-16px transition-all hover:scale-110 hover:op-80"
              @click.stop="saveEdit"
              @mousedown.stop
            >
              <Select />
            </el-icon>
            <el-icon
              class="text-info h-18px w-18px cursor-pointer text-16px transition-all hover:scale-110 hover:op-80"
              @click.stop="cancelEdit"
              @mousedown.stop
            >
              <Close />
            </el-icon>
          </div>
          <!-- 正常模式 -->
          <template v-else>
            <span class="flex-1 truncate text-14px leading-22px">{{ item.label }}</span>
            <div
              v-if="!item.fixed"
              class="flex items-center gap-1 op-0 transition-opacity group-hover:op-100"
            >
              <el-icon
                class="text-secondary hover:text-primary h-18px w-18px cursor-pointer text-16px transition-all hover:scale-110"
                @click.stop="handleEditOption(item.value)"
                @mousedown.stop
              >
                <Edit />
              </el-icon>
              <el-icon
                v-if="allowDelete"
                class="text-secondary hover:text-danger h-18px w-18px cursor-pointer text-16px transition-all hover:scale-110"
                @click.stop="handleDeleteOption(item.value)"
                @mousedown.stop
              >
                <Delete />
              </el-icon>
            </div>
          </template>
        </div>
      </el-option>

      <!-- 分隔线 -->
      <el-divider v-if="allowAdd" class="!my-2" />

      <!-- 新增区域 -->
      <el-option v-if="allowAdd" value="__add_section__" disabled class="!h-auto !p-0">
        <div class="px-3 pb-2 pt-1" @click.stop>
          <!-- 输入框 -->
          <el-input
            ref="inputRef"
            v-model="newOptionLabel"
            :placeholder="addPlaceholder"
            size="small"
            clearable
            class="add-new-input mb-2"
            @keyup.enter="handleAddOption"
            @click.stop
          >
            <template #prefix>
              <el-icon class="text-secondary text-14px">
                <Edit />
              </el-icon>
            </template>
          </el-input>

          <!-- 新增按钮 -->
          <div
            class="text-primary bg-primary/5 hover:bg-primary/10 group flex cursor-pointer items-center justify-center gap-1.5 rounded-6px px-3 py-1.5 text-14px font-500 transition-all"
            @click.stop="handleAddOption"
          >
            <el-icon class="text-16px transition-transform group-hover:rotate-90">
              <Plus />
            </el-icon>
            <span>添加新标签</span>
          </div>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useVModel, useDebounceFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { Plus, Delete, Edit, Select, Close } from '@element-plus/icons-vue'

export interface DynamicSelectOption {
  label: string
  value: string | number
  fixed?: boolean
}

interface Props {
  modelValue?: string | number | null
  options?: DynamicSelectOption[]
  placeholder?: string
  addPlaceholder?: string
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  allowAdd?: boolean
  allowDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: () => [],
  placeholder: '请选择',
  addPlaceholder: '请输入',
  disabled: false,
  clearable: true,
  filterable: true,
  allowAdd: true,
  allowDelete: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  change: [value: string | number | null]
  'add-option': [option: DynamicSelectOption]
  'edit-option': [option: DynamicSelectOption]
  'delete-option': [value: string | number]
  'options-change': [options: DynamicSelectOption[]]
}>()

const localValue = useVModel(props, 'modelValue', emit)
const internalOptions = ref<DynamicSelectOption[]>([...props.options])
const newOptionLabel = ref('')
const inputRef = ref()
const selectRef = ref()
const editingValue = ref<string | number | null>(null)
const editingLabel = ref('')
const editInputRef = ref()

// 监听外部 options 变化
watch(() => props.options, (newOptions) => {
  internalOptions.value = [...newOptions]
}, { deep: true })

// 下拉框状态变化
const handleVisibleChange = (visible: boolean) => {
  if (!visible && editingValue.value !== null) {
    cancelEdit()
  }
}

// 编辑失焦处理（延迟保存，避免与按钮点击冲突）
const handleEditBlur = useDebounceFn(() => {
  if (editingValue.value !== null) {
    saveEdit()
  }
}, 150)

// 新增选项
const handleAddOption = useDebounceFn(() => {
  const label = newOptionLabel.value.trim()
  if (!label) {
    ElMessage.warning('请输入选项名称')
    return
  }

  if (internalOptions.value.some((opt) => opt.label === label)) {
    ElMessage.warning('该选项已存在')
    return
  }

  const newOption: DynamicSelectOption = {
    label,
    value: `option_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fixed: false
  }

  internalOptions.value.push(newOption)
  emit('add-option', newOption)
  emit('options-change', [...internalOptions.value])
  ElMessage.success(`已添加选项: ${label}`)
  newOptionLabel.value = ''
}, 300)

// 进入编辑模式
const handleEditOption = (value: string | number) => {
  const option = internalOptions.value.find((opt) => opt.value === value)
  if (!option) return

  editingValue.value = value
  editingLabel.value = option.label

  nextTick(() => {
    setTimeout(() => {
      editInputRef.value?.focus?.()
      editInputRef.value?.select?.()
    }, 50)
  })
}

// 保存编辑
const saveEdit = () => {
  if (editingValue.value === null) return

  const trimmedLabel = editingLabel.value.trim()
  if (!trimmedLabel) {
    ElMessage.warning('选项名称不能为空')
    cancelEdit()
    return
  }

  const option = internalOptions.value.find((opt) => opt.value === editingValue.value)
  if (!option) {
    cancelEdit()
    return
  }

  if (trimmedLabel === option.label) {
    cancelEdit()
    return
  }

  if (internalOptions.value.some((opt) => opt.value !== editingValue.value && opt.label === trimmedLabel)) {
    ElMessage.warning('该选项名称已存在')
    return
  }

  option.label = trimmedLabel
  emit('edit-option', { ...option })
  emit('options-change', [...internalOptions.value])
  ElMessage.success('编辑成功')
  cancelEdit()
}

// 取消编辑
const cancelEdit = () => {
  editingValue.value = null
  editingLabel.value = ''
}

// 删除选项
const handleDeleteOption = useDebounceFn((value: string | number) => {
  const index = internalOptions.value.findIndex((opt) => opt.value === value)
  if (index === -1) return

  const option = internalOptions.value[index]
  if (option.fixed) {
    ElMessage.warning('该选项不可删除')
    return
  }

  if (localValue.value === value) {
    localValue.value = null
  }

  internalOptions.value.splice(index, 1)
  emit('delete-option', value)
  emit('options-change', [...internalOptions.value])
  ElMessage.success(`已删除选项: ${option.label}`)
}, 300)

// 选择变化
const handleChange = (value: string | number | null) => {
  emit('change', value)
}

// 暴露方法
defineExpose({
  getOptions: () => [...internalOptions.value],
  resetOptions: (options: DynamicSelectOption[]) => {
    internalOptions.value = [...options]
    emit('options-change', [...internalOptions.value])
  },
  focus: () => inputRef.value?.focus()
})
</script>

<style lang="scss">
.dynamic-select-popper {
  // 编辑输入框样式
  .edit-input {
    :deep(.el-input__wrapper) {
      padding: 4px 8px;
      box-shadow: 0 0 0 1px var(--el-border-color) inset;

      &:hover {
        box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }

    :deep(.el-input__inner) {
      height: 22px;
      line-height: 22px;
    }
  }

  // 新增输入框样式
  .add-new-input {
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
      transition: all 0.2s ease;

      &:hover {
        box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }
  }
}
</style>
