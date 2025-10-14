import { ref, onMounted } from 'vue'
import { getMarketplaceDetail } from '@/api/marketplace'
import type { ResourceDetail } from '@/api/marketplace'

// 默认的资源详情（mock 数据，不含 id）
const DEFAULT_DETAIL: Omit<ResourceDetail, 'id'> = {
  title: '停车缴费记录',
  description:
    '实时数据 Pulsar 消息推送，基于 Apache Pulsar 分布式消息系统，能实现高吞吐、低延迟的实时数据推送；支持多租户和高可用；通过 Topic 分层机制，确保数据准确推送至不同客户群体；通过分区保证同一分区内消息有序；Exactly-Once 语义保证数据一致；提供多协议接入能力，无缝对接各类数据源；运维友好且高可靠，适应容灾等场景。',
  basicInfo: {
    resourceName: '近一年车辆进出停车场记录',
    resourceTag: '标签一',
    owner: 'hsakndaks',
    creator: '李存',
    application: 'hsakndaks',
    contact: '小昱',
    descriptionText: '这是一段内容注释，这是一段内容注释，这是一段内容注释。',
    publishTime: '2018-10-31 23:12:00',
    contactPhone: '2178961893831'
  },
  dataInfo: {
    applications: '21234',
    visits: '123112',
    monthlyHits: '21'
  },
  reviews: {
    positive: ['资源内容丰富', '操作使用便捷', '符合日常需求', '资源数据精准', '这是一个好资源', '这是一个很好的好评'],
    negative: ['资源内容不符合描述', '体验不佳', '内容出错', '与业务场景不太匹配', '数据内容出现错误', '申请时长太久'],
    score: 79
  },
  comments: [
    {
      id: '1',
      userName: '初灼',
      time: '2025-10-01 14:20',
      content: '太好了，这个是什么神仙资源，太棒了！',
      score: 92,
      showReplies: false,
      replies: [
        { id: '1-1', userName: '小昱', time: '2025-10-01 14:25', content: '我也觉得好用，太赞了' }
      ]
    },
    {
      id: '2',
      userName: '初灼',
      time: '2025-10-01 14:20',
      content: '太好了，这个是什么神仙资源，太棒了，使用感极佳。',
      score: 99,
      showReplies: false,
      replies: [
        { id: '2-1', userName: '张三', time: '2025-10-01 15:30', content: '确实不错，推荐使用' },
        { id: '2-2', userName: '李四', time: '2025-10-01 16:00', content: '同意，功能很强大' }
      ]
    },
    {
      id: '3',
      userName: '小昱A',
      time: '2025-10-01 14:20',
      content: '资源内容丰富，操作使用便捷，符合日常需求。',
      score: 88,
      showReplies: false,
      replies: []
    },
    {
      id: '4',
      userName: '民本',
      time: '2025-10-01 14:20',
      content: '这是一个只讲技术评分的样子',
      score: 75,
      showReplies: false,
      replies: []
    },
    {
      id: '5',
      userName: '酒酒',
      time: '2025-10-01 14:20',
      content: '这个资源使用起来一般，太一般了。',
      score: 46,
      showReplies: false,
      replies: [
        { id: '5-1', userName: '王五', time: '2025-10-01 17:00', content: '可能是使用方式不对吧' },
        { id: '5-2', userName: '赵六', time: '2025-10-01 17:30', content: '我觉得还可以' }
      ]
    }
  ]
}

export const useMarketplaceDetailData = (id: string) => {
  const resourceDetail = ref<ResourceDetail>({ id, ...DEFAULT_DETAIL })

  const load = async () => {
    try {
      const data = await getMarketplaceDetail(id)
      // 兜底合并，避免后端缺字段导致渲染异常
      resourceDetail.value = { id, ...DEFAULT_DETAIL, ...data }
    } catch (e) {
      // 保留默认 mock 数据
      console.warn('[useMarketplaceDetailData] 使用本地 mock 数据:', e)
    }
  }

  // 在组件使用时自动加载
  onMounted(load)

  return { resourceDetail, reload: load }
}
