import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { ProjectVO, ProjectPageReqVO, ProjectExtendVO, AddProjectMemberVO, ProjectMemberVO } from '@/api/resource/project'
import { db, nextId, paginate } from './_data'

const mockConfigs: MockConfig[] = [
  // 创建项目
  {
    url: '/admin-api/resource/project/create',
    type: 'post',
    response: ({ body }): ApiResponse<number> => {
      const data = body as ProjectVO
      const id = nextId('project')
      const item: ProjectVO = { ...data, id, createTime: new Date() as any }
      db.projects.unshift(item)
      return { code: 0, data: id, msg: '' }
    }
  },
  // 更新项目
  {
    url: '/admin-api/resource/project/update',
    type: 'put',
    response: ({ body }): ApiResponse<boolean> => {
      const data = body as ProjectVO
      const idx = db.projects.findIndex((p) => p.id === data.id)
      if (idx >= 0) {
        db.projects[idx] = { ...db.projects[idx], ...data }
        return { code: 0, data: true, msg: '' }
      }
      return { code: 0, data: false, msg: '' }
    }
  },
  // 删除项目
  {
    url: '/admin-api/resource/project/delete',
    type: 'delete',
    response: ({ query }): ApiResponse<boolean> => {
      const id = Number(query.id)
      const len = db.projects.length
      db.projects = db.projects.filter((p) => p.id !== id)
      db.projectMembers = db.projectMembers.filter((m) => m.projectId !== id)
      return { code: 0, data: db.projects.length < len, msg: '' }
    }
  },
  // 获取项目详情
  {
    url: '/admin-api/resource/project/get',
    type: 'get',
    response: ({ query }): ApiResponse<ProjectVO | null> => {
      const id = Number(query.id)
      const item = db.projects.find((p) => p.id === id) || null
      return { code: 0, data: item, msg: '' }
    }
  },
  // 项目分页
  {
    url: '/admin-api/resource/project/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<ProjectVO>> => {
      const { pageNo = 1, pageSize = 10, name, status } = query as any as ProjectPageReqVO & any
      let list = db.projects.slice()
      if (name) {
        const n = String(name).toLowerCase()
        list = list.filter((p) => (p.name || '').toLowerCase().includes(n))
      }
      if (status !== undefined && status !== null && String(status) !== '') {
        list = list.filter((p) => String(p.status) === String(status))
      }
      list.sort((a, b) => Number(b.id) - Number(a.id))
      const { list: pageList, total } = paginate(list, Number(pageNo), Number(pageSize))
      return { code: 0, data: { list: pageList, total }, msg: '' }
    }
  },
  // 项目延期
  {
    url: '/admin-api/resource/project/extend',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const { id, days } = body as ProjectExtendVO
      const item = db.projects.find((p) => p.id === id)
      if (item) {
        const end = item.endTime ? new Date(item.endTime) : new Date()
        end.setDate(end.getDate() + Number(days || 0))
        item.endTime = end as any
      }
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  // 添加成员
  {
    url: '/admin-api/resource/project/member/add',
    type: 'post',
    response: ({ body }): ApiResponse<void> => {
      const data = body as AddProjectMemberVO
      const id = nextId('projectMember')
      const member: ProjectMemberVO = { id, projectId: data.projectId, userId: data.userId, userName: 'User_' + data.userId, role: data.role || 'Member', createTime: new Date() as any }
      db.projectMembers.push(member)
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  // 移除成员
  {
    url: '/admin-api/resource/project/member/remove',
    type: 'delete',
    response: ({ query }): ApiResponse<void> => {
      const id = Number(query.id)
      db.projectMembers = db.projectMembers.filter((m) => m.id !== id)
      return { code: 0, data: undefined as any, msg: '' }
    }
  },
  // 成员列表
  {
    url: '/admin-api/resource/project/member/list',
    type: 'get',
    response: ({ query }): ApiResponse<ProjectMemberVO[]> => {
      const projectId = Number(query.projectId)
      const list = db.projectMembers.filter((m) => m.projectId === projectId)
      return { code: 0, data: list, msg: '' }
    }
  }
]

export default mockConfigs
