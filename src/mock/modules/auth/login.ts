import type { MockConfig, ApiResponse } from '../../types'
import type { UserLoginVO, UserVO } from '@/api/login/types'

/**
 * 登录响应数据
 */
interface LoginResponse {
  userId: number
  accessToken: string
  refreshToken: string
  expiresTime: number
}

/**
 * 权限信息响应
 */
interface PermissionInfo {
  user: UserVO
  roles: string[]
  permissions: string[]
  menus: any[]
}

/**
 * 验证码响应
 */
interface CaptchaResponse {
  uuid: string
  img: string
}

// 当前登录用户
let currentUser: string = 'admin'

// 用户配置
const userConfigs: Record<string, { user: UserVO; roles: string[]; permissions: string[] }> = {
  admin: {
    user: {
      id: 1,
      nickname: '超级管理员',
      avatar: 'http://test.governance.iocoder.cn/test/20250502/avatar_1746154660449.png',
      deptId: 103,
      username: 'admin',
      email: 'admin@example.com',
      mobile: '13800138000',
      sex: 1,
      loginIp: '127.0.0.1',
      loginDate: new Date().toISOString()
    },
    roles: ['super_admin'],
    permissions: ['*:*:*'] // 超级管理员拥有所有权限
  },
  test: {
    user: {
      id: 2,
      nickname: '测试用户',
      avatar: '',
      deptId: 104,
      username: 'test',
      email: 'test@example.com',
      mobile: '13800138001',
      sex: 1,
      loginIp: '127.0.0.1',
      loginDate: new Date().toISOString()
    },
    roles: ['test'],
    permissions: [
      'system:user:query',
      'system:user:list',
      'system:dept:query',
      'system:dict:query',
      'system:notice:query'
    ]
  },
  guest: {
    user: {
      id: 3,
      nickname: '访客用户',
      avatar: '',
      deptId: 105,
      username: 'guest',
      email: 'guest@example.com',
      mobile: '13800138002',
      sex: 0,
      loginIp: '127.0.0.1',
      loginDate: new Date().toISOString()
    },
    roles: ['guest'],
    permissions: [] // 无权限
  },
  resourceAdmin: {
    user: {
      id: 4,
      nickname: '资源管理员',
      avatar: '',
      deptId: 106,
      username: 'resourceAdmin',
      email: 'resource@example.com',
      mobile: '13800138003',
      sex: 1,
      loginIp: '127.0.0.1',
      loginDate: new Date().toISOString()
    },
    roles: ['resourceAdmin'],
    permissions: [
      'resource:upload:create',
      'resource:upload:query',
      'resource:upload:update',
      'resource:approval:query',
      'resource:approval:approve',
      'system:feedback:query'
    ]
  },
  operationAdmin: {
    user: {
      id: 5,
      nickname: '运营管理员',
      avatar: '',
      deptId: 107,
      username: 'operationAdmin',
      email: 'operation@example.com',
      mobile: '13800138004',
      sex: 1,
      loginIp: '127.0.0.1',
      loginDate: new Date().toISOString()
    },
    roles: ['operationAdmin'],
    permissions: [
      'resource:approval:query',
      'resource:approval:approve',
      'resource:approval:reject',
      'system:feedback:query'
    ]
  },
  project_member:{
    "user": {
        "id": 145,
        "nickname": "18842886700",
        "avatar": "",
        "deptId": 119,
        "username": "18842886700",
        "email": ""
    },
    "roles": [
        "project_member"
    ],
    "permissions": [
        ""
    ],
    "menus": [
        {
            "id": 5037,
            "parentId": 0,
            "name": "总览",
            "path": "/dashboard",
            "component": "",
            "componentName": "",
            "icon": "",
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": [
                {
                    "id": 5038,
                    "parentId": 5037,
                    "name": "工作台",
                    "path": "index",
                    "component": "Home/index",
                    "componentName": "Index",
                    "icon": "",
                    "visible": true,
                    "keepAlive": true,
                    "alwaysShow": true,
                    "children": null
                },
                {
                    "id": 5039,
                    "parentId": 5037,
                    "name": "项目管理",
                    "path": "projects",
                    "component": "Home/projects/index",
                    "componentName": "HomeProjects",
                    "icon": "",
                    "visible": true,
                    "keepAlive": true,
                    "alwaysShow": true,
                    "children": null
                }
            ]
        },
        {
            "id": 5020,
            "parentId": 0,
            "name": "我的资源",
            "path": "/my_resources",
            "component": "",
            "componentName": "",
            "icon": "",
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": [
                {
                    "id": 5021,
                    "parentId": 5020,
                    "name": "数据资源",
                    "path": "data",
                    "component": "resources/data/index",
                    "componentName": "MyResourcesData",
                    "icon": "",
                    "visible": true,
                    "keepAlive": true,
                    "alwaysShow": true,
                    "children": null
                },
                {
                    "id": 5022,
                    "parentId": 5020,
                    "name": "应用资源",
                    "path": "application",
                    "component": "resources/application/index",
                    "componentName": "MyResourcesApplication",
                    "icon": "",
                    "visible": true,
                    "keepAlive": true,
                    "alwaysShow": true,
                    "children": null
                },
                {
                    "id": 5023,
                    "parentId": 5020,
                    "name": "组件资源",
                    "path": "components",
                    "component": "resources/components/index",
                    "componentName": "MyResourcesComponents",
                    "icon": "",
                    "visible": true,
                    "keepAlive": true,
                    "alwaysShow": true,
                    "children": null
                }
            ]
        },
        {
            "id": 5024,
            "parentId": 0,
            "name": "其他",
            "path": "/other",
            "component": "",
            "componentName": "",
            "icon": "",
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": [
                {
                    "id": 5026,
                    "parentId": 5024,
                    "name": "审批中心",
                    "path": "approval-center",
                    "component": "",
                    "componentName": "",
                    "icon": "",
                    "visible": true,
                    "keepAlive": true,
                    "alwaysShow": true,
                    "children": [
                        {
                            "id": 5027,
                            "parentId": 5026,
                            "name": "我发起的",
                            "path": "initiated",
                            "component": "other/approval/initiated/index",
                            "componentName": "OtherApprovalInitiated",
                            "icon": "",
                            "visible": true,
                            "keepAlive": true,
                            "alwaysShow": true,
                            "children": null
                        }
                    ]
                },
                {
                    "id": 5025,
                    "parentId": 5024,
                    "name": "反馈意见",
                    "path": "feedback",
                    "component": "other/feedback/index",
                    "componentName": "OtherFeedback",
                    "icon": "",
                    "visible": true,
                    "keepAlive": true,
                    "alwaysShow": false,
                    "children": [
                        {
                            "id": 5029,
                            "parentId": 5025,
                            "name": "我反馈的",
                            "path": "submitted",
                            "component": "other/feedback/submitted",
                            "componentName": "OtherFeedbackSubmitted",
                            "icon": "",
                            "visible": true,
                            "keepAlive": true,
                            "alwaysShow": true,
                            "children": null
                        }
                    ]
                }
            ]
        }
    ]
  }
}

