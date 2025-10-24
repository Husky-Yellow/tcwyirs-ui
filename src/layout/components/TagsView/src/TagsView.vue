<script lang="ts" setup>
import { computed, nextTick, ref, unref, watch, shallowRef } from 'vue'
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { filterAffixTags } from './helper'
import { ContextMenu, ContextMenuExpose } from '@/layout/components/ContextMenu'
import { useDesign } from '@/hooks/web/useDesign'
import { useTemplateRefsList, computedEager, useScroll, useThrottleFn } from '@vueuse/core'
import { ElScrollbar } from 'element-plus'
import { useScrollTo } from '@/hooks/event/useScrollTo'
import { useTagsView } from '@/hooks/web/useTagsView'
import { cloneDeep } from 'es-toolkit'

defineOptions({ name: 'TagsView' })

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('tags-view')

const { currentRoute, push } = useRouter()
const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage } = useTagsView()

const permissionStore = usePermissionStore()
const routers = computedEager(() => permissionStore.getRouters)

const tagsViewStore = useTagsViewStore()
const visitedViews = computedEager(() => tagsViewStore.getVisitedViews)
const selectedTag = computedEager(() => tagsViewStore.getSelectedTag)
const setSelectTag = tagsViewStore.setSelectedTag

const appStore = useAppStore()
const tagsViewImmerse = computedEager(() => appStore.getTagsViewImmerse)
const tagsViewIcon = computedEager(() => appStore.getTagsViewIcon)
const isDark = computedEager(() => appStore.getIsDark)

const affixTagArr = shallowRef<RouteLocationNormalizedLoaded[]>([])

// 初始化tag
const initTags = () => {
  affixTagArr.value = filterAffixTags(unref(routers))
  for (const tag of unref(affixTagArr)) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(cloneDeep(tag))
    }
  }
}

// 新增tag
const addTags = () => {
  const { name } = unref(currentRoute)
  if (name) {
    setSelectTag(unref(currentRoute))
    tagsViewStore.addView(unref(currentRoute))
  }
}

// 关闭选中的tag
const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  closeCurrent(view, () => {
    if (isActive(view)) {
      toLastView()
    }
  })
}

// 去最后一个
const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    push(latestView)
  } else {
    if (
      unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
      unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
    ) {
      addTags()
      return
    }
    // You can set another route
    push(permissionStore.getAddRouters[0].path)
  }
}

// 关闭全部
const closeAllTags = () => {
  closeAll(() => {
    toLastView()
  })
}

// 关闭其它
const closeOthersTags = () => {
  closeOther()
}

// 重新加载
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  refreshPage(view)
}

// 关闭左侧
const closeLeftTags = () => {
  closeLeft()
}

// 关闭右侧
const closeRightTags = () => {
  closeRight()
}

const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()
const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()

// 使用 useScroll 自动跟踪滚动位置
const { x: scrollLeft } = useScroll(computed(() => scrollbarRef.value?.wrapRef), { throttle: 16 })

// 节流优化的滚动到当前tag
const moveToCurrentTag = useThrottleFn(async () => {
  await nextTick()
  for (const v of unref(visitedViews)) {
    if (v.fullPath === unref(currentRoute).fullPath) {
      moveToTarget(v)
      break
    }
  }
}, 100)

const moveToTarget = (currentTag: RouteLocationNormalizedLoaded) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  if (!wrap$) return

  const tagList = unref(tagLinksRefs)
  if (tagList.length === 0) return

  const firstTag = tagList[0]
  const lastTag = tagList[tagList.length - 1]

  if ((firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    const { start } = useScrollTo({ el: wrap$, position: 'scrollLeft', to: 0, duration: 500 })
    start()
  } else if ((lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    const { start } = useScrollTo({
      el: wrap$,
      position: 'scrollLeft',
      to: wrap$.scrollWidth - wrap$.offsetWidth,
      duration: 500
    })
    start()
  } else {
    const currentIndex = tagList.findIndex(
      (item) => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath
    )
    if (currentIndex === -1) return

    const tgsRefs = document.getElementsByClassName(`${prefixCls}__item`)
    const prevTag = tgsRefs[currentIndex - 1] as HTMLElement
    const nextTag = tgsRefs[currentIndex + 1] as HTMLElement

    if (!prevTag || !nextTag) return

    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4

    if (afterNextTagOffsetLeft > scrollLeft.value + wrap$.offsetWidth) {
      const { start } = useScrollTo({
        el: wrap$,
        position: 'scrollLeft',
        to: afterNextTagOffsetLeft - wrap$.offsetWidth,
        duration: 500
      })
      start()
    } else if (beforePrevTagOffsetLeft < scrollLeft.value) {
      const { start } = useScrollTo({
        el: wrap$,
        position: 'scrollLeft',
        to: beforePrevTagOffsetLeft,
        duration: 500
      })
      start()
    }
  }
}

// 是否是当前tag
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.fullPath === unref(currentRoute).fullPath
}

