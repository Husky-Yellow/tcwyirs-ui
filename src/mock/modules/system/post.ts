import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import Mock from 'mockjs'

// 生成岗位数据
const generateMockPosts = (count: number) => {
  const posts = []
  const postNames = [
    '董事长',
    '总经理',
    '技术总监',
    '产品经理',
    '开发工程师',
    '测试工程师',
    '运维工程师',
    'UI设计师',
    '人力资源',
    '财务专员'
  ]
  const postCodes = [
    'chairman',
    'ceo',
    'cto',
    'pm',
    'dev',
    'qa',
    'ops',
    'ui',
    'hr',
    'finance'
  ]

  for (let i = 0; i < count && i < postNames.length; i++) {
    posts.push({
      id: i + 1,
      name: postNames[i],
      code: postCodes[i],
      sort: i + 1,
      status: Mock.Random.pick([0, 1]), // 0-正常 1-停用
      remark: Mock.Random.csentence(5, 15),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return posts
}

const mockPosts = generateMockPosts(10)

const mockConfigs: MockConfig[] = [
  // 获取岗位分页列表
  {
    url: '/admin-api/system/post/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockPosts.slice(start, end),
          total: mockPosts.length
        },
        msg: ''
      }
    }
  },

  // 获取岗位精简列表
  {
    url: '/admin-api/system/post/simple-list',
    type: 'get',
    response: (): ApiResponse<any[]> => {
      return {
        code: 0,
        data: mockPosts.map((post) => ({
          id: post.id,
          name: post.name,
          code: post.code
        })),
        msg: ''
      }
    }
  },

  // 获取岗位详情
  {
    url: '/admin-api/system/post/get',
    type: 'get',
    response: ({ query }): ApiResponse<any> => {
      const { id } = query
      const post = mockPosts.find((p) => p.id === Number(id)) || mockPosts[0]
      return {
        code: 0,
        data: post,
        msg: ''
      }
    }
  },

  // 创建岗位
  {
    url: '/admin-api/system/post/create',
    type: 'post',
    response: (): ApiResponse<number> => {
      return {
        code: 0,
        data: Mock.Random.integer(1000, 9999),
        msg: '创建成功'
      }
    }
  },

  // 更新岗位
  {
    url: '/admin-api/system/post/update',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '更新成功'
      }
    }
  },

  // 删除岗位
  {
    url: '/admin-api/system/post/delete',
    type: 'delete',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '删除成功'
      }
    }
  }
]

export default mockConfigs
