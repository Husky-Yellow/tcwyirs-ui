import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { ResourceInfoVO, ResourceInfoPageReqVO } from '@/api/resource/info'
import { db, nextId, paginate } from './_data'

const mockConfigs: MockConfig[] = [
  // 创建资源
  {
    url: '/admin-api/resource/info/create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as ResourceInfoVO
      const id = nextId('resourceInfo')
      const item: ResourceInfoVO = {
        ...data,
        id,
        status: data.status ?? 0,
        createTime: new Date() as any,
        updateTime: new Date() as any
      }
      db.resourceInfos.unshift(item)
      return { code: 0, data: id, msg: '' }
    }
  },
  // 更新资源
  {
    url: '/admin-api/resource/info/update',
    type: 'put',
    response: ({ body }): ApiResponse<boolean> => {
      const data = body as ResourceInfoVO
      const idx = db.resourceInfos.findIndex((r) => r.id === data.id)
      if (idx >= 0) {
        db.resourceInfos[idx] = { ...db.resourceInfos[idx], ...data, updateTime: new Date() as any }
        return { code: 0, data: true, msg: '' }
      }
      return { code: 0, data: false, msg: '' }
    }
  },
  // 删除资源
  {
    url: '/admin-api/resource/info/delete',
    type: 'delete',
    response: ({ query }): ApiResponse<boolean> => {
      const id = Number(query.id)
      const len = db.resourceInfos.length
      db.resourceInfos = db.resourceInfos.filter((r) => r.id !== id)
      return { code: 0, data: db.resourceInfos.length < len, msg: '' }
    }
  },
  // 获取资源详情
  {
    url: '/admin-api/resource/info/get',
    type: 'get',
    response: ({ query }): ApiResponse<ResourceInfoVO | null> => {
      const id = Number(query.id)
      const item = db.resourceInfos.find((r) => r.id === id) || null
      return { code: 0, data: item, msg: '' }
    }
  },
  // 资源分页
  {
    url: '/admin-api/resource/info/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ResourceInfoVO>> => {
      const { pageNo = 1, pageSize = 10, name, type, status, tagId } = query as any as ResourceInfoPageReqVO & any
      let list = db.resourceInfos.slice()
      if (name) {
        const n = String(name).toLowerCase()
        list = list.filter((r) => r.name.toLowerCase().includes(n))
      }
      if (type !== undefined && type !== null && String(type) !== '') {
        list = list.filter((r) => String(r.type) === String(type))
      }
      if (status !== undefined && status !== null && String(status) !== '') {
        list = list.filter((r) => String(r.status) === String(status))
      }
      if (tagId) {
        const tid = Number(tagId)
        list = list.filter((r) => Array.isArray(r.tags) && r.tags!.includes(tid))
      }
      list.sort((a, b) => Number(b.id) - Number(a.id))
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  // 发起上架
  {
    url: '/admin-api/resource/info/publish',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const id = Number(body.id)
      const item = db.resourceInfos.find((r) => r.id === id)
      if (item) item.status = 2
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  // 下架
  {
    url: '/admin-api/resource/info/unpublish',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const id = Number(body.id)
      const item = db.resourceInfos.find((r) => r.id === id)
      if (item) item.status = 3
      return { code: 0, data: undefined as any, msg: '' }
    }
  }
]

export default mockConfigs
