import request from '@/config/axios'

export type DictDataVO = {
  id: number | undefined
  sort: number | undefined
  label: string
  value: string
  dictType: string
  status: number
  colorType: string
  cssClass: string
  remark: string
  createTime: Date
}

// 字典数据精简版类型 - 用于 simple-list 接口
export type SimpleDictDataVO = {
  dictType: string
  value: string
  label: string
  colorType: string
  cssClass: string
}

export interface DictDataPageReqVO extends PageParam {
  label?: string
  status?: number
  dictType?: string | string[]
}

// 查询字典数据（精简)列表
export const getSimpleDictDataList = () => {
  return request.get<SimpleDictDataVO[]>({ url: '/system/dict-data/simple-list' })
}

// 查询字典数据列表
export const getDictDataPage = (params: DictDataPageReqVO) => {
  return request.get<PageResult<DictDataVO[]>>({ url: '/system/dict-data/page', params })
}

// 查询字典数据详情
export const getDictData = (id: number) => {
  return request.get<DictDataVO>({ url: '/system/dict-data/get?id=' + id })
}

// 新增字典数据
export const createDictData = (data: DictDataVO) => {
  return request.post<void>({ url: '/system/dict-data/create', data })
}

// 修改字典数据
export const updateDictData = (data: DictDataVO) => {
  return request.put<void>({ url: '/system/dict-data/update', data })
}

// 删除字典数据
export const deleteDictData = (id: number) => {
  return request.delete<void>({ url: '/system/dict-data/delete?id=' + id })
}

// 导出字典类型数据
export const exportDictData = (params: DictDataPageReqVO) => {
  return request.download<Blob>({ url: '/system/dict-data/export', params })
}
