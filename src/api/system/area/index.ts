import request from '@/config/axios'

/** 地区树节点 */
export type AreaTreeItem = Tree

// 获得地区树
export const getAreaTree = async (): Promise<AreaTreeItem[]> => {
  return await request.get<AreaTreeItem[]>({ url: '/system/area/tree' })
}

// 获得 IP 对应的地区名
export const getAreaByIp = async (ip: string): Promise<string> => {
  return await request.get<string>({ url: '/system/area/get-by-ip?ip=' + ip })
}
