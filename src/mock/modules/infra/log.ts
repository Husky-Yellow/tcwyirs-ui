import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import { Random } from '../../utils'

// 生成API访问日志数据
const generateMockApiAccessLogs = (count: number) => {
  const logs: any[] = []
  const methods = ['GET', 'POST', 'PUT', 'DELETE']
  const urls = [
    '/admin-api/system/user/page',
    '/admin-api/system/role/list',
    '/admin-api/system/menu/list',
    '/admin-api/bpm/task/todo-page',
    '/admin-api/infra/job/page'
  ]

  for (let i = 1; i <= count; i++) {
    logs.push({
      id: Random.integer(1, 100000),
      traceId: Random.guid(),
      userId: Random.integer(1, 100),
      userType: Random.pick([1, 2]), // 1-用户 2-管理员
      applicationName: 'tcwyirs-ui',
      requestMethod: Random.pick(methods),
      requestUrl: Random.pick(urls),
      requestParams: JSON.stringify({ pageNo: 1, pageSize: 10 }),
      userIp: Random.ip(),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      operateModule: Random.pick(['系统管理', '流程管理', '基础设施']),
      operateName: Random.pick(['查询列表', '新增', '修改', '删除']),
      operateType: Random.integer(1, 5),
      beginTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      endTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      duration: Random.integer(10, 5000),
      resultCode: Random.pick([0, 500]),
      resultMsg: Random.pick(['', '成功', '参数错误', '权限不足']),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return logs
}

// 生成API错误日志数据
const generateMockApiErrorLogs = (count: number) => {
  const logs: any[] = []

  for (let i = 1; i <= count; i++) {
    logs.push({
      id: Random.integer(1, 10000),
      traceId: Random.guid(),
      userId: Random.integer(1, 100),
      userType: Random.pick([1, 2]),
      applicationName: 'tcwyirs-ui',
      requestMethod: Random.pick(['GET', 'POST', 'PUT', 'DELETE']),
      requestUrl: Random.pick(['/admin-api/system/user/page', '/admin-api/system/role/list']),
      requestParams: JSON.stringify({ id: 123 }),
      userIp: Random.ip(),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      exceptionTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      exceptionName: Random.pick([
        'NullPointerException',
        'IllegalArgumentException',
        'ServiceException'
      ]),
      exceptionMessage: Random.csentence(10, 30),
      exceptionRootCauseMessage: Random.csentence(10, 30),
      exceptionStackTrace: `java.lang.NullPointerException\n\tat com.example.service.UserService.getUser(UserService.java:123)\n\tat com.example.controller.UserController.getUser(UserController.java:45)`,
      exceptionClassName: 'com.example.controller.UserController',
      exceptionFileName: 'UserController.java',
      exceptionMethodName: 'getUser',
      exceptionLineNumber: Random.integer(1, 500),
      processStatus: Random.pick([0, 1, 2]), // 0-未处理 1-已处理 2-已忽略
      processTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      processUserId: Random.integer(1, 10),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return logs
}

const mockApiAccessLogs = generateMockApiAccessLogs(100)
const mockApiErrorLogs = generateMockApiErrorLogs(30)

const mockConfigs: MockConfig[] = [
  // ==================== API访问日志 ====================
  // 获取API访问日志分页列表
  {
    url: '/admin-api/infra/api-access-log/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockApiAccessLogs.slice(start, end),
          total: mockApiAccessLogs.length
        },
        msg: ''
      }
    }
  },

  // ==================== API错误日志 ====================
  // 获取API错误日志分页列表
  {
    url: '/admin-api/infra/api-error-log/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockApiErrorLogs.slice(start, end),
          total: mockApiErrorLogs.length
        },
        msg: ''
      }
    }
  },

  // 更新API错误日志处理状态
  {
    url: '/admin-api/infra/api-error-log/update-status',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '更新成功'
      }
    }
  }
]

export default mockConfigs
