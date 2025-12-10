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
      <el-option
        v-for="item in internalOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        class="dynamic-option !h-auto !p-0 !leading-normal"
      >
        <div
          class="group relative min-h-36px flex items-center justify-between gap-2 px-12px py-8px transition-all duration-200"
          :class="{ 'editing-mode': editingValue === item.value }"
        >
          <div
            v-if="editingValue === item.value"
            class="flex flex-1 items-center gap-8px"
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
            <div class="flex items-center gap-4px">
              <el-icon class="edit-action-icon confirm-icon" @click.stop="saveEdit" @mousedown.stop>
                <Select />
              </el-icon>
              <el-icon class="edit-action-icon cancel-icon" @click.stop="cancelEdit" @mousedown.stop>
                <Close />
              </el-icon>
            </div>
          </div>
          <template v-else>
            <span class="option-label flex-1 truncate text-14px leading-22px">{{ item.label }}</span>
            <div v-if="!item.fixed" class="option-actions flex items-center gap-4px">
              <el-icon class="action-icon edit-icon" @click.stop="handleEditOption(item.value)" @mousedown.stop>
                <Edit />
              </el-icon>
              <el-icon
                v-if="allowDelete"
                class="action-icon delete-icon"
                @click.stop="handleDeleteOption(item.value)"
                @mousedown.stop
              >
                <Delete />
              </el-icon>
            </div>
          </template>
        </div>
      </el-option>

      <el-divider v-if="allowAdd" class="add-divider !my-8px" />

      <el-option v-if="allowAdd" value="__add_section__" disabled class="add-section !h-auto !p-0">
        <div class="add-container px-12px pb-10px pt-6px" @click.stop>
          <el-input
            ref="inputRef"
            v-model="newOptionLabel"
            :placeholder="addPlaceholder"
            clearable
            class="add-new-input mb-8px"
            @keyup.enter="handleAddOption"
            @click.stop
          >
            <template #prefix>
              <el-icon class="text-15px" style="color: var(--el-color-primary)">
                <Edit />
              </el-icon>
            </template>
          </el-input>

          <div
            class="add-button group flex cursor-pointer items-center justify-center gap-2px rounded-5px px-8px py-2px text-12px font-500 transition-all duration-200"
            @click.stop="handleAddOption"
          >
            <el-icon class="text-12px transition-transform duration-200 group-hover:rotate-90">
              <Plus />
            </el-icon>
            <span>添加新选项</span>
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

watch(
  () => props.options,
  (newOptions) => {
    internalOptions.value = [...newOptions]
  },
  { deep: true }
)

const handleVisibleChange = (visible: boolean) => {
  if (!visible && editingValue.value !== null) cancelEdit()
}

const handleEditBlur = useDebounceFn(() => {
  if (editingValue.value !== null) saveEdit()
}, 150)

