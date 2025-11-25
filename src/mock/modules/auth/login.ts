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
      const config = userConfigs[currentUser] || userConfigs.admin
      return {
        code: 0,
        data: {
          user: config.user,
          roles: config.roles,
          permissions: config.permissions,
          menus: [
          {
            id: 1,
            parentId: 0,
            name: '系统管理',
            path: '/system',
            component: null,
            componentName: null,
            icon: 'ep:tools',
            visible: true,
            keepAlive: true,
            alwaysShow: true,
            children: [
              {
                id: 1224,
                parentId: 1,
                name: '租户管理',
                path: 'tenant',
                component: null,
                componentName: null,
                icon: 'fa-solid:house-user',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: [
                  {
                    id: 1138,
                    parentId: 1224,
                    name: '租户列表',
                    path: 'list',
                    component: 'system/tenant/index',
                    componentName: 'SystemTenant',
                    icon: 'ep:house',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 1225,
                    parentId: 1224,
                    name: '租户套餐',
                    path: 'package',
                    component: 'system/tenantPackage/index',
                    componentName: 'SystemTenantPackage',
                    icon: 'fa:bars',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  }
                ]
              },
              {
                id: 100,
                parentId: 1,
                name: '用户管理',
                path: 'user',
                component: 'system/user/index',
                componentName: 'SystemUser',
                icon: 'ep:avatar',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 101,
                parentId: 1,
                name: '角色管理',
                path: 'role',
                component: 'system/role/index',
                componentName: 'SystemRole',
                icon: 'ep:user',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 102,
                parentId: 1,
                name: '菜单管理',
                path: 'menu',
                component: 'system/menu/index',
                componentName: 'SystemMenu',
                icon: 'ep:menu',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 103,
                parentId: 1,
                name: '部门管理',
                path: 'dept',
                component: 'system/dept/index',
                componentName: 'SystemDept',
                icon: 'fa:address-card',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 104,
                parentId: 1,
                name: '岗位管理',
                path: 'post',
                component: 'system/post/index',
                componentName: 'SystemPost',
                icon: 'fa:address-book-o',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 105,
                parentId: 1,
                name: '字典管理',
                path: 'dict',
                component: 'system/dict/index',
                componentName: 'SystemDictType',
                icon: 'ep:collection',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 2739,
                parentId: 1,
                name: '消息中心',
                path: 'messages',
                component: '',
                componentName: '',
                icon: 'ep:chat-dot-round',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: [
                  {
                    id: 1093,
                    parentId: 2739,
                    name: '短信管理',
                    path: 'sms',
                    component: null,
                    componentName: null,
                    icon: 'ep:message',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: [
                      {
                        id: 1094,
                        parentId: 1093,
                        name: '短信渠道',
                        path: 'sms-channel',
                        component: 'system/sms/channel/index',
                        componentName: 'SystemSmsChannel',
                        icon: 'fa:stack-exchange',
                        visible: true,
                        keepAlive: true,
                        alwaysShow: true,
                        children: null
                      },
                      {
                        id: 1100,
                        parentId: 1093,
                        name: '短信模板',
                        path: 'sms-template',
                        component: 'system/sms/template/index',
                        componentName: 'SystemSmsTemplate',
                        icon: 'ep:connection',
                        visible: true,
                        keepAlive: true,
                        alwaysShow: true,
                        children: null
                      },
                      {
                        id: 1107,
                        parentId: 1093,
                        name: '短信日志',
                        path: 'sms-log',
                        component: 'system/sms/log/index',
                        componentName: 'SystemSmsLog',
                        icon: 'fa:edit',
                        visible: true,
                        keepAlive: true,
                        alwaysShow: true,
                        children: null
                      }
                    ]
                  },
                  {
                    id: 2130,
                    parentId: 2739,
                    name: '邮箱管理',
                    path: 'mail',
                    component: null,
                    componentName: null,
                    icon: 'fa-solid:mail-bulk',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: [
                      {
                        id: 2131,
                        parentId: 2130,
                        name: '邮箱账号',
                        path: 'mail-account',
                        component: 'system/mail/account/index',
                        componentName: 'SystemMailAccount',
                        icon: 'fa:universal-access',
                        visible: true,
                        keepAlive: true,
                        alwaysShow: true,
                        children: null
                      },
                      {
                        id: 2136,
                        parentId: 2130,
                        name: '邮件模版',
                        path: 'mail-template',
                        component: 'system/mail/template/index',
                        componentName: 'SystemMailTemplate',
                        icon: 'fa:tag',
                        visible: true,
                        keepAlive: true,
                        alwaysShow: true,
                        children: null
                      },
                      {
                        id: 2141,
                        parentId: 2130,
                        name: '邮件记录',
                        path: 'mail-log',
                        component: 'system/mail/log/index',
                        componentName: 'SystemMailLog',
                        icon: 'fa:edit',
                        visible: true,
                        keepAlive: true,
                        alwaysShow: true,
                        children: null
                      }
                    ]
                  },
                  {
                    id: 2144,
                    parentId: 2739,
                    name: '站内信管理',
                    path: 'notify',
                    component: null,
                    componentName: null,
                    icon: 'ep:message-box',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: [
                      {
                        id: 2145,
                        parentId: 2144,
                        name: '模板管理',
                        path: 'notify-template',
                        component: 'system/notify/template/index',
                        componentName: 'SystemNotifyTemplate',
                        icon: 'fa:archive',
                        visible: true,
                        keepAlive: true,
                        alwaysShow: true,
                        children: null
                      },
                      {
                        id: 2151,
                        parentId: 2144,
                        name: '消息记录',
                        path: 'notify-message',
                        component: 'system/notify/message/index',
                        componentName: 'SystemNotifyMessage',
                        icon: 'fa:edit',
                        visible: true,
                        keepAlive: true,
                        alwaysShow: true,
                        children: null
                      }
                    ]
                  },
                  {
                    id: 107,
                    parentId: 2739,
                    name: '通知公告',
                    path: 'notice',
                    component: 'system/notice/index',
                    componentName: 'SystemNotice',
                    icon: 'ep:takeaway-box',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  }
                ]
              },
              {
                id: 108,
                parentId: 1,
                name: '审计日志',
                path: 'log',
                component: '',
                componentName: null,
                icon: 'ep:document-copy',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: [
                  {
                    id: 500,
                    parentId: 108,
                    name: '操作日志',
                    path: 'operate-log',
                    component: 'system/operatelog/index',
                    componentName: 'SystemOperateLog',
                    icon: 'ep:position',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 501,
                    parentId: 108,
                    name: '登录日志',
                    path: 'login-log',
                    component: 'system/loginlog/index',
                    componentName: 'SystemLoginLog',
                    icon: 'ep:promotion',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  }
                ]
              },
              {
                id: 1261,
                parentId: 1,
                name: 'OAuth 2.0',
                path: 'oauth2',
                component: null,
                componentName: null,
                icon: 'fa:dashcube',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: [
                  {
                    id: 1263,
                    parentId: 1261,
                    name: '应用管理',
                    path: 'oauth2/application',
                    component: 'system/oauth2/client/index',
                    componentName: 'SystemOAuth2Client',
                    icon: 'fa:hdd-o',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 109,
                    parentId: 1261,
                    name: '令牌管理',
                    path: 'token',
                    component: 'system/oauth2/token/index',
                    componentName: 'SystemTokenClient',
                    icon: 'fa:key',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  }
                ]
              },
              {
                id: 2447,
                parentId: 1,
                name: '三方登录',
                path: 'social',
                component: '',
                componentName: '',
                icon: 'fa:rocket',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: [
                  {
                    id: 2448,
                    parentId: 2447,
                    name: '三方应用',
                    path: 'client',
                    component: 'system/social/client/index.vue',
                    componentName: 'SocialClient',
                    icon: 'ep:set-up',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 2453,
                    parentId: 2447,
                    name: '三方用户',
                    path: 'user',
                    component: 'system/social/user/index.vue',
                    componentName: 'SocialUser',
                    icon: 'ep:avatar',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  }
                ]
              },
              {
                id: 2083,
                parentId: 1,
                name: '地区管理',
                path: 'area',
                component: 'system/area/index',
                componentName: 'SystemArea',
                icon: 'fa:map-marker',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              }
            ]
          },
          {
            id: 2,
            parentId: 0,
            name: '基础设施',
            path: '/infra',
            component: null,
            componentName: null,
            icon: 'ep:monitor',
            visible: true,
            keepAlive: true,
            alwaysShow: true,
            children: [
              {
                id: 115,
                parentId: 2,
                name: '代码生成',
                path: 'codegen',
                component: 'infra/codegen/index',
                componentName: 'InfraCodegen',
                icon: 'ep:document-copy',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 1070,
                parentId: 2,
                name: '代码生成案例',
                path: 'demo',
                component: 'infra/testDemo/index',
                componentName: null,
                icon: 'ep:aim',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: [
                  {
                    id: 2478,
                    parentId: 1070,
                    name: '单表（增删改查）',
                    path: 'demo01-contact',
                    component: 'infra/demo/demo01/index',
                    componentName: 'Demo01Contact',
                    icon: 'ep:bicycle',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 2484,
                    parentId: 1070,
                    name: '树表（增删改查）',
                    path: 'demo02-category',
                    component: 'infra/demo/demo02/index',
                    componentName: 'Demo02Category',
                    icon: 'fa:tree',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 2490,
                    parentId: 1070,
                    name: '主子表（标准）',
                    path: 'demo03-normal',
                    component: 'infra/demo/demo03/normal/index',
                    componentName: 'Demo03StudentNormal',
                    icon: 'fa:battery-3',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 2497,
                    parentId: 1070,
                    name: '主子表（ERP）',
                    path: 'demo03-erp',
                    component: 'infra/demo/demo03/erp/index',
                    componentName: 'Demo03StudentERP',
                    icon: 'ep:calendar',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 2472,
                    parentId: 1070,
                    name: '主子表（内嵌）',
                    path: 'demo03-inner',
                    component: 'infra/demo/demo03/inner/index',
                    componentName: 'Demo03StudentInner',
                    icon: 'fa:power-off',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  }
                ]
              },
              {
                id: 1255,
                parentId: 2,
                name: '数据源配置',
                path: 'data-source-config',
                component: 'infra/dataSourceConfig/index',
                componentName: 'InfraDataSourceConfig',
                icon: 'ep:data-analysis',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 114,
                parentId: 2,
                name: '表单构建',
                path: 'build',
                component: 'infra/build/index',
                componentName: 'InfraBuild',
                icon: 'fa:wpforms',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 1083,
                parentId: 2,
                name: 'API 日志',
                path: 'log',
                component: null,
                componentName: null,
                icon: 'fa:tasks',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: [
                  {
                    id: 1078,
                    parentId: 1083,
                    name: '访问日志',
                    path: 'api-access-log',
                    component: 'infra/apiAccessLog/index',
                    componentName: 'InfraApiAccessLog',
                    icon: 'ep:place',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 1084,
                    parentId: 1083,
                    name: '错误日志',
                    path: 'api-error-log',
                    component: 'infra/apiErrorLog/index',
                    componentName: 'InfraApiErrorLog',
                    icon: 'ep:warning-filled',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  }
                ]
              },
              {
                id: 2525,
                parentId: 2,
                name: 'WebSocket',
                path: 'websocket',
                component: 'infra/webSocket/index',
                componentName: 'InfraWebSocket',
                icon: 'ep:connection',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 1243,
                parentId: 2,
                name: '文件管理',
                path: 'file',
                component: null,
                componentName: '',
                icon: 'ep:files',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: [
                  {
                    id: 1237,
                    parentId: 1243,
                    name: '文件配置',
                    path: 'file-config',
                    component: 'infra/fileConfig/index',
                    componentName: 'InfraFileConfig',
                    icon: 'fa-solid:file-signature',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 1090,
                    parentId: 1243,
                    name: '文件列表',
                    path: 'file',
                    component: 'infra/file/index',
                    componentName: 'InfraFile',
                    icon: 'ep:upload-filled',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  }
                ]
              },
              {
                id: 110,
                parentId: 2,
                name: '定时任务',
                path: 'job',
                component: 'infra/job/index',
                componentName: 'InfraJob',
                icon: 'fa-solid:tasks',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 106,
                parentId: 2,
                name: '配置管理',
                path: 'config',
                component: 'infra/config/index',
                componentName: 'InfraConfig',
                icon: 'fa:connectdevelop',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 2740,
                parentId: 2,
                name: '监控中心',
                path: 'monitors',
                component: '',
                componentName: '',
                icon: 'ep:monitor',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: [
                  {
                    id: 111,
                    parentId: 2740,
                    name: 'MySQL 监控',
                    path: 'druid',
                    component: 'infra/druid/index',
                    componentName: 'InfraDruid',
                    icon: 'fa-solid:box',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 113,
                    parentId: 2740,
                    name: 'Redis 监控',
                    path: 'redis',
                    component: 'infra/redis/index',
                    componentName: 'InfraRedis',
                    icon: 'fa:reddit-square',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 112,
                    parentId: 2740,
                    name: 'Java 监控',
                    path: 'admin-server',
                    component: 'infra/server/index',
                    componentName: 'InfraAdminServer',
                    icon: 'ep:coffee-cup',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: 1077,
                    parentId: 2740,
                    name: '链路追踪',
                    path: 'skywalking',
                    component: 'infra/skywalking/index',
                    componentName: 'InfraSkyWalking',
                    icon: 'fa:eye',
                    visible: true,
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  }
                ]
              }
            ]
          },
          {
            id: 5013,
            parentId: 0,
            name: '成绩查询',
            path: '/result',
            component: '',
            componentName: '',
            icon: 'ep:document-copy',
            visible: true,
            keepAlive: true,
            alwaysShow: true,
            children: [
              {
                id: 5014,
                parentId: 5013,
                name: '成绩列表',
                path: 'result',
                component: 'Result/Result',
                componentName: 'Result',
                icon: 'ep:document-copy',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              },
              {
                id: 5015,
                parentId: 5013,
                name: '二维码',
                path: 'qrcode',
                component: 'Result/QrCodeGenerator',
                componentName: 'QrCodeGenerator',
                icon: 'fa:barcode',
                visible: true,
                keepAlive: true,
                alwaysShow: true,
                children: null
              }
            ]
          }
        ]
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
