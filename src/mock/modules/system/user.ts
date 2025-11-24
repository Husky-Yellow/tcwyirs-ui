import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { UserVO } from '@/api/system/user/index'

// Mock 用户数据
const mockUsers: UserVO[] = [
  {
    id: 1,
    username: 'admin',
    nickname: '芋道源码',
    deptId: 103,
    email: 'admin@example.com',
    mobile: '15888888888',
    sex: 1,
    status: 0,
    avatar: 'http://test.governance.iocoder.cn/test/avatar.png',
    loginIp: '127.0.0.1',
    remark: '管理员'
  },
  {
    id: 100,
    username: 'yudao',
    nickname: '芋道',
    deptId: 104,
    email: 'yudao@example.com',
    mobile: '15888888889',
    sex: 1,
    status: 0,
  },
  {
    id: 103,
    username: 'yuanma',
    nickname: '源码',
    deptId: 106,
    email: 'yuanma@example.com',
    mobile: '15888888890',
    sex: 2,
    status: 0,
  },
  {
    id: 104,
    username: 'test',
    nickname: '测试号',
    deptId: 107,
    email: 'test@example.com',
    mobile: '15888888891',
    sex: 1,
    status: 1,
  }
]

const mockConfigs: MockConfig[] = [
  // 获取用户分页列表
  {
    url: '/admin-api/system/user/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<UserVO>> => {
      const { pageNo = 1, pageSize = 10, showCloseFlag } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      // 根据showCloseFlag过滤数据
      let filteredUsers = mockUsers
      if (!showCloseFlag || showCloseFlag === 'false') {
        filteredUsers = mockUsers.filter((user) => user.status === 0)
      }

      return {
        code: 0,
        data: {
          list: filteredUsers.slice(start, end),
          total: filteredUsers.length
        },
        msg: ''
      }
    }
  },

  // 获取用户简单列表
  {
    url: '/admin-api/system/user/simple-list',
    type: 'get',
    response: (): ApiResponse<Partial<UserVO>[]> => ({
      code: 0,
      data: mockUsers.map((user) => ({
        id: user.id,
        nickname: user.nickname,
        deptId: user.deptId,
        deptName: user.deptName
      })),
      msg: ''
    })
  },

  // 获取所有用户
  {
    url: '/admin-api/system/user/all',
    type: 'get',
    response: (): ApiResponse<UserResp[]> => ({
      code: 0,
      data: mockUsers,
      msg: ''
    })
  },

  // 获取单个用户详情
  {
    url: '/admin-api/system/user/get',
    type: 'get',
    response: ({ query }): ApiResponse<UserResp | null> => {
      const { id } = query
      const user = mockUsers.find((u) => u.id === Number(id))

      if (user) {
        return {
          code: 0,
          data: user,
          msg: ''
        }
      }

      return {
        code: 404,
        data: null,
        msg: '用户不存在'
      }
    }
  },

  // 创建用户
  {
    url: '/admin-api/system/user/create',
    type: 'post',
    response: ({ body }: { body: UserResp }): ApiResponse<number> => {
      const newId = Math.max(...mockUsers.map((u) => u.id || 0)) + 1
      const newUser: UserResp = {
        ...body,
        id: newId,
        createTime: new Date().toISOString()
      }
      mockUsers.push(newUser)

      return {
        code: 0,
        data: newId,
        msg: '创建成功'
      }
    }
  },

  // 更新用户
  {
    url: '/admin-api/system/user/update',
    type: 'put',
    response: ({ body }: { body: UserResp }): ApiResponse<boolean> => {
      const { id } = body
      const index = mockUsers.findIndex((u) => u.id === id)

      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...body }
        return {
          code: 0,
          data: true,
          msg: '更新成功'
        }
      }

      return {
        code: 404,
        data: false,
        msg: '用户不存在'
      }
    }
  },

  // 删除用户
  {
    url: '/admin-api/system/user/delete',
    type: 'delete',
    response: ({ query }): ApiResponse<boolean> => {
      const { id } = query
      const index = mockUsers.findIndex((u) => u.id === Number(id))

      if (index !== -1) {
        mockUsers.splice(index, 1)
        return {
          code: 0,
          data: true,
          msg: '删除成功'
        }
      }

      return {
        code: 404,
        data: false,
        msg: '用户不存在'
      }
    }
  },

  // 更新用户状态
  {
    url: '/admin-api/system/user/update-status',
    type: 'put',
    response: ({ body }: { body: { id: number; status: number } }): ApiResponse<boolean> => {
      const { id, status } = body
      const user = mockUsers.find((u) => u.id === id)

      if (user) {
        user.status = status
        return {
          code: 0,
          data: true,
          msg: '状态更新成功'
        }
      }

      return {
        code: 404,
        data: false,
        msg: '用户不存在'
      }
    }
  },

  // 重置用户密码
  {
    url: '/admin-api/system/user/update-password',
    type: 'put',
    response: ({ body }: { body: { id: number; password: string } }): ApiResponse<boolean> => {
      const { id } = body
      const user = mockUsers.find((u) => u.id === id)

      if (user) {
        return {
          code: 0,
          data: true,
          msg: '密码重置成功'
        }
      }

      return {
        code: 404,
        data: false,
        msg: '用户不存在'
      }
    }
  }
]

export default mockConfigs