const mockConfigs: MockConfig[] = [
  // 用户登录
  {
    url: '/admin-api/system/auth/login',
    type: 'post',
    response: ({ body }: { body: UserLoginVO }): ApiResponse<LoginResponse> => {
      const { username, password } = body

      // 支持多个用户登录 (密码统一为 admin123)
      if (userConfigs[username] && password === 'admin123') {
        currentUser = username // 记录当前登录用户
        return {
          code: 0,
          data: {
            userId: userConfigs[username].user.id!,
            accessToken: `mock-access-token-${username}-${Date.now()}`,
            refreshToken: `mock-refresh-token-${username}-${Date.now()}`,
            expiresTime: Date.now() + 24 * 60 * 60 * 1000
          },
          msg: '登录成功'
        }
      } else if (username === '18842886700') {
        return {
          code: 0,
          data: {
            userId: userConfigs['project_member'].user.id!,
            accessToken: `mock-access-token-${username}-${Date.now()}`,
            refreshToken: `mock-refresh-token-${username}-${Date.now()}`,
            expiresTime: Date.now() + 24 * 60 * 60 * 1000
          },
          msg: '登录成功'
        }
      }

      return {
        code: 500,
        data: undefined as any,
        msg: '用户名或密码错误'
      }
    }
  },

  // 获取用户权限信息
  {
    url: '/admin-api/system/auth/get-permission-info',
    type: 'get',
    response: (): ApiResponse<PermissionInfo> => {
      const config = userConfigs['project_member']
      return {
        code: 0,
        data: {
          user: config.user,
          roles: config.roles,
          permissions: config.permissions,
          menus: config.menus
        },
        msg: ''
      }
    }
  },

  // 刷新访问令牌
  {
    url: '/admin-api/system/auth/refresh-token',
    type: 'post',
    response: ({ query }): ApiResponse<LoginResponse | null> => {
      const { refreshToken } = query || {}

      // 简单校验：必须是以 mock 刷新令牌开头
      if (!refreshToken || !String(refreshToken).startsWith('mock-refresh-token-')) {
        return {
          code: 401,
          data: null,
          msg: '无效的刷新令牌'
        }
      }

      return {
        code: 200,
        data: {
          userId: 1,
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresTime: Date.now() + 24 * 60 * 60 * 1000 // 24小时后过期
        },
        msg: '刷新成功'
      }
    }
  },

  // 获取验证码
  {
    url: '/admin-api/system/captcha/get',
    type: 'get',
    response: (): ApiResponse<CaptchaResponse> => ({
      code: 0,
      data: {
        uuid: 'mock-captcha-uuid-' + Date.now(),
        img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAADl0RVh0U29mdHdhcmUAbWF0cGxvdGxpYiB2ZXJzaW9uIDMuMC4yLCBodHRwOi8vbWF0cGxvdGxpYi5vcmcvOIA7rQAADQ9JREFUeJztnXuMXVUZh7/fPjrTTqfTlraUthRKW8qjFKRQHqJAeYmAEhEjGhUNKBoTY4wajVHjI0YTjcYYjVETNRqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDT+gT0za51zzuw7c2fuPTPnJF+yk33Xetbav/Xttb+19l4SEVEoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUChUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKsUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqE='
      },
      msg: ''
    })
  },
  {
    url: '/admin-api/system/tenant/get-by-website',
    type: 'get',
    response: (): ApiResponse<null> => ({
      code: 0,
      data: null,
      msg: ''
    })
  },

  // 用户登出
  {
    url: '/admin-api/system/auth/logout',
    type: 'post',
    response: (): ApiResponse<boolean> => ({
      code: 0,
      data: true,
      msg: ''
    })
  }
]

export default mockConfigs
