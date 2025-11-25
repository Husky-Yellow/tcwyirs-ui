<template>
  <AppCard>
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

var option = {
  title: {
    text: '总数量 ',
    subtext: '1,430',
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
      data: [
        { value: 1442, name: '数据资源', itemStyle: { color: '#8C8D9F' } },
        { value: 1442, name: '应用资源', itemStyle: { color: '#6BC2A2' } },
        { value: 1442, name: '组件资源', itemStyle: { color: '#4F98E8' } },
      ],
      label: {
        position: 'inside',  // 标签位于圆环内部
        formatter: function(params) {
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
}




// 图表配置 - 使用工厂函数创建
const chartOptions = reactive(option)
// const chartOptions = reactive(
//   createDonutChart({
//     data: legendData.value,
//     centerText: '总数量\n4,326',
//     innerRadius: '50%',
//     outerRadius: '75%',
//     showPercentInside: false
//   })
// )
</script>
