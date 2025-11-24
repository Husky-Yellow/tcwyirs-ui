import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import { Random } from '../../utils'

// 生成流程模型数据
const generateMockModels = (count: number) => {
  const models: any[] = []
  for (let i = 1; i <= count; i++) {
    models.push({
      id: Random.guid(),
      key: `process_${Random.word(5, 10)}`,
      name: Random.pick([
        '请假审批流程',
        '报销审批流程',
        '采购申请流程',
        '合同审批流程',
        '项目立项流程',
        '人员招聘流程'
      ]),
      description: Random.csentence(10, 30),
      category: Random.pick(['OA', 'HR', 'Finance', 'Purchase']),
      formType: Random.integer(10, 20),
      formId: Random.integer(1, 100),
      formCustomCreatePath: '/bpm/oa/leave/create',
      formCustomViewPath: '/bpm/oa/leave/detail',
      version: Random.integer(1, 10),
      metaInfo: '{}',
      icon: Random.pick(['el-icon-document', 'el-icon-folder', 'el-icon-setting']),
      status: Random.integer(1, 2), // 1-激活 2-挂起
      processDefinition: {
        id: `def_${Random.guid()}`,
        version: Random.integer(1, 5),
        suspensionState: Random.integer(1, 2)
      },
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return models
}

const mockModels = generateMockModels(20)

const mockConfigs: MockConfig[] = [
  // 获取流程模型分页列表
  {
    url: '/admin-api/bpm/model/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockModels.slice(start, end),
          total: mockModels.length
        },
        msg: ''
      }
    }
  },

  // 获取流程模型详情
  {
    url: '/admin-api/bpm/model/get',
    type: 'get',
    response: (): ApiResponse<any> => {
      const model = mockModels[0]
      return {
        code: 0,
        data: model,
        msg: ''
      }
    }
  },

  // 创建流程模型
  {
    url: '/admin-api/bpm/model/create',
    type: 'post',
    response: (): ApiResponse<string> => {
      return {
        code: 0,
        data: Random.guid(),
        msg: '创建成功'
      }
    }
  },

  // 更新流程模型
  {
    url: '/admin-api/bpm/model/update',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '更新成功'
      }
    }
  },

  // 删除流程模型
  {
    url: '/admin-api/bpm/model/delete',
    type: 'delete',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '删除成功'
      }
    }
  },

  // 部署流程模型
  {
    url: '/admin-api/bpm/model/deploy',
    type: 'post',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '部署成功'
      }
    }
  },

  // 修改流程模型状态
  {
    url: '/admin-api/bpm/model/update-state',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '状态修改成功'
      }
    }
  }
]

export default mockConfigs
