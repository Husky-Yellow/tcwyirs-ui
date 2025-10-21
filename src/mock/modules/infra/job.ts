import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import Mock from 'mockjs'

// 生成定时任务数据
const generateMockJobs = (count: number) => {
  const jobs = []
  const handlerNames = [
    'sysUserSessionTimeoutJob',
    'accountExpireJob',
    'dataBackupJob',
    'emailSendJob',
    'reportGenerateJob'
  ]

  for (let i = 1; i <= count; i++) {
    jobs.push({
      id: Mock.Random.integer(1, 1000),
      name: Mock.Random.pick([
        '用户会话超时清理',
        '账号过期检查',
        '数据备份任务',
        '邮件发送任务',
        '报表生成任务'
      ]),
      status: Mock.Random.pick([0, 1]), // 0-停止 1-运行
      handlerName: Mock.Random.pick(handlerNames),
      handlerParam: Mock.Random.pick(['', 'param1=value1', 'days=7']),
      cronExpression: Mock.Random.pick([
        '0 0 0 * * ?',
        '0 0/30 * * * ?',
        '0 0 12 * * ?',
        '0 15 10 ? * *'
      ]),
      retryCount: Mock.Random.integer(0, 3),
      retryInterval: Mock.Random.integer(1000, 5000),
      monitorTimeout: Mock.Random.integer(0, 30000),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return jobs
}

const mockJobs = generateMockJobs(15)

const mockConfigs: MockConfig[] = [
  // 获取定时任务分页列表
  {
    url: '/admin-api/infra/job/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockJobs.slice(start, end),
          total: mockJobs.length
        },
        msg: ''
      }
    }
  },

  // 获取定时任务详情
  {
    url: '/admin-api/infra/job/get',
    type: 'get',
    response: ({ query }): ApiResponse<any> => {
      const { id } = query
      const job = mockJobs.find((j) => j.id === Number(id)) || mockJobs[0]
      return {
        code: 0,
        data: job,
        msg: ''
      }
    }
  },

  // 创建定时任务
  {
    url: '/admin-api/infra/job/create',
    type: 'post',
    response: (): ApiResponse<number> => {
      return {
        code: 0,
        data: Mock.Random.integer(1000, 9999),
        msg: '创建成功'
      }
    }
  },

  // 更新定时任务
  {
    url: '/admin-api/infra/job/update',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '更新成功'
      }
    }
  },

  // 删除定时任务
  {
    url: '/admin-api/infra/job/delete',
    type: 'delete',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '删除成功'
      }
    }
  },

  // 更新定时任务状态
  {
    url: '/admin-api/infra/job/update-status',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '状态更新成功'
      }
    }
  },

  // 立即执行定时任务
  {
    url: '/admin-api/infra/job/trigger',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '任务执行成功'
      }
    }
  },

  // 获取定时任务的下N次执行时间
  {
    url: '/admin-api/infra/job/get_next_times',
    type: 'get',
    response: (): ApiResponse<string[]> => {
      const times = []
      const now = new Date()
      for (let i = 1; i <= 5; i++) {
        const nextTime = new Date(now.getTime() + i * 3600000)
        times.push(Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'))
      }
      return {
        code: 0,
        data: times,
        msg: ''
      }
    }
  }
]

export default mockConfigs
