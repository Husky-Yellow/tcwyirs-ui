import type { MockConfig, ApiResponse } from '../../types'

/**
 * 部门完整信息
 */
interface DeptInfo {
  id: number
  name: string
  parentId: number
  sort: number
  leaderUserId: number | null
  phone: string | null
  email: string | null
  status: number
  createTime: number
}

/**
 * 部门简化信息
 */
interface SimpleDeptInfo {
  id: number
  name: string
  parentId: number
}

// 模拟部门数据
const mockDepts: DeptInfo[] = [
  {
    id: 100,
    name: '测试架构1',
    parentId: 0,
    sort: 0,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 101,
    name: '深圳总公司',
    parentId: 100,
    sort: 1,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 103,
    name: '研发部门',
    parentId: 101,
    sort: 3,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 108,
    name: '市场部门',
    parentId: 102,
    sort: 8,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 1932323299075383298,
    name: '111',
    parentId: 1932306801778843649,
    sort: 9,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 102,
    name: '长沙分公司',
    parentId: 100,
    sort: 2,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 104,
    name: '市场部门',
    parentId: 101,
    sort: 4,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 109,
    name: '财务部门',
    parentId: 102,
    sort: 9,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 1930550482923290628,
    name: '组织B',
    parentId: 0,
    sort: 10,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 105,
    name: '测试部门',
    parentId: 101,
    sort: 5,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 1930550482923290627,
    name: '组织A',
    parentId: 0,
    sort: 11,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 1932306801778843649,
    name: 'txwy1',
    parentId: 0,
    sort: 12,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 106,
    name: '财务部门',
    parentId: 101,
    sort: 6,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  },
  {
    id: 107,
    name: '运维部门',
    parentId: 101,
    sort: 7,
    leaderUserId: null,
    phone: null,
    email: null,
    status: 0,
    createTime: Date.now()
  }
]

const mockConfigs: MockConfig[] = [
  // 获取部门列表
  {
    url: '/admin-api/system/dept/list',
    type: 'get',
    response: (): ApiResponse<DeptInfo[]> => ({
      code: 0,
      data: mockDepts,
      msg: ''
    })
  },

  // 获取部门简化列表
  {
    url: '/admin-api/system/dept/simple-list',
    type: 'get',
    response: (): ApiResponse<SimpleDeptInfo[]> => ({
      code: 0,
      data: mockDepts
        .filter((dept) => dept.status === 0)
        .map((dept) => ({
          id: dept.id,
          name: dept.name,
          parentId: dept.parentId
        })),
      msg: ''
    })
  }
]

export default mockConfigs
