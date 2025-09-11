<script lang="tsx">
import { defineComponent, computed } from 'vue'
import { Message } from '@/layout/components//Message'
import { UserInfo } from '@/layout/components/UserInfo'
import { Screenfull } from '@/layout/components/Screenfull'
import { SizeDropdown } from '@/layout/components/SizeDropdown'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'
import { Logo } from '@/layout/components/Logo'
import RouterSearch from '@/components/RouterSearch/index.vue'
import TenantVisit from '@/layout/components/TenantVisit/index.vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { checkPermi } from '@/utils/permission'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tool-header')

const appStore = useAppStore()

// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)

// 搜索图片
const search = computed(() => appStore.search)

// 尺寸图标
const size = computed(() => appStore.getSize)

// 布局
const layout = computed(() => appStore.getLayout)

// 多语言图标
const locale = computed(() => appStore.getLocale)

// 消息图标
const message = computed(() => appStore.getMessage)

// logo
const logo = computed(() => appStore.logo)

// 租户切换权限
const hasTenantVisitPermission = computed(
  () => import.meta.env.VITE_APP_TENANT_ENABLE === 'true' && checkPermi(['system:tenant:visit'])
)

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)] opacity-60 bg-white'
        ]}
      >
        <div class="h-full flex items-center">
          {logo.value ? <Logo class="custom-hover"></Logo> : undefined}
        </div>
        <div class="h-full flex items-center">
          {hasTenantVisitPermission.value ? <TenantVisit /> : undefined}
          {search.value ? <RouterSearch isModal={false} /> : undefined}
          {message.value ? (
            <Message class="custom-hover" color="var(--top-header-text-color)"></Message>
          ) : undefined}
          <UserInfo></UserInfo>
        </div>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tool-header;

.#{$prefix-cls} {
  transition: left var(--transition-time-02);
}
</style>
