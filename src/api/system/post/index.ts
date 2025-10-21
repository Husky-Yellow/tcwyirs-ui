import request from '@/config/axios'

export interface PostVO {
  id?: number
  name: string
  code: string
  sort: number
  status: number
  remark: string
  createTime?: Date
}

export interface PostPageReqVO extends PageParam {
  name?: string
  code?: string
  status?: number
}

// 查询岗位列表
export const getPostPage = async (
  params: PostPageReqVO
): Promise<PageResult<PostVO[]>> => {
  return await request.get<PageResult<PostVO[]>>({ url: '/system/post/page', params })
}

// 获取岗位精简信息列表
export const getSimplePostList = async (): Promise<PostVO[]> => {
  return await request.get<PostVO[]>({ url: '/system/post/simple-list' })
}

// 查询岗位详情
export const getPost = async (id: number) => {
  return await request.get<PostVO>({ url: '/system/post/get?id=' + id })
}

// 新增岗位
export const createPost = async (data: PostVO) => {
  return await request.post<void>({ url: '/system/post/create', data })
}

// 修改岗位
export const updatePost = async (data: PostVO) => {
  return await request.put<void>({ url: '/system/post/update', data })
}

// 删除岗位
export const deletePost = async (id: number) => {
  return await request.delete<void>({ url: '/system/post/delete?id=' + id })
}

// 导出岗位
export const exportPost = async (params: PostPageReqVO) => {
  return await request.download<Blob>({ url: '/system/post/export', params })
}