const handleAddOption = useDebounceFn(() => {
  const label = newOptionLabel.value.trim()
  if (!label) return ElMessage.warning('请输入选项名称')
  if (internalOptions.value.some((opt) => opt.label === label)) {
    return ElMessage.warning('该选项已存在')
  }

  const newOption: DynamicSelectOption = {
    label,
    value: `option_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fixed: false
  }

  internalOptions.value.push(newOption)

  // 自动选中新添加的选项
  localValue.value = newOption.value

  emit('add-option', newOption)
  emit('options-change', [...internalOptions.value])
  ElMessage.success(`已添加选项: ${label}`)
  newOptionLabel.value = ''
}, 300)

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

const saveEdit = () => {
  if (!editingValue.value) return

  const trimmedLabel = editingLabel.value.trim()
  if (!trimmedLabel) {
    ElMessage.warning('选项名称不能为空')
    return cancelEdit()
  }

  const option = internalOptions.value.find((opt) => opt.value === editingValue.value)
  if (!option) return cancelEdit()
  if (trimmedLabel === option.label) return cancelEdit()

  if (
    internalOptions.value.some(
      (opt) => opt.value !== editingValue.value && opt.label === trimmedLabel
    )
  ) {
    return ElMessage.warning('该选项名称已存在')
  }

  option.label = trimmedLabel
  emit('edit-option', { ...option })
  emit('options-change', [...internalOptions.value])
  ElMessage.success('编辑成功')
  cancelEdit()
}

const cancelEdit = () => {
  editingValue.value = null
  editingLabel.value = ''
}

const handleDeleteOption = useDebounceFn((value: string | number) => {
  const index = internalOptions.value.findIndex((opt) => opt.value === value)
  if (index === -1) return

  const option = internalOptions.value[index]
  if (option.fixed) return ElMessage.warning('该选项不可删除')
  if (localValue.value === value) localValue.value = null

  internalOptions.value.splice(index, 1)
  emit('delete-option', value)
  emit('options-change', [...internalOptions.value])
  ElMessage.success(`已删除选项: ${option.label}`)
}, 300)

const handleChange = (value: string | number | null) => emit('change', value)

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
  .dynamic-option {
    .group:not(.editing-mode) {
      &:hover {
        background: var(--el-fill-color-light);
      }

      .option-label {
        color: var(--el-text-color-primary);
        transition: color 0.2s ease;
      }

      .option-actions {
        opacity: 0;
        transform: translateX(4px);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &:hover .option-actions {
        opacity: 1;
        transform: translateX(0);
      }

      .action-icon {
        width: 20px;
        height: 20px;
        padding: 2px;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        color: var(--el-text-color-secondary);

        &:hover {
          transform: scale(1.1);
        }

        &:active {
          transform: scale(0.95);
        }
      }

      .edit-icon:hover {
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
      }

      .delete-icon:hover {
        color: var(--el-color-danger);
        background: var(--el-color-danger-light-9);
      }
    }

    .editing-mode {
      background: var(--el-color-primary-light-9);
      border-left: 3px solid var(--el-color-primary);
      padding-left: 9px;

      .edit-action-icon {
        width: 24px;
        height: 24px;
        padding: 4px;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          transform: scale(1.15);
        }

        &:active {
          transform: scale(0.9);
        }
      }

      .confirm-icon {
        color: var(--el-color-success);
        background: var(--el-color-success-light-9);

        &:hover {
          background: var(--el-color-success-light-8);
          box-shadow: 0 2px 6px rgba(103, 194, 58, 0.2);
        }
      }

      .cancel-icon {
        color: var(--el-color-info);
        background: var(--el-color-info-light-9);

        &:hover {
          background: var(--el-color-info-light-8);
          box-shadow: 0 2px 6px rgba(144, 147, 153, 0.2);
        }
      }
    }
  }

  .edit-input {
    :deep(.el-input__wrapper) {
      padding: 4px 10px;
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 0 0 3px var(--el-color-primary-light-9);
      }
    }

    :deep(.el-input__inner) {
      height: 24px;
      line-height: 24px;
      font-size: 13px;
    }
  }

  .add-divider {
    border-color: var(--el-border-color-lighter);
  }

  .add-section {
    .add-container {
      background: linear-gradient(to bottom, transparent 0%, var(--el-fill-color-lighter) 100%);
    }

    .add-new-input {
      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px var(--el-border-color) inset;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        background: #fff;

        &:hover {
          box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
        }

        &.is-focus {
          box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 0 0 3px var(--el-color-primary-light-9);
        }
      }
    }

    .add-button {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
      border: 1px dashed var(--el-color-primary-light-5);

      &:hover {
        background: var(--el-color-primary-light-8);
        border-color: var(--el-color-primary);
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(64, 158, 255, 0.1);
      }
    }
  }

  .el-select-dropdown__item.selected {
    position: relative;
    font-weight: 500;
    color: var(--el-color-primary);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: var(--el-color-primary);
      border-radius: 0 2px 2px 0;
    }
  }
}
</style>
