import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import Mock from 'mockjs'

// 生成流程实例数据
const generateMockProcessInstances = (count: number) => {
  const instances = []
  const statusList = [1, 2, 3, 4] // 1-进行中 2-已完成 3-已取消 4-已拒绝

  for (let i = 1; i <= count; i++) {
    const status = Mock.Random.pick(statusList)
    instances.push({
      id: `instance_${Mock.Random.guid()}`,
      name: Mock.Random.pick([
        '张三的请假申请',
        '李四的报销申请',
        '王五的采购申请',
        '赵六的合同审批'
      ]),
      processDefinitionId: `process:${Mock.Random.integer(1, 10)}:${Mock.Random.integer(1, 5)}`,
      processDefinitionName: Mock.Random.pick([
        '请假审批流程',
        '报销审批流程',
        '采购审批流程',
        '合同审批流程'
      ]),
      category: Mock.Random.pick(['OA', 'HR', 'Finance', 'Purchase']),
      status: status,
      result: status === 2 ? 2 : status === 4 ? 3 : status === 3 ? 4 : 1,
      startUserId: Mock.Random.integer(1, 100),
      startUserNickname: Mock.Random.cname(),
      startTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      endTime: status !== 1 ? Mock.Random.datetime('yyyy-MM-dd HH:mm:ss') : null,
      durationInMillis: status !== 1 ? Mock.Random.integer(3600000, 86400000) : null,
      businessKey: `BUS_${Mock.Random.integer(10000, 99999)}`,
      formVariables: {
        reason: Mock.Random.csentence(10, 30),
        days: Mock.Random.integer(1, 10),
        amount: Mock.Random.float(100, 10000, 2, 2)
      },
      tasks: []
    })
  }
  return instances
}

const mockProcessInstances = generateMockProcessInstances(30)

const mockConfigs: MockConfig[] = [
  // 获取流程实例分页列表
  {
    url: '/admin-api/bpm/process-instance/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockProcessInstances.slice(start, end),
          total: mockProcessInstances.length
        },
        msg: ''
      }
    }
  },

  // 获取我的流程实例分页列表
  {
    url: '/admin-api/bpm/process-instance/my-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)
      const myInstances = mockProcessInstances.slice(0, 15)

      return {
        code: 0,
        data: {
          list: myInstances.slice(start, end),
          total: myInstances.length
        },
        msg: ''
      }
    }
  },

  // 获取流程实例详情
  {
    url: '/admin-api/bpm/process-instance/get',
    type: 'get',
    response: ({ query }): ApiResponse<any> => {
      const instance = mockProcessInstances[0]
      return {
        code: 0,
        data: instance,
        msg: ''
      }
    }
  },

  // 创建流程实例
  {
    url: '/admin-api/bpm/process-instance/create',
    type: 'post',
    response: (): ApiResponse<string> => {
      return {
        code: 0,
        data: `instance_${Mock.Random.guid()}`,
        msg: '创建成功'
      }
    }
  },

  // 取消流程实例
  {
    url: '/admin-api/bpm/process-instance/cancel',
    type: 'delete',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '取消成功'
      }
    }
  },

  // 获取流程实例的审批记录
  {
    url: '/admin-api/bpm/process-instance/get-approve-records',
    type: 'get',
    response: (): ApiResponse<any[]> => {
      return {
        code: 0,
        data: [
          {
            id: Mock.Random.guid(),
            taskId: Mock.Random.guid(),
            taskName: '部门审批',
            assignee: Mock.Random.cname(),
            status: 2,
            reason: '同意',
            createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
            endTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
          },
          {
            id: Mock.Random.guid(),
            taskId: Mock.Random.guid(),
            taskName: 'HR审批',
            assignee: Mock.Random.cname(),
            status: 2,
            reason: '同意',
            createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
            endTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
          }
        ],
        msg: ''
      }
    }
  }
]

export default mockConfigs
