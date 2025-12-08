import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { FeedbackVO } from '@/views/other/feedback/types'
import { FeedbackStatus, FeedbackType } from '@/views/other/feedback/types'

// Mock 数据
const feedbackData: FeedbackVO[] = [
  {
    id: 1,
    title: '功能问题',
    description: '这是一个问题描述',
    type: FeedbackType.BUG,
    status: FeedbackStatus.PENDING,
    submitter: '柯伟雄',
    category: '帮车服务端反',
    createTime: '2017-01-31 23:12:00'
  },
  {
    id: 2,
    title: '部署使用问题',
    description: '这是一个问题描述需要一个问题描述一个...',
    type: FeedbackType.FEATURE,
    status: FeedbackStatus.PROCESSING,
    submitter: '柯伟雄',
    category: '帮车服务端反',
    createTime: '2017-01-31 23:12:00'
  },
  {
    id: 3,
    title: '插件与功能冲突',
    description: '这是一个问题',
    type: FeedbackType.BUG,
    status: FeedbackStatus.RESOLVED,
    submitter: '柯伟雄',
    category: '帮车服务端反',
    createTime: '2017-01-31 23:15:00'
  },
  {
    id: 4,
    title: '内容与其他相似',
    description: '这是一个问题',
    type: FeedbackType.IMPROVEMENT,
    status: FeedbackStatus.RESOLVED,
    submitter: '柯伟雄',
    category: '帮车服务端反',
    createTime: '2017-01-31 23:15:00'
  },
  {
    id: 5,
    title: '其他问题',
    description: '这是一个问题',
    type: FeedbackType.OTHER,
    status: FeedbackStatus.RESOLVED,
    submitter: '柯伟雄',
    category: '帮车服务端反',
    createTime: '2017-01-31 23:15:00'
  },
  {
    id: 6,
    title: '其他问题',
    description: '这是一个问题',
    type: FeedbackType.OTHER,
    status: FeedbackStatus.RESOLVED,
    submitter: '柯伟雄',
    category: '帮车管理端反',
    createTime: '2017-01-31 23:15:00'
  },
  {
    id: 7,
    title: '组件与其他不相',
    description: '这是一个问题',
    type: FeedbackType.FEATURE,
    status: FeedbackStatus.RESOLVED,
    submitter: '柯伟雄',
    category: '组件资源反馈',
    createTime: '2017-01-31 23:15:00'
  },
  {
    id: 8,
    title: '组件资源反馈',
    description: '这是一个问题',
    type: FeedbackType.BUG,
    status: FeedbackStatus.RESOLVED,
    submitter: '柯伟雄',
    category: '组件资源反馈',
    createTime: '2017-01-31 23:15:00'
  },
  {
    id: 9,
    title: '组件资源反馈',
    description: '这是一个问题',
    type: FeedbackType.IMPROVEMENT,
    status: FeedbackStatus.RESOLVED,
    submitter: '柯伟雄',
    category: '组件资源反馈',
    createTime: '2017-01-31 23:15:00'
  },
  {
    id: 10,
    title: '组件资源反馈',
    description: '这是一个问题',
    type: FeedbackType.OTHER,
    status: FeedbackStatus.RESOLVED,
    submitter: '柯伟雄',
    category: '组件资源反馈',
    createTime: '2017-01-31 23:15:00'
  }
]

const mockConfigs: MockConfig[] = [
  {
    // 我提交的反馈列表
    url: '/admin-api/other/feedback/submitted/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<FeedbackVO>> => {
      const pageNo = Number(query.pageNo) || 1
      const pageSize = Number(query.pageSize) || 10
      const title = query.title as string
      const type = query.type
      const status = query.status

      let filteredData = [...feedbackData]

      if (title) {
        filteredData = filteredData.filter((item) =>
          item.title.toLowerCase().includes(title.toLowerCase())
        )
      }

      if (type !== undefined && type !== null && type !== '') {
        filteredData = filteredData.filter((item) => String(item.type) === String(type))
      }

      if (status !== undefined && status !== null && status !== '') {
        filteredData = filteredData.filter((item) => String(item.status) === String(status))
      }

      const start = (pageNo - 1) * pageSize
      const end = start + pageSize
      const list = filteredData.slice(start, end)

      return {
        code: 0,
        data: {
          list,
          total: filteredData.length
        },
        msg: ''
      }
    }
  },
  {
    // 我处理的反馈列表
    url: '/admin-api/other/feedback/handled/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<FeedbackVO>> => {
      const pageNo = Number(query.pageNo) || 1
      const pageSize = Number(query.pageSize) || 10
      const title = query.title as string
      const type = query.type
      const status = query.status

      let filteredData = [...feedbackData]

      if (title) {
        filteredData = filteredData.filter((item) =>
          item.title.toLowerCase().includes(title.toLowerCase())
        )
      }

      if (type !== undefined && type !== null && type !== '') {
        filteredData = filteredData.filter((item) => String(item.type) === String(type))
      }

      if (status !== undefined && status !== null && status !== '') {
        filteredData = filteredData.filter((item) => String(item.status) === String(status))
      }

      const start = (pageNo - 1) * pageSize
      const end = start + pageSize
      const list = filteredData.slice(start, end)

      return {
        code: 0,
        data: {
          list,
          total: filteredData.length
        },
        msg: ''
      }
    }
  },
  {
    // 反馈详情
    url: '/admin-api/other/feedback/detail/:id',
    type: 'get',
    response: ({ query }): ApiResponse<FeedbackVO | null> => {
      const id = Number(query.id)
      const feedback = feedbackData.find((item) => item.id === id)

      return {
        code: 0,
        data: feedback || null,
        msg: ''
      }
    }
  }
]

export default mockConfigs
