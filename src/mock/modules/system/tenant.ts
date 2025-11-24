import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import { Random } from '../../utils'

// 生成租户数据
const generateMockTenants = (count: number) => {
  const tenants: any[] = []

  for (let i = 1; i <= count; i++) {
    tenants.push({
      id: i,
      name: `${Random.pick(['科技', '信息', '网络', '数据', '智能'])}有限公司`,
      contactName: Random.cname(),
      contactMobile: Random.phone(),
      status: Random.pick([0, 1]), // 0-正常 1-停用
      domain: `tenant${i}.example.com`,
      packageId: Random.integer(1, 5),
      username: `tenant${i}`,
      password: '******',
      expireTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      accountCount: Random.integer(10, 100),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return tenants
}

const mockTenants = generateMockTenants(15)

// 租户套餐数据
const mockTenantPackages = [
  { id: 1, name: '基础版' },
  { id: 2, name: '标准版' },
  { id: 3, name: '专业版' },
  { id: 4, name: '企业版' },
  { id: 5, name: '旗舰版' }
]

const mockConfigs: MockConfig[] = [
  // 获取租户套餐精简列表
  {
    url: '/admin-api/system/tenant-package/simple-list',
    type: 'get',
    response: (): ApiResponse<any[]> => {
      return {
        code: 0,
        data: mockTenantPackages,
        msg: ''
      }
    }
  },

  // 获取租户分页列表
  {
    url: '/admin-api/system/tenant/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockTenants.slice(start, end),
          total: mockTenants.length
        },
        msg: ''
      }
    }
  },

  // 获取租户详情
  {
    url: '/admin-api/system/tenant/get',
    type: 'get',
    response: ({ query }): ApiResponse<any> => {
      const { id } = query
      const tenant = mockTenants.find((t) => t.id === Number(id)) || mockTenants[0]
      return {
        code: 0,
        data: tenant,
        msg: ''
      }
    }
  },

  // 获取租户精简列表
  {
    url: '/admin-api/system/tenant/simple-list',
    type: 'get',
    response: (): ApiResponse<any[]> => {
      return {
        code: 0,
        data: mockTenants.map((tenant) => ({
          id: tenant.id,
          name: tenant.name
        })),
        msg: ''
      }
    }
  },

  // 创建租户
  {
    url: '/admin-api/system/tenant/create',
    type: 'post',
    response: (): ApiResponse<number> => {
      return {
        code: 0,
        data: Random.integer(1000, 9999),
        msg: '创建成功'
      }
    }
  },

  // 更新租户
  {
    url: '/admin-api/system/tenant/update',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '更新成功'
      }
    }
  },

  // 删除租户
  {
    url: '/admin-api/system/tenant/delete',
    type: 'delete',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '删除成功'
      }
    }
  }
]

export default mockConfigs
