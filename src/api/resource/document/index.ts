import request from '@/config/axios'

/** 帮助文档 VO */
export interface DocumentVO {
  id?: number
  /** 文档名称 */
  name?: string
  /** 文档标题 */
  title: string
  /** 文档内容 */
  content?: string
  /** 文档 URL（PDF 或 MD 文件链接） */
  url?: string
  /** 文档类型 */
  type?: number
  /** 文档分类 */
  category?: string
  /** 排序 */
  sort?: number
  /** 状态：0-草稿 1-已发布 */
  status?: number
  /** 发布时间 */
  pushTime?: Date
  /** 创建时间 */
  createTime?: Date
  /** 更新时间 */
  updateTime?: Date
}

/** 帮助文档分页查询参数 */
export interface DocumentPageReqVO extends PageParam {
  /** 文档标题 */
  title?: string
  /** 文档类型 */
  type?: number
  /** 文档分类 */
  category?: string
  /** 状态 */
  status?: number
}

// 获取帮助文档分页列表
export const getDocumentPage = (params: DocumentPageReqVO) => {
  return request.get<PageResult<DocumentVO[]>>({ url: '/resource/document/page', params })
}

// 获取帮助文档详情
export const getDocument = (id: number) => {
  return request.get<DocumentVO>({ url: '/resource/document/get?id=' + id })
}

// 创建帮助文档
export const createDocument = (data: DocumentVO) => {
  return request.post<number>({ url: '/resource/document/create', data })
}

// 更新帮助文档
export const updateDocument = (data: DocumentVO) => {
  return request.put<void>({ url: '/resource/document/update', data })
}

// 删除帮助文档
export const deleteDocument = (id: number) => {
  return request.delete<void>({ url: '/resource/document/delete?id=' + id })
}
