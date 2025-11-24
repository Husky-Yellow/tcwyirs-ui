<template>
  <ElDialog v-if="isModal" v-model="showSearch" :show-close="false" title="菜单搜索">
    <el-select
      filterable
      :reserve-keyword="false"
      remote
      placeholder="请输入菜单内容"
      :remote-method="remoteMethod"
      style="width: 100%"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </ElDialog>
  <el-select
    v-else-if="isInput"
    filterable
    :reserve-keyword="false"
    remote
    placeholder="搜索"
    :remote-method="remoteMethod"
    class="search-select !w-260px"
    clearable
    @change="handleChange"
  >
    <template #prefix>
      <el-icon class="el-input__icon"><Search /></el-icon>
    </template>
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
  <div v-else class="custom-hover" @click.stop="showTopSearch = !showTopSearch">
    <Icon icon="ep:search" />
    <el-select
      @click.stop
      filterable
      :reserve-keyword="false"
      remote
      placeholder="请输入菜单内容"
      :remote-method="remoteMethod"
      class="overflow-hidden transition-all-600"
      :class="showTopSearch ? '!w-220px ml2' : '!w-0'"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'

defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  isInput: {
    type: Boolean,
    default: false
  }
})

const router = useRouter() // 路由对象
const showSearch = ref(false) // 是否显示弹框
const showTopSearch = ref(false) // 是否显示顶部搜索框
const value: Ref = ref('') // 用户输入的值

const routers = router.getRoutes() // 路由对象
const options = computed(() => {
  // 提示选项
  if (!value.value) {
    return []
  }
  const list = routers.filter((item: any) => {
    if (item.meta.title?.indexOf(value.value) > -1 || item.path.indexOf(value.value) > -1) {
      return true
    }
  })
  return list.map((item) => {
    return {
      label: `${item.meta.title}${item.path}`,
      value: item.path
    }
  })
})

function remoteMethod(data) {
  // 这里可以执行相应的操作（例如打开搜索框等）
  value.value = data
}

function handleChange(path) {
  router.push({ path })
  hiddenSearch()
  hiddenTopSearch()
}

function hiddenSearch() {
  showSearch.value = false
}

function hiddenTopSearch() {
  showTopSearch.value = false
}

onMounted(() => {
  window.addEventListener('keydown', listenKey)
  window.addEventListener('click', hiddenTopSearch)
})

onUnmounted(() => {
  window.removeEventListener('keydown', listenKey)
  window.removeEventListener('click', hiddenTopSearch)
})

// 监听 ctrl + k
function listenKey(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    // 阻止触发浏览器默认事件
    event.preventDefault()
    showSearch.value = !showSearch.value
    // 这里可以执行相应的操作（例如打开搜索框等）
  }
}

defineExpose({
  openSearch: () => {
    showSearch.value = true
  }
})
</script>

<style scoped>
.search-select :deep(.el-select__wrapper) {
  background-color: #bfbfbf4d;
}
</style>
