import { computed, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { isUrl } from '@/utils/is'

export const useMenuLogic = () => {
  const { push, currentRoute } = useRouter()
  const permissionStore = usePermissionStore()
  const appStore = useAppStore()

  const routers = computed(() => permissionStore.getRouters)
  const expandedMenus = ref<Set<string>>(new Set())
  const collapse = computed(() => appStore.getCollapse)

  const activeMenu = computed(() => {
    const { meta, path } = unref(currentRoute)
    if (meta.activeMenu) {
      return meta.activeMenu as string
    }
    return path
  })

  const handleMenuClick = (path: string) => {
    if (isUrl(path)) {
      window.open(path)
    } else {
      push(path)
    }
  }

  const toggleExpand = (path: string) => {
    const expanded = expandedMenus.value
    if (expanded.has(path)) {
      expanded.delete(path)
    } else {
      expanded.add(path)
    }
  }

  const toggleCollapse = () => {
    appStore.setCollapse(!unref(collapse))
  }

  return {
    routers,
    expandedMenus,
    collapse,
    activeMenu,
    handleMenuClick,
    toggleExpand,
    toggleCollapse
  }
}
