<template>
  <AppCard class="mt-16px">
    <template #header>
      <div class="px-20px pt-25px">
        资源使用看板
      </div>
    </template>
    <div class="p-24px">
      <div style="height: 186px; width: 100%">
        <Echart :options="chartOptions" :height="186" width="100%" />
      </div>

      <LegendList :items="legendData" />
    </div>
  </AppCard>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { Echart } from '@/components/Echart'
import { AppCard } from '@/components/AppCard'
import LegendList from './LegendList.vue'
import { getWorkbenchUsageBoard, type ResourceUsageBoardRespVO } from '@/api/resource/workbench'

defineOptions({ name: 'ResourceUsageCard' })

// 资源类型颜色映射
const RESOURCE_TYPE_COLORS: Record<string, string> = {
  '数据资源': '#8C8D9F',
  '应用资源': '#6BC2A2',
  '组件资源': '#4F98E8'
}

// 图例数据
const legendData = ref([
  { name: '数据资源', value: 0, color: RESOURCE_TYPE_COLORS['数据资源'] },
  { name: '组件资源', value: 0, color: RESOURCE_TYPE_COLORS['组件资源'] },
  { name: '应用资源', value: 0, color: RESOURCE_TYPE_COLORS['应用资源'] }
])

// 图表配置
const chartOptions = reactive({
  title: {
    text: '总数量 ',
    subtext: '0',
    left: 'center',
    top: 'center',
    textStyle: {
      fontSize: 18,
      fontWeight: 'normal',
    },
  },
  tooltip: {
    trigger: 'none',  // 禁用所有悬浮内容
  },
  legend: {
    show: false,  // 隐藏左上角的图例
  },
  series: [
    {
      name: '资源类型',
      type: 'pie',
      radius: ['55%', '100%'],  // 增大圆环的厚度
      center: ['50%', '50%'],  // 定义饼图的中心位置
      data: [] as any[],
      label: {
        position: 'inside',  // 标签位于圆环内部
        formatter: function(params: any) {
          return Math.round(params.percent) + '%';  // 将百分比四舍五入为整数
        },
        fontSize: 12,  // 设置字体大小
        color: '#fff',  // 设置字体颜色
      },
      labelLine: {
        show: false,  // 隐藏连接线
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
  ],
})

// 加载资源使用看板数据
const loadUsageBoardData = async () => {
  try {
    const data = await getWorkbenchUsageBoard()

    // 更新总数量
    chartOptions.title.subtext = String(data.totalCount || 0)

    // 更新图例数据
    legendData.value = [
      {
        name: '数据资源',
        value: data.dataResourceCount || 0,
        color: RESOURCE_TYPE_COLORS['数据资源']
      },
      {
        name: '组件资源',
        value: data.componentResourceCount || 0,
        color: RESOURCE_TYPE_COLORS['组件资源']
      },
      {
        name: '应用资源',
        value: data.appResourceCount || 0,
        color: RESOURCE_TYPE_COLORS['应用资源']
      }
    ]

    // 更新图表数据
    chartOptions.series[0].data = legendData.value.map(item => ({
      value: item.value,
      name: item.name,
      itemStyle: { color: item.color }
    }))
  } catch (error) {
    console.error('加载资源使用看板数据失败:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadUsageBoardData()
})
</script>
