import type { MockConfig, ApiResponse } from '../../types'
import type { MenuItem } from '../../types'

// 模拟菜单数据
const mockMenus: MenuItem[] = [
  {
    id: 1,
    parentId: 0,
    name: '系统管理',
    path: '/system',
    component: null,
    componentName: null,
    icon: 'ep:tools',
    visible: true,
    manageId: null,
    keepAlive: true,
    alwaysShow: true,
    children: [
      {
        id: '1930877489578242052',
        parentId: 1,
        name: '组织架构',
        path: 'organization',
        component: '',
        componentName: '',
        icon: 'ep:add-location',
        visible: true,
        manageId: null,
        keepAlive: true,
        alwaysShow: true,
        children: [
          {
            id: '1930877489578242053',
            parentId: '1930877489578242052',
            name: '用户管理',
            path: 'subscriber',
            component: 'system/subscriber/index',
            componentName: 'SystemSubscriber',
            icon: 'ep:user',
            visible: true,
            manageId: null,
            keepAlive: true,
            alwaysShow: true,
            children: null
          },
          {
            id: '1930877489578242054',
            parentId: '1930877489578242052',
            name: '岗位管理',
            path: 'job',
            component: 'system/job/index',
            componentName: 'SystemJob',
            icon: 'ep:suitcase',
            visible: true,
            manageId: null,
            keepAlive: true,
            alwaysShow: false,
            children: null
          },
          {
            id: '1930877489578242055',
            parentId: '1930877489578242052',
            name: '组织架构',
            path: 'organization',
            component: 'system/organization/index',
            componentName: 'SystemOrganization',
            icon: 'ep:office-building',
            visible: true,
            manageId: null,
            keepAlive: true,
            alwaysShow: true,
            children: null
          }
        ]
      },
      {
        id: '1930877489578242056',
        parentId: 1,
        name: '权限配置',
        path: 'permissions',
        component: '',
        componentName: '',
        icon: 'ep:lock',
        visible: true,
        manageId: null,
        keepAlive: true,
        alwaysShow: true,
        children: [
          {
            id: '1930877489578242057',
            parentId: '1930877489578242056',
            name: '角色管理',
            path: 'persona',
            component: 'system/persona/index',
            componentName: 'SystemPersona',
            icon: 'ep:avatar',
            visible: true,
            manageId: null,
            keepAlive: true,
            alwaysShow: true,
            children: null
          },
          {
            id: '1930877489578242058',
            parentId: '1930877489578242056',
            name: '菜单管理',
            path: 'hierarchy',
            component: 'system/hierarchy/index',
            componentName: 'SystemHierarchy',
            icon: 'ep:menu',
            visible: true,
            manageId: null,
            keepAlive: true,
            alwaysShow: true,
            children: null
          }
        ]
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
        manageId: null,
        keepAlive: true,
        alwaysShow: true,
        children: null
      }
    ]
  },
  {
    id: '1939891937186779137',
    parentId: 0,
    name: '基层治理',
    path: '/basic',
    component: '',
    componentName: '',
    icon: 'ep:location',
    visible: true,
    manageId: '1945685808018624513',
    keepAlive: true,
    alwaysShow: true,
    children: [
      {
        id: '1947927011439153154',
        parentId: '1939891937186779137',
        name: '人口',
        path: 'people',
        component: '',
        componentName: '',
        icon: 'ep:user-filled',
        visible: true,
        manageId: '1947864796501671937',
        keepAlive: true,
        alwaysShow: true,
        children: [
          {
            id: '1947927190703706114',
            parentId: '1947927011439153154',
            name: '实有人口',
            path: 'all',
            component: '',
            componentName: '',
            icon: 'ep:users',
            visible: true,
            manageId: '1947864737554923522',
            keepAlive: true,
            alwaysShow: true,
            children: [
              {
                id: '1947927468148527106',
                parentId: '1947927190703706114',
                name: '户籍人口',
                path: 'labelEdit',
                component: 'Exhibition/index.vue',
                componentName: 'ExhibitionList',
                icon: 'ep:house',
                visible: true,
                manageId: '1947864796501671937',
                keepAlive: true,
                alwaysShow: false,
                children: [
                  {
                    id: '1947945425872416770',
                    parentId: '1947927468148527106',
                    name: '户籍人口',
                    path: 'list',
                    component: 'Exhibition/index.vue',
                    componentName: 'ExhibitionList2',
                    icon: 'ep:list',
                    visible: true,
                    manageId: '1947864796501671937',
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: '1947945608853123073',
                    parentId: '1947927468148527106',
                    name: '户籍人口详情',
                    path: 'detail',
                    component: 'Exhibition/detail.vue',
                    componentName: 'ExhibitionDetail1',
                    icon: 'ep:document',
                    visible: false,
                    manageId: '1947864796501671937',
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  },
                  {
                    id: '1947945929755127809',
                    parentId: '1947927468148527106',
                    name: '户籍人口新增',
                    path: 'create',
                    component: 'Exhibition/create.vue',
                    componentName: 'ExhibitionCreate1',
                    icon: 'ep:plus',
                    visible: false,
                    manageId: '1947864796501671937',
                    keepAlive: true,
                    alwaysShow: true,
                    children: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

// 简化菜单数据（用于菜单选择）
const simpleMenus = [
  {
    id: '1947927011439153154',
    name: '人口',
    parentId: '1939891937186779137',
    type: 1
  },
  {
    id: '1947927190703706114',
    name: '实有人口',
    parentId: '1947927011439153154',
    type: 1
  },
  {
    id: '1947945425872416770',
    name: '户籍人口',
    parentId: '1947927468148527106',
    type: 2
  },
  {
    id: '1947945608853123073',
    name: '户籍人口详情',
    parentId: '1947927468148527106',
    type: 2
  },
  {
    id: '1947945929755127809',
    name: '户籍人口新增',
    parentId: '1947927468148527106',
    type: 2
  },
  {
    id: 1,
    name: '系统管理',
    parentId: 0,
    type: 1
  },
  {
    id: 1026,
    name: '字典查询',
    parentId: 105,
    type: 3
  }
]

const mockConfigs: MockConfig[] = [
  // 获取菜单简化列表
  {
    url: '/admin-api/system/menu/simple-list',
    type: 'get',
    response: (): ApiResponse<any[]> => ({
      code: 0,
      data: simpleMenus,
      msg: ''
    })
  }
]

export default mockConfigs