// 所有右键菜单组件的元素
const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

// 右键菜单状态改变的时候
const visibleChange = (visible: boolean, tagItem: RouteLocationNormalizedLoaded) => {
  if (visible) {
    for (const v of unref(itemRefs)) {
      const elDropdownMenuRef = v.elDropdownMenuRef
      if (tagItem.fullPath !== v.tagItem.fullPath) {
        elDropdownMenuRef?.handleClose()
        setSelectTag(tagItem)
      }
    }
  }
}

// 移动到某个位置
const move = (to: number) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  if (!wrap$) return
  const { start } = useScrollTo({
    el: wrap$,
    position: 'scrollLeft',
    to: scrollLeft.value + to,
    duration: 500
  })
  start()
}

const canShowIcon = (item: RouteLocationNormalizedLoaded) => {
  const showIcon = unref(tagsViewIcon)
  return showIcon && (item?.matched?.[1]?.meta?.icon || (item?.meta?.affix && item?.meta?.icon))
}

onBeforeMount(() => {
  initTags()
  addTags()
})

watch(
  () => currentRoute.value,
  () => {
    addTags()
    moveToCurrentTag()
  }
)
</script>

<template>
  <div
    :id="prefixCls"
    :class="prefixCls"
    class="relative w-full flex bg-[#fff] dark:bg-[var(--el-bg-color)]"
  >
    <span
      :class="tagsViewImmerse ? '' : `${prefixCls}__tool ${prefixCls}__tool--first`"
      class="h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center"
      @click="move(-200)"
    >
      <Icon
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
        color="var(--el-text-color-placeholder)"
        icon="ep:d-arrow-left"
      />
    </span>
    <div class="flex-1 overflow-hidden">
      <ElScrollbar ref="scrollbarRef" class="h-full">
        <div class="h-[var(--tags-view-height)] flex">
          <ContextMenu
            v-for="item in visitedViews"
            :key="item.fullPath"
            :ref="itemRefs.set"
            :class="[
              `${prefixCls}__item`,
              tagsViewImmerse ? `${prefixCls}__item--immerse` : '',
              tagsViewIcon ? `${prefixCls}__item--icon` : '',
              tagsViewImmerse && tagsViewIcon ? `${prefixCls}__item--immerse--icon` : '',
              item?.meta?.affix ? `${prefixCls}__item--affix` : '',
              {
                'is-active': isActive(item)
              }
            ]"
            :schema="[
              {
                icon: 'ep:refresh',
                label: '重新加载',
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  refreshSelectedTag(item)
                }
              },
              {
                icon: 'ep:close',
                label: '关闭标签页',
                disabled: !!visitedViews?.length && selectedTag?.meta.affix,
                command: () => {
                  closeSelectedTag(item)
                }
              },
              {
                divided: true,
                icon: 'ep:d-arrow-left',
                label: '关闭左侧标签页',
                disabled:
                  !!visitedViews?.length &&
                  (item.fullPath === visitedViews[0].fullPath ||
                    selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeLeftTags()
                }
              },
              {
                icon: 'ep:d-arrow-right',
                label: '关闭右侧标签页',
                disabled:
                  !!visitedViews?.length &&
                  (item.fullPath === visitedViews[visitedViews.length - 1].fullPath ||
                    selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeRightTags()
                }
              },
              {
                divided: true,
                icon: 'ep:discount',
                label: '关闭其他标签页',
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  closeOthersTags()
                }
              },
              {
                icon: 'ep:minus',
                label: '关闭全部标签页',
                command: () => {
                  closeAllTags()
                }
              }
            ]"
            :tag-item="item"
            @visible-change="visibleChange"
          >
            <div>
              <router-link :ref="tagLinksRefs.set" v-slot="{ navigate }" :to="{ ...item }" custom>
                <div
                  :class="`h-full flex items-center justify-center whitespace-nowrap pl-15px ${prefixCls}__item--label`"
                  @click="navigate"
                >
                  <Icon
                    v-if="
                      tagsViewIcon &&
                      (item?.meta?.icon ||
                        (item?.matched &&
                          item.matched[0] &&
                          item.matched[item.matched.length - 1].meta?.icon))
                    "
                    :icon="item?.meta?.icon || item.matched[item.matched.length - 1].meta.icon"
                    :size="12"
                    class="mr-5px"
                  />
                  {{
                    (item?.meta?.title || '') +
                    (item?.meta?.titleSuffix ? ` (${item?.meta?.titleSuffix})` : '')
                  }}
                  <Icon
                    :class="`${prefixCls}__item--close`"
                    :size="12"
                    color="#333"
                    icon="ep:close"
                    @click.prevent.stop="closeSelectedTag(item)"
                  />
                </div>
              </router-link>
            </div>
          </ContextMenu>
        </div>
      </ElScrollbar>
    </div>
    <span
      :class="tagsViewImmerse ? '' : `${prefixCls}__tool`"
      class="h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center"
      @click="move(200)"
    >
      <Icon
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
        color="var(--el-text-color-placeholder)"
        icon="ep:d-arrow-right"
      />
    </span>
    <span
      :class="tagsViewImmerse ? '' : `${prefixCls}__tool`"
      class="h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center"
      @click="refreshSelectedTag(selectedTag)"
    >
      <Icon
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
        color="var(--el-text-color-placeholder)"
        icon="ep:refresh-right"
      />
    </span>
    <ContextMenu
      :schema="[
        {
          icon: 'ep:refresh',
          label: '重新加载',
          command: () => {
            refreshSelectedTag(selectedTag)
          }
        },
        {
          icon: 'ep:close',
          label: '关闭标签页',
          disabled: !!visitedViews?.length && selectedTag?.meta.affix,
          command: () => {
            closeSelectedTag(selectedTag!)
          }
        },
        {
          divided: true,
          icon: 'ep:d-arrow-left',
          label: '关闭左侧标签页',
          disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath,
          command: () => {
            closeLeftTags()
          }
        },
        {
          icon: 'ep:d-arrow-right',
          label: '关闭右侧标签页',
          disabled:
            !!visitedViews?.length &&
            selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath,
          command: () => {
            closeRightTags()
          }
        },
        {
          divided: true,
          icon: 'ep:discount',
          label: '关闭其他标签页',
          command: () => {
            closeOthersTags()
          }
        },
        {
          icon: 'ep:minus',
          label: '关闭全部标签页',
          command: () => {
            closeAllTags()
          }
        }
      ]"
      trigger="click"
    >
      <span
        :class="tagsViewImmerse ? '' : `${prefixCls}__tool`"
        class="block h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center"
      >
        <Icon
          :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
          color="var(--el-text-color-placeholder)"
          icon="ep:menu"
        />
      </span>
    </ContextMenu>
  </div>
