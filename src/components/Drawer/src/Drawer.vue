<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineOptions({ name: 'Drawer' })

const slots = useSlots()

const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def(''),
  size: propTypes.oneOfType([String, Number]).def('30%'),
  direction: propTypes.oneOf(['ltr', 'rtl', 'ttb', 'btt']).def('rtl'),
  showClose: propTypes.bool.def(true),
  modal: propTypes.bool.def(true),
  closeOnClickModal: propTypes.bool.def(true),
  closeOnPressEscape: propTypes.bool.def(true),
  destroyOnClose: propTypes.bool.def(true),
  withHeader: propTypes.bool.def(true),
  zIndex: propTypes.number.def(2000)
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  opened: []
  close: []
  closed: []
}>()

// 双向绑定抽屉显示状态
const drawerVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 合并属性,排除自定义处理的属性
const getBindValue = computed(() => {
  const delArr: string[] = ['modelValue', 'title', 'withHeader']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

// 事件处理
const handleOpen = () => {
  emit('open')
}

const handleOpened = () => {
  emit('opened')
}

const handleClose = () => {
  emit('close')
}

const handleClosed = () => {
  emit('closed')
}
</script>

<template>
  <ElDrawer
    v-model="drawerVisible"
    v-bind="getBindValue"
    class="custom-drawer"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <!-- 自定义头部插槽 -->
    <template v-if="withHeader" #header>
      <slot name="header">
        <div class="flex items-center justify-between">
          <span class="text-16px text-[var(--el-text-color-primary)] font-600">{{ title }}</span>
        </div>
      </slot>
    </template>

    <!-- 主体内容插槽 -->
    <div class="h-full overflow-y-auto p-20px">
      <slot></slot>
    </div>

    <!-- 底部插槽 -->
    <template v-if="slots.footer" #footer>
      <div class="flex items-center justify-end gap-12px">
        <slot name="footer"></slot>
      </div>
    </template>
  </ElDrawer>
</template>

<style lang="scss" scoped>
.custom-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color);
  }

  :deep(.el-drawer__body) {
    padding: 0;
  }

  :deep(.el-drawer__footer) {
    padding: 12px 20px;
    border-top: 1px solid var(--el-border-color);
  }
}
</style>
