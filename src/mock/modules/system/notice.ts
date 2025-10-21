import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import Mock from 'mockjs'

// 生成通知公告数据
const generateMockNotices = (count: number) => {
  const notices = []
  const types = [1, 2, 3] // 1-通知 2-公告 3-其他

  for (let i = 1; i <= count; i++) {
    const type = Mock.Random.pick(types)
    notices.push({
      id: Mock.Random.integer(1, 1000),
      title: Mock.Random.pick([
        '系统维护通知',
        '重要公告',
        '节假日放假通知',
        '系统升级公告',
        '安全提醒',
        '新功能上线通知'
      ]),
      type: type,
      content: Mock.Random.cparagraph(3, 7),
      status: Mock.Random.pick([0, 1]), // 0-草稿 1-已发布
      remark: Mock.Random.csentence(5, 15),
      creator: Mock.Random.cname(),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return notices
}

const mockNotices = generateMockNotices(20)

const mockConfigs: MockConfig[] = [
  // 获取通知公告分页列表
  {
    url: '/admin-api/mq/notice/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockNotices.slice(start, end),
          total: mockNotices.length
        },
        msg: ''
      }
    }
  },

  // 获取通知公告详情
  {
    url: '/admin-api/mq/notice/get',
    type: 'get',
    response: ({ query }): ApiResponse<any> => {
      const { id } = query
      const notice = mockNotices.find((n) => n.id === Number(id)) || mockNotices[0]
      return {
        code: 0,
        data: notice,
        msg: ''
      }
    }
  },

  // 创建通知公告
  {
    url: '/admin-api/mq/notice/create',
    type: 'post',
    response: (): ApiResponse<number> => {
      return {
        code: 0,
        data: Mock.Random.integer(1000, 9999),
        msg: '创建成功'
      }
    }
  },

  // 更新通知公告
  {
    url: '/admin-api/mq/notice/update',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '更新成功'
      }
    }
  },

  // 删除通知公告
  {
    url: '/admin-api/mq/notice/delete',
    type: 'delete',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '删除成功'
      }
    }
  },

  // 推送通知公告
  {
    url: '/admin-api/mq/notice/push',
    type: 'post',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '推送成功'
      }
    }
  }
]

export default mockConfigs
