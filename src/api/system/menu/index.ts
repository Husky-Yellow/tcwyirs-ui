import request from '@/config/axios'

export interface MenuVO {
  id: number
  name: string
  permission: string
  type: number
  sort: number
  parentId: number
  path: string
  icon: string
  component: string
  componentName?: string
  status: number
  visible: boolean
  keepAlive: boolean
  alwaysShow?: boolean
  createTime: Date
}

export interface MenuListReqVO {
  name?: string
  status?: number
}

// 查询菜单（精简）列表
export const getSimpleMenusList = () => {
  return request.get<MenuVO[]>({ url: '/system/menu/simple-list' })
}

// 查询菜单列表
export const getMenuList = (params?: MenuListReqVO) => {
  return request.get<MenuVO[]>({ url: '/system/menu/list', params })
}

// 获取菜单详情
export const getMenu = (id: number) => {
  return request.get<MenuVO>({ url: '/system/menu/get?id=' + id })
}

// 新增菜单
export const createMenu = (data: MenuVO) => {
  return request.post<void>({ url: '/system/menu/create', data })
}

// 修改菜单
export const updateMenu = (data: MenuVO) => {
  return request.put<void>({ url: '/system/menu/update', data })
}

// 删除菜单
export const deleteMenu = (id: number) => {
  return request.delete<void>({ url: '/system/menu/delete?id=' + id })
}