</template>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tags-view;

.#{$prefix-cls} {
  :deep(.#{$elNamespace}-scrollbar__view) {
    height: 100%;
  }

  &__tool {
    position: relative;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-left: 1px solid var(--el-border-color);
      content: '';
    }

    &--first {
      &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-right: 1px solid var(--el-border-color);
        border-left: none;
        content: '';
      }
    }
  }

  &__item {
    position: relative;
    top: 3px;
    height: calc(100% - 6px);
    padding-right: 15px;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    box-sizing: border-box;

    &--close {
      position: absolute;
      top: 50%;
      right: 5px;
      display: none;
      transform: translate(0, -50%);
    }

    &:not(.#{$prefix-cls}__item--affix):hover {
      .#{$prefix-cls}__item--close {
        display: block;
      }
    }
  }

  &__item--icon {
    padding-right: 20px;
  }

  &__item:not(.is-active) {
    &:hover {
      color: var(--el-color-primary);
    }
  }

  &__item.is-active {
    color: var(--el-color-white);
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);

    .#{$prefix-cls}__item--close {
      :deep(span) {
        color: var(--el-color-white) !important;
      }
    }
  }

  &__item--immerse {
    top: 2px;
    height: calc(100% - 3px);
    padding-right: 35px;
    margin: 0 -10px;
    border: none !important;
    -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg width='68' height='34' viewBox='0 0 68 34' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='m27,0c-7.99582,0 -11.95105,0.00205 -12,12l0,6c0,8.284 -0.48549,16.49691 -8.76949,16.49691l54.37857,-0.11145c-8.284,0 -8.60908,-8.10146 -8.60908,-16.38546l0,-6c0.11145,-12.08445 -4.38441,-12 -12,-12l-13,0z' fill='%23409eff'/%3E%3C/svg%3E")
      12 27 15;

    .#{$prefix-cls}__item--label {
      padding-left: 35px;
    }

    .#{$prefix-cls}__item--close {
      right: 20px;
    }
  }

  &__item--immerse--icon {
    padding-right: 35px;
  }

  &__item--immerse:not(.is-active) {
    &:hover {
      color: var(--el-color-white);
      background-color: var(--el-color-primary);

      .#{$prefix-cls}__item--close {
        :deep(span) {
          color: var(--el-color-white) !important;
        }
      }
    }
  }
}

.dark {
  .#{$prefix-cls} {
    &__tool {
      &--first {
        &::after {
          display: none;
        }
      }
    }

    &__item {
      border: 1px solid var(--el-border-color);
    }

    &__item:not(.is-active) {
      &:hover {
        color: var(--el-color-primary);
      }
    }

    &__item.is-active {
      color: var(--el-color-white);
      background-color: var(--el-color-primary);
      border: 1px solid var(--el-color-primary);

      .#{$prefix-cls}__item--close {
        :deep(span) {
          color: var(--el-color-white) !important;
        }
      }
    }

    &__item--immerse:not(.is-active) {
      &:hover {
        color: var(--el-color-white);
      }
    }
  }
}
</style>
