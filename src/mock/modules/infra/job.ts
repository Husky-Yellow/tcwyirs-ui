import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import { Random } from '../../utils'

// 生成定时任务数据
const generateMockJobs = (count: number) => {
  const jobs: any[] = []
  const handlerNames = [
    'sysUserSessionTimeoutJob',
    'accountExpireJob',
    'dataBackupJob',
    'emailSendJob',
    'reportGenerateJob'
  ]

  for (let i = 1; i <= count; i++) {
    jobs.push({
      id: Random.integer(1, 1000),
      name: Random.pick([
        '用户会话超时清理',
        '账号过期检查',
        '数据备份任务',
        '邮件发送任务',
        '报表生成任务'
      ]),
      status: Random.pick([0, 1]), // 0-停止 1-运行
      handlerName: Random.pick(handlerNames),
      handlerParam: Random.pick(['', 'param1=value1', 'days=7']),
      cronExpression: Random.pick([
        '0 0 0 * * ?',
        '0 0/30 * * * ?',
        '0 0 12 * * ?',
        '0 15 10 ? * *'
      ]),
      retryCount: Random.integer(0, 3),
      retryInterval: Random.integer(1000, 5000),
      monitorTimeout: Random.integer(0, 30000),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
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
        data: Random.integer(1000, 9999),
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
      const times: any[] = []
      for (let i = 1; i <= 5; i++) {
        times.push(Random.datetime('yyyy-MM-dd HH:mm:ss'))
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
