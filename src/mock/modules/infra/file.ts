import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import Mock from 'mockjs'

// 生成文件配置数据
const generateMockFileConfigs = (count: number) => {
  const configs = []
  const storageList = [1, 10, 11, 20] // 1-数据库 10-本地 11-FTP 20-S3

  for (let i = 1; i <= count; i++) {
    const storage = Mock.Random.pick(storageList)
    configs.push({
      id: Mock.Random.integer(1, 1000),
      name: Mock.Random.pick(['本地存储', '阿里云OSS', '七牛云', '腾讯云COS', 'MinIO']),
      storage: storage,
      master: Mock.Random.boolean(),
      config: {
        basePath: storage === 10 ? '/upload' : '',
        domain: storage !== 10 ? `https://cdn${i}.example.com` : '',
        endpoint: storage === 20 ? 's3.amazonaws.com' : '',
        bucket: storage !== 10 ? `bucket-${i}` : '',
        accessKey: Mock.Random.string('upper', 16),
        accessSecret: Mock.Random.string('lower', 32)
      },
      remark: Mock.Random.csentence(5, 15),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return configs
}

const mockFileConfigs = generateMockFileConfigs(8)

// 生成文件记录数据
const generateMockFiles = (count: number) => {
  const files = []
  const fileTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/zip', 'text/plain']

  for (let i = 1; i <= count; i++) {
    files.push({
      id: Mock.Random.integer(1, 10000),
      configId: Mock.Random.integer(1, 8),
      name: `${Mock.Random.word(5, 10)}.${Mock.Random.pick(['png', 'jpg', 'pdf', 'zip', 'txt'])}`,
      path: `/upload/${Mock.Random.date('yyyy/MM/dd')}/${Mock.Random.guid()}.png`,
      url: `https://cdn.example.com/${Mock.Random.guid()}.png`,
      type: Mock.Random.pick(fileTypes),
      size: Mock.Random.integer(1024, 10485760),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return files
}

const mockFiles = generateMockFiles(50)

const mockConfigs: MockConfig[] = [
  // 获取文件配置分页列表
  {
    url: '/admin-api/infra/file-config/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockFileConfigs.slice(start, end),
          total: mockFileConfigs.length
        },
        msg: ''
      }
    }
  },

  // 获取文件配置详情
  {
    url: '/admin-api/infra/file-config/get',
    type: 'get',
    response: ({ query }): ApiResponse<any> => {
      const { id } = query
      const config = mockFileConfigs.find((c) => c.id === Number(id)) || mockFileConfigs[0]
      return {
        code: 0,
        data: config,
        msg: ''
      }
    }
  },

  // 创建文件配置
  {
    url: '/admin-api/infra/file-config/create',
    type: 'post',
    response: (): ApiResponse<number> => {
      return {
        code: 0,
        data: Mock.Random.integer(1000, 9999),
        msg: '创建成功'
      }
    }
  },

  // 更新文件配置
  {
    url: '/admin-api/infra/file-config/update',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '更新成功'
      }
    }
  },

  // 删除文件配置
  {
    url: '/admin-api/infra/file-config/delete',
    type: 'delete',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '删除成功'
      }
    }
  },

  // 更新文件配置为主配置
  {
    url: '/admin-api/infra/file-config/update-master',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '设置成功'
      }
    }
  },

  // 测试文件配置
  {
    url: '/admin-api/infra/file-config/test',
    type: 'get',
    response: (): ApiResponse<string> => {
      return {
        code: 0,
        data: '配置正确',
        msg: ''
      }
    }
  },

  // 获取文件分页列表
  {
    url: '/admin-api/infra/file/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockFiles.slice(start, end),
          total: mockFiles.length
        },
        msg: ''
      }
    }
  },

  // 删除文件
  {
    url: '/admin-api/infra/file/delete',
    type: 'delete',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '删除成功'
      }
    }
  },

  // 上传文件
  {
    url: '/admin-api/infra/file/upload',
    type: 'post',
    response: (): ApiResponse<string> => {
      return {
        code: 0,
        data: `https://cdn.example.com/${Mock.Random.guid()}.png`,
        msg: '上传成功'
      }
    }
  }
]

export default mockConfigs
