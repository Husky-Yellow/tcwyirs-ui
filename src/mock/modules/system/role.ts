import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import Mock from 'mockjs'

// 生成角色数据
const generateMockRoles = (count: number) => {
  const roles = []
  const roleNames = [
    '超级管理员',
    '系统管理员',
    '部门管理员',
    '普通用户',
    '访客',
    '财务人员',
    'HR人员',
    '技术人员'
  ]
  const roleCodes = [
    'super_admin',
    'admin',
    'dept_admin',
    'user',
    'guest',
    'finance',
    'hr',
    'tech'
  ]

  for (let i = 0; i < count && i < roleNames.length; i++) {
    roles.push({
      id: i + 1,
      name: roleNames[i],
      code: roleCodes[i],
      sort: i + 1,
      status: Mock.Random.pick([0, 1]), // 0-正常 1-停用
      type: Mock.Random.pick([1, 2]), // 1-自定义 2-内置
      dataScope: Mock.Random.integer(1, 5), // 1-全部 2-指定部门 3-本部门 4-本部门及以下 5-仅本人
      dataScopeDeptIds: Mock.Random.pick([
        [],
        [1, 2, 3],
        [1],
        [2, 3]
      ]),
      remark: Mock.Random.csentence(5, 15),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return roles
}

const mockRoles = generateMockRoles(8)

const mockConfigs: MockConfig[] = [
  // 获取角色分页列表
  {
    url: '/admin-api/system/role/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockRoles.slice(start, end),
          total: mockRoles.length
        },
        msg: ''
      }
    }
  },

  // 获取角色精简列表
  {
    url: '/admin-api/system/role/simple-list',
    type: 'get',
    response: (): ApiResponse<any[]> => {
      return {
        code: 0,
        data: mockRoles.map((role) => ({
          id: role.id,
          name: role.name,
          code: role.code
        })),
        msg: ''
      }
    }
  },

  // 获取角色详情
  {
    url: '/admin-api/system/role/get',
    type: 'get',
    response: ({ query }): ApiResponse<any> => {
      const { id } = query
      const role = mockRoles.find((r) => r.id === Number(id)) || mockRoles[0]
      return {
        code: 0,
        data: role,
        msg: ''
      }
    }
  },

  // 创建角色
  {
    url: '/admin-api/system/role/create',
    type: 'post',
    response: (): ApiResponse<number> => {
      return {
        code: 0,
        data: Mock.Random.integer(1000, 9999),
        msg: '创建成功'
      }
    }
  },

  // 更新角色
  {
    url: '/admin-api/system/role/update',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '更新成功'
      }
    }
  },

  // 更新角色状态
  {
    url: '/admin-api/system/role/update-status',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '状态更新成功'
      }
    }
  },

  // 删除角色
  {
    url: '/admin-api/system/role/delete',
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
