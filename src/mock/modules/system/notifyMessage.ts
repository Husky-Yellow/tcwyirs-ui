import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import { Random } from '../../utils'

// 生成站内信消息数据
const generateMockNotifyMessages = (count: number) => {
  const messages: any[] = []
  const templateTypes = [1, 2, 3] // 1-系统通知 2-业务通知 3-提醒通知

  for (let i = 1; i <= count; i++) {
    const readStatus = Random.boolean()
    messages.push({
      id: Random.integer(1, 10000),
      userId: Random.integer(1, 100),
      userType: Random.pick([1, 2]),
      templateId: Random.integer(1, 20),
      templateCode: `notify_template_${Random.integer(1, 20)}`,
      templateNickname: Random.pick([
        '系统升级通知',
        '任务提醒',
        '审批通知',
        '系统公告',
        '账号安全提醒'
      ]),
      templateContent: Random.csentence(15, 50),
      templateType: Random.pick(templateTypes),
      templateParams: JSON.stringify({
        userName: Random.cname(),
        time: Random.datetime('yyyy-MM-dd HH:mm:ss')
      }),
      readStatus: readStatus,
      readTime: readStatus ? Random.datetime('yyyy-MM-dd HH:mm:ss') : null,
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return messages
}

const mockNotifyMessages = generateMockNotifyMessages(50)

const mockConfigs: MockConfig[] = [
  // 获取站内信分页列表
  {
    url: '/admin-api/mq/notify-message/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockNotifyMessages.slice(start, end),
          total: mockNotifyMessages.length
        },
        msg: ''
      }
    }
  },

  // 获取我的站内信分页列表
  {
    url: '/admin-api/mq/notify-message/my-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)
      const myMessages = mockNotifyMessages.slice(0, 30)

      return {
        code: 0,
        data: {
          list: myMessages.slice(start, end),
          total: myMessages.length
        },
        msg: ''
      }
    }
  },

  // 批量标记已读
  {
    url: '/admin-api/mq/notify-message/update-read',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '标记成功'
      }
    }
  },

  // 标记所有站内信为已读
  {
    url: '/admin-api/mq/notify-message/update-all-read',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '全部已读'
      }
    }
  },

  // 获取未读站内信列表
  {
    url: '/admin-api/mq/notify-message/get-unread-list',
    type: 'get',
    response: (): ApiResponse<any[]> => {
      const unreadMessages = mockNotifyMessages.filter((msg) => !msg.readStatus).slice(0, 5)
      return {
        code: 0,
        data: unreadMessages,
        msg: ''
      }
    }
  },

  // 获取未读站内信数量
  {
    url: '/admin-api/mq/notify-message/get-unread-count',
    type: 'get',
    response: (): ApiResponse<number> => {
      const unreadCount = mockNotifyMessages.filter((msg) => !msg.readStatus).length
      return {
        code: 0,
        data: unreadCount,
        msg: ''
      }
    }
  }
]

export default mockConfigs
