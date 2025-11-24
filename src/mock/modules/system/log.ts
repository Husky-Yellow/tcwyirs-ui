import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import { Random } from '../../utils'

// 生成操作日志数据
const generateMockOperateLogs = (count: number) => {
  const logs: any[] = []
  const actions = ['新增', '修改', '删除', '查询', '导出', '导入', '审批', '发布']
  const types = ['用户管理', '角色管理', '菜单管理', '部门管理', '岗位管理', '字典管理']

  for (let i = 1; i <= count; i++) {
    logs.push({
      id: Random.integer(1, 100000),
      traceId: Random.guid(),
      userType: Random.pick([1, 2]),
      userId: Random.integer(1, 100),
      userName: Random.cname(),
      type: Random.pick(types),
      subType: '',
      bizId: Random.integer(1, 1000),
      action: Random.pick(actions),
      extra: JSON.stringify({ detail: Random.csentence(5, 15) }),
      requestMethod: Random.pick(['GET', 'POST', 'PUT', 'DELETE']),
      requestUrl: `/admin-api/system/${Random.pick(['user', 'role', 'menu', 'dept'])}/${Random.pick(['page', 'create', 'update', 'delete'])}`,
      userIp: Random.ip(),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      creator: Random.cname(),
      creatorName: Random.cname(),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return logs
}

// 生成登录日志数据
const generateMockLoginLogs = (count: number) => {
  const logs: any[] = []
  const results = [0, 10, 20, 30] // 0-成功 10-账号或密码不正确 20-验证码不正确 30-账号被禁用

  for (let i = 1; i <= count; i++) {
    const result = Random.pick(results)
    logs.push({
      id: Random.integer(1, 100000),
      logType: Random.pick([100, 200]), // 100-登录 200-登出
      traceId: Random.guid(),
      userId: result === 0 ? Random.integer(1, 100) : 0,
      userType: Random.pick([1, 2]),
      username: Random.pick(['admin', 'user', 'test']),
      result: result,
      status: result === 0 ? 0 : 1, // 0-成功 1-失败
      userIp: Random.ip(),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return logs
}

const mockOperateLogs = generateMockOperateLogs(100)
const mockLoginLogs = generateMockLoginLogs(80)

const mockConfigs: MockConfig[] = [
  // ==================== 操作日志 ====================
  // 获取操作日志分页列表
  {
    url: '/admin-api/system/operate-log/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockOperateLogs.slice(start, end),
          total: mockOperateLogs.length
        },
        msg: ''
      }
    }
  },

  // ==================== 登录日志 ====================
  // 获取登录日志分页列表
  {
    url: '/admin-api/system/login-log/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockLoginLogs.slice(start, end),
          total: mockLoginLogs.length
        },
        msg: ''
      }
    }
  }
]

export default mockConfigs
