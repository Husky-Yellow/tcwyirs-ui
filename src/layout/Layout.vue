<script lang="tsx">
import { computed, defineComponent, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Backtop } from '@/components/Backtop'
import { useRenderLayout } from './components/useRenderLayout'
import { useDesign } from '@/hooks/web/useDesign'
import { useNetwork } from '@/hooks/web/useNetwork'
import { ElNotification } from 'element-plus'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()

// 是否是移动端
const mobile = computed(() => appStore.getMobile)

// 菜单折叠
const collapse = computed(() => appStore.getCollapse)

const layout = computed(() => appStore.getLayout)

const handleClickOutside = () => {
  appStore.setCollapse(true)
}

const renderLayout = () => {
  const { renderCustom } = useRenderLayout()
  return renderCustom()
}

export default defineComponent({
  name: 'Layout',
  setup() {
    // 网络状态监听
    const { online } = useNetwork()

    // 监听网络状态变化
    watch(online, (isOnline) => {
      if (isOnline) {
        ElNotification({
          title: '网络已连接',
          message: '您的网络连接已恢复',
          type: 'success',
          duration: 3000
        })
      } else {
        ElNotification({
          title: '网络已断开',
          message: '请检查您的网络连接',
          type: 'warning',
          duration: 0
        })
      }
    })

    return () => (
      <section class={[prefixCls, `${prefixCls}__${layout.value}`, 'w-[100%] h-[100%] relative']}>
        {mobile.value && !collapse.value ? (
          <div
            class="absolute left-0 top-0 z-99 h-full w-full bg-[var(--el-color-black)] opacity-30"
            onClick={handleClickOutside}
          ></div>
        ) : undefined}

        {renderLayout()}

        <Backtop></Backtop>
      </section>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-layout;

.#{$prefix-cls} {
  background-color: var(--app-content-bg-color);
}
</style>
