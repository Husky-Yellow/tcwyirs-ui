import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import Mock from 'mockjs'

// 生成API访问日志数据
const generateMockApiAccessLogs = (count: number) => {
  const logs = []
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
      id: Mock.Random.integer(1, 100000),
      traceId: Mock.Random.guid(),
      userId: Mock.Random.integer(1, 100),
      userType: Mock.Random.pick([1, 2]), // 1-用户 2-管理员
      applicationName: 'tcwyirs-ui',
      requestMethod: Mock.Random.pick(methods),
      requestUrl: Mock.Random.pick(urls),
      requestParams: JSON.stringify({ pageNo: 1, pageSize: 10 }),
      userIp: Mock.Random.ip(),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      operateModule: Mock.Random.pick(['系统管理', '流程管理', '基础设施']),
      operateName: Mock.Random.pick(['查询列表', '新增', '修改', '删除']),
      operateType: Mock.Random.integer(1, 5),
      beginTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      endTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      duration: Mock.Random.integer(10, 5000),
      resultCode: Mock.Random.pick([0, 500]),
      resultMsg: Mock.Random.pick(['', '成功', '参数错误', '权限不足']),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return logs
}

// 生成API错误日志数据
const generateMockApiErrorLogs = (count: number) => {
  const logs = []

  for (let i = 1; i <= count; i++) {
    logs.push({
      id: Mock.Random.integer(1, 10000),
      traceId: Mock.Random.guid(),
      userId: Mock.Random.integer(1, 100),
      userType: Mock.Random.pick([1, 2]),
      applicationName: 'tcwyirs-ui',
      requestMethod: Mock.Random.pick(['GET', 'POST', 'PUT', 'DELETE']),
      requestUrl: Mock.Random.pick(['/admin-api/system/user/page', '/admin-api/system/role/list']),
      requestParams: JSON.stringify({ id: 123 }),
      userIp: Mock.Random.ip(),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      exceptionTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      exceptionName: Mock.Random.pick([
        'NullPointerException',
        'IllegalArgumentException',
        'ServiceException'
      ]),
      exceptionMessage: Mock.Random.csentence(10, 30),
      exceptionRootCauseMessage: Mock.Random.csentence(10, 30),
      exceptionStackTrace: `java.lang.NullPointerException\n\tat com.example.service.UserService.getUser(UserService.java:123)\n\tat com.example.controller.UserController.getUser(UserController.java:45)`,
      exceptionClassName: 'com.example.controller.UserController',
      exceptionFileName: 'UserController.java',
      exceptionMethodName: 'getUser',
      exceptionLineNumber: Mock.Random.integer(1, 500),
      processStatus: Mock.Random.pick([0, 1, 2]), // 0-未处理 1-已处理 2-已忽略
      processTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      processUserId: Mock.Random.integer(1, 10),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
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
