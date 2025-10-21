import request from '@/config/axios'

export type DictTypeVO = {
  id: number | undefined
  name: string
  type: string
  status: number
  remark: string
  createTime: Date
}

export interface DictTypePageReqVO extends PageParam {
  name?: string
  type?: string
  status?: number
  createTime?: string[]
}

// 查询字典（精简)列表
export const getSimpleDictTypeList = () => {
  return request.get<DictTypeVO[]>({ url: '/system/dict-type/list-all-simple' })
}

// 查询字典列表
export const getDictTypePage = (params: DictTypePageReqVO) => {
  return request.get<PageResult<DictTypeVO[]>>({ url: '/system/dict-type/page', params })
}

// 查询字典详情
export const getDictType = (id: number) => {
  return request.get<DictTypeVO>({ url: '/system/dict-type/get?id=' + id })
}

// 新增字典
export const createDictType = (data: DictTypeVO) => {
  return request.post<void>({ url: '/system/dict-type/create', data })
}

// 修改字典
export const updateDictType = (data: DictTypeVO) => {
  return request.put<void>({ url: '/system/dict-type/update', data })
}

// 删除字典
export const deleteDictType = (id: number) => {
  return request.delete<void>({ url: '/system/dict-type/delete?id=' + id })
}
// 导出字典类型
export const exportDictType = (params: DictTypePageReqVO) => {
  return request.download<Blob>({ url: '/system/dict-type/export', params })
}
