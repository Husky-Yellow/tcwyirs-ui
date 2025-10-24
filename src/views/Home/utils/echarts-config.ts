import type { EChartsOption } from 'echarts'

/**
 * 创建环形图（Donut Chart）配置
 */
export interface DonutChartData {
  value: number
  name: string
  color: string
}

export interface DonutChartOptions {
  data: DonutChartData[]
  centerText?: string
  innerRadius?: string
  outerRadius?: string
  showPercentInside?: boolean
}

export function createDonutChart(options: DonutChartOptions): EChartsOption {
  const {
    data,
    centerText,
    innerRadius = '40%',
    outerRadius = '75%',
    showPercentInside = true
  } = options

  // 计算总数
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      show: false
    },
    series: [
      // 环形图
      {
        name: '资源占比',
        type: 'pie',
        radius: [innerRadius, outerRadius],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: (params: any) => {
            return showPercentInside
              ? `${Math.round(params.percent)}%`
              : `${params.name}\n${params.percent}%`
          },
          fontSize: 14,
          fontWeight: 'bold',
          color: showPercentInside ? '#fff' : '#666',
          position: showPercentInside ? 'inside' : 'outside'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: !showPercentInside,
          length: 10,
          length2: 10
        },
        data: data.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color },
          label: {
            show: true,
            position: showPercentInside ? 'inside' : 'outside'
          }
        }))
      },
      // 中心文字
      ...(centerText
        ? [
            {
              name: '中心文字',
              type: 'pie' as const,
              radius: ['0%', `${parseInt(innerRadius) - 1}%`],
              avoidLabelOverlap: false,
              silent: true,
              label: {
                show: true,
                position: 'center' as const,
                formatter: () => centerText || `总数量\n${total.toLocaleString()}`,
                fontSize: 16,
                fontWeight: 'bold' as const,
                color: '#333',
                lineHeight: 24
              },
              labelLine: {
                show: false
              },
              data: [{ value: 1, itemStyle: { color: 'transparent' } }]
            }
          ]
        : [])
    ]
  }
}
