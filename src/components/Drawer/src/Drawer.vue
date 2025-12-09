<script lang="ts" setup>
defineOptions({ name: 'Drawer' })

type DrawerDirection = 'ltr' | 'rtl' | 'ttb' | 'btt'

interface DrawerProps {
  modelValue?: boolean
  title?: string
  size?: string | number
  direction?: DrawerDirection
  showClose?: boolean
  modal?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  destroyOnClose?: boolean
  withHeader?: boolean
  zIndex?: number
}

const slots = useSlots()

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  title: '',
  size: '30%',
  direction: 'rtl',
  showClose: true,
  modal: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  destroyOnClose: true,
  withHeader: true,
  zIndex: 2000
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
    :size="size"
    :direction="direction"
    :show-close="showClose"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :destroy-on-close="destroyOnClose"
    :z-index="zIndex"
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
    <div class="h-full overflow-hidden overflow-y-auto">
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

<style lang="scss">
.custom-drawer {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color);
  }
  .el-drawer__footer {
    padding: 12px 20px;
    border-top: 1px solid var(--el-border-color);
  }
}
</style>
