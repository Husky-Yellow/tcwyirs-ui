<template>
  <AppCard title="资源使用看板">
    <template #header>
      <div class="py-11px px-20px">
        资源使用看板
        <el-link type="primary" :underline="false" @click="handleViewApplications">
          我申请的资源
        </el-link>
      </div>
    </template>

    <div class="chart-container" style="height: 200px; width: 100%">
      <Echart :options="chartOptions" :height="200" width="100%" />
    </div>

    <LegendList class="mt-16px" :items="legendData" />
  </AppCard>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Echart } from '@/components/Echart'
import { AppCard } from '@/components/AppCard'
import LegendList from './LegendList.vue'
import { createDonutChart } from '../utils/echarts-config'

defineOptions({ name: 'ResourceUsageCard' })

// 图例数据
const legendData = ref([
  { name: '数据资源', value: 1442, color: '#5470C6' },
  { name: '组件资源', value: 1442, color: '#91CC75' },
  { name: '应用资源', value: 1442, color: '#FAC858' }
])

// 图表配置 - 使用工厂函数创建
const chartOptions = reactive(
  createDonutChart({
    data: legendData.value,
    centerText: '总数量\n4,326',
    innerRadius: '50%',
    outerRadius: '75%',
    showPercentInside: false
  })
)

// 处理查看我申请的资源
const handleViewApplications = () => {
  ElMessage.info('查看我申请的资源')
  // TODO: 跳转到资源申请页面
}
</script>

<style lang="scss" scoped>
.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
