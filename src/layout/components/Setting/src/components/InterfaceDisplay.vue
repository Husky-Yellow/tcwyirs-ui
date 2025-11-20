<script lang="ts" setup>
import { setCssVar } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useWatermark } from '@/hooks/web/useWatermark'
import { useAppStore } from '@/store/modules/app'

defineOptions({ name: 'InterfaceDisplay' })

const { getPrefixCls } = useDesign()
const { setWatermark } = useWatermark()
const prefixCls = getPrefixCls('interface-display')
const appStore = useAppStore()

const water = ref()

// 面包屑
const breadcrumb = ref(appStore.getBreadcrumb)

const breadcrumbChange = (show: boolean) => {
  appStore.setBreadcrumb(show)
}

// 面包屑图标
const breadcrumbIcon = ref(appStore.getBreadcrumbIcon)

const breadcrumbIconChange = (show: boolean) => {
  appStore.setBreadcrumbIcon(show)
}

// 折叠图标
const hamburger = ref(appStore.getHamburger)

const hamburgerChange = (show: boolean) => {
  appStore.setHamburger(show)
}

// 尺寸图标
const size = ref(appStore.getSize)

const sizeChange = (show: boolean) => {
  appStore.setSize(show)
}

// 多语言图标
const locale = ref(appStore.getLocale)

const localeChange = (show: boolean) => {
  appStore.setLocale(show)
}

// 消息图标
const message = ref(appStore.getMessage)

const messageChange = (show: boolean) => {
  appStore.setMessage(show)
}

// 标签页
const tagsView = ref(appStore.getTagsView)

const tagsViewChange = (show: boolean) => {
  // 切换标签栏显示时，同步切换标签栏的高度
  setCssVar('--tags-view-height', show ? '35px' : '0px')
  appStore.setTagsView(show)
}

// 标签页沉浸
const tagsViewImmerse = ref(appStore.getTagsViewImmerse)

const tagsViewImmerseChange = (immerse: boolean) => {
  appStore.setTagsViewImmerse(immerse)
}

// 标签页图标
const tagsViewIcon = ref(appStore.getTagsViewIcon)

const tagsViewIconChange = (show: boolean) => {
  appStore.setTagsViewIcon(show)
}

// logo
const logo = ref(appStore.getLogo)

const logoChange = (show: boolean) => {
  appStore.setLogo(show)
}

// 菜单手风琴
const uniqueOpened = ref(appStore.getUniqueOpened)

const uniqueOpenedChange = (uniqueOpened: boolean) => {
  appStore.setUniqueOpened(uniqueOpened)
}

// 固定头部
const fixedHeader = ref(appStore.getFixedHeader)

const fixedHeaderChange = (show: boolean) => {
  appStore.setFixedHeader(show)
}

// 页脚
const footer = ref(appStore.getFooter)

const footerChange = (show: boolean) => {
  appStore.setFooter(show)
}

// 灰色模式
const greyMode = ref(appStore.getGreyMode)

const greyModeChange = (show: boolean) => {
  appStore.setGreyMode(show)
}

// 固定菜单
const fixedMenu = ref(appStore.getFixedMenu)

const fixedMenuChange = (show: boolean) => {
  appStore.setFixedMenu(show)
}

// 设置水印
const setWater = () => {
  setWatermark(water.value)
}

const layout = computed(() => appStore.getLayout)

watch(
  () => layout.value,
  (n) => {
    if (n === 'top') {
      appStore.setCollapse(false)
    }
  }
)
</script>

<template>
  <div :class="prefixCls">
    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '面包屑' }}</span>
      <ElSwitch v-model="breadcrumb" @change="breadcrumbChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '面包屑图标' }}</span>
      <ElSwitch v-model="breadcrumbIcon" @change="breadcrumbIconChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '折叠图标' }}</span>
      <ElSwitch v-model="hamburger" @change="hamburgerChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '尺寸图标' }}</span>
      <ElSwitch v-model="size" @change="sizeChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '多语言图标' }}</span>
      <ElSwitch v-model="locale" @change="localeChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '消息图标' }}</span>
      <ElSwitch v-model="message" @change="messageChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '标签页' }}</span>
      <ElSwitch v-model="tagsView" @change="tagsViewChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '标签页沉浸' }}</span>
      <ElSwitch v-model="tagsViewImmerse" @change="tagsViewImmerseChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '标签页图标' }}</span>
      <ElSwitch v-model="tagsViewIcon" @change="tagsViewIconChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '标志' }}</span>
      <ElSwitch v-model="logo" @change="logoChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '菜单手风琴' }}</span>
      <ElSwitch v-model="uniqueOpened" @change="uniqueOpenedChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '固定头部' }}</span>
      <ElSwitch v-model="fixedHeader" @change="fixedHeaderChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '页脚' }}</span>
      <ElSwitch v-model="footer" @change="footerChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '灰色模式' }}</span>
      <ElSwitch v-model="greyMode" @change="greyModeChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '固定菜单' }}</span>
      <ElSwitch v-model="fixedMenu" @change="fixedMenuChange" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-14px">{{ '水印' }}</span>
      <ElInput v-model="water" class="right-1 w-20" @change="setWater()" />
    </div>
  </div>
</template>
