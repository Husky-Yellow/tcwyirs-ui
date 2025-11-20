<template>
  <div class="py-10px">
    <IndexBanner />

    <!-- 主内容区域 - 动态渲染 -->
    <el-row :gutter="16">
      <!-- 左侧列 - 根据配置动态渲染 -->
      <el-col v-bind="leftColumn.span">
        <component
          :is="getComponentByType(comp.type)"
          v-for="comp in getSortedComponents(leftColumn.components)"
          :key="comp.type"
          v-bind="{ title: comp.title, showViewAll: comp.showViewAll, ...comp.props }"
        />
      </el-col>

      <!-- 右侧列 - 根据配置动态渲染 -->
      <el-col v-bind="rightColumn.span">
        <component
          :is="getComponentByType(comp.type)"
          v-for="comp in getSortedComponents(rightColumn.components)"
          :key="comp.type"
          v-bind="{ title: comp.title, showViewAll: comp.showViewAll, ...comp.props }"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import IndexBanner from './components/banner.vue'
import { useHomeLayout } from './composables/useHomeLayout'
import { getComponentByType } from './utils/componentMap'

defineOptions({ name: 'Index' })

const { leftColumn, rightColumn, getSortedComponents } = useHomeLayout()
</script>
