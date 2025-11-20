<script lang="tsx">
import { ElScrollbar } from 'element-plus'
import { useDesign } from '@/hooks/web/useDesign'
import { Icon } from '@/components/Icon'
import { useMenuLogic } from './composables/useMenuLogic'
import { useMenuRenderer } from './composables/useMenuRenderer'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('CustomMenu')

export default defineComponent({
  name: 'CustomMenu',
  setup() {
    const {
      routers,
      expandedMenus,
      collapse,
      activeMenu,
      handleMenuClick,
      toggleExpand,
      toggleCollapse
    } = useMenuLogic()

    const { renderMenuItems } = useMenuRenderer({
      routers,
      activeMenu,
      expandedMenus,
      collapse,
      handleMenuClick,
      toggleExpand
    })

    return () => (
      <div
        class={[
          `${prefixCls}`,
          'h-full transition-width duration-300 ease relative',
          unref(collapse)
            ? 'w-[var(--left-menu-min-width)]'
            : 'w-[var(--custom-left-menu-max-width)]'
        ]}
      >
        <div
          class="absolute top-12px w-28px h-28px flex items-center justify-center cursor-pointer bg-white rd-4px transition-all duration-300 ease hover:bg-#e8eaed shadow-sm z-10"
          style="right: -14px;"
          onClick={toggleCollapse}
        >
          <Icon
            icon={unref(collapse) ? 'ep:d-arrow-right' : 'ep:d-arrow-left'}
            class="text-16px text-#909399"
          />
        </div>
        <ElScrollbar>{renderMenuItems(unref(routers))}</ElScrollbar>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
// 自定义滚动条样式
:deep(.el-scrollbar__bar) {
  &.is-vertical {
    right: 2px;
    width: 6px;

    .el-scrollbar__thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}

:deep(.el-scrollbar__view) {
  padding: 0 0 16px 0;
}
</style>
