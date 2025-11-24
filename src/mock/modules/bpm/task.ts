import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import { Random } from '../../utils'

// 任务状态枚举
enum TaskStatusEnum {
  NOT_START = -1, // 未开始
  WAIT = 0, // 待审批
  RUNNING = 1, // 审批中
  APPROVE = 2, // 审批通过
  REJECT = 3, // 审批不通过
  CANCEL = 4, // 已取消
  RETURN = 5, // 已退回
  APPROVING = 7 // 审批通过中
}

// 生成 Mock 任务数据
const generateMockTasks = (count: number, status?: TaskStatusEnum) => {
  const tasks: any[] = []
  for (let i = 1; i <= count; i++) {
    tasks.push({
      id: `task_${Random.guid()}`,
      processInstanceId: `process_${Random.guid()}`,
      name: Random.pick(['请假审批', '报销审批', '采购审批', '合同审批', '项目立项审批']),
      taskDefinitionKey: Random.pick(['userTask1', 'userTask2', 'managerTask', 'hrTask']),
      status: status !== undefined ? status : Random.integer(0, 7),
      assignee: Random.cname(),
      assigneeId: Random.integer(1, 100),
      startTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      endTime:
        status === TaskStatusEnum.APPROVE || status === TaskStatusEnum.REJECT
          ? Random.datetime('yyyy-MM-dd HH:mm:ss')
          : null,
      dueDate: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      formKey: Random.pick(['leave-form', 'expense-form', 'contract-form']),
      processDefinitionId: `process:${Random.integer(1, 10)}:${Random.integer(1, 5)}`,
      processDefinitionName: Random.pick(['请假流程', '报销流程', '采购流程', '合同审批流程']),
      businessKey: `BUS_${Random.integer(10000, 99999)}`,
      reason: Random.csentence(10, 30),
      comment: Random.csentence(5, 20),
      createTime: Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  return tasks
}

// 待办任务
const todoTasks = generateMockTasks(15, TaskStatusEnum.WAIT)
// 已办任务
const doneTasks = generateMockTasks(25, TaskStatusEnum.APPROVE)
// 管理任务
const managerTasks = generateMockTasks(30)

const mockConfigs: MockConfig[] = [
  // 获取待办任务分页列表
  {
    url: '/admin-api/bpm/task/todo-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: todoTasks.slice(start, end),
          total: todoTasks.length
        },
        msg: ''
      }
    }
  },

  // 获取已办任务分页列表
  {
    url: '/admin-api/bpm/task/done-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: doneTasks.slice(start, end),
          total: doneTasks.length
        },
        msg: ''
      }
    }
  },

  // 获取管理任务分页列表
  {
    url: '/admin-api/bpm/task/manager-page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<any>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: managerTasks.slice(start, end),
          total: managerTasks.length
        },
        msg: ''
      }
    }
  },

  // 审批通过
  {
    url: '/admin-api/bpm/task/approve',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '审批成功'
      }
    }
  },

  // 审批拒绝
  {
    url: '/admin-api/bpm/task/reject',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '已拒绝'
      }
    }
  },

  // 根据流程实例ID获取任务列表
  {
    url: '/admin-api/bpm/task/list-by-process-instance-id',
    type: 'get',
    response: (): ApiResponse<any[]> => {
      const tasks = generateMockTasks(5)
      return {
        code: 0,
        data: tasks,
        msg: ''
      }
    }
  },

  // 获取可退回的节点列表
  {
    url: '/admin-api/bpm/task/list-by-return',
    type: 'get',
    response: (): ApiResponse<any[]> => {
      return {
        code: 0,
        data: [
          {
            id: 'node_1',
            name: '提交申请',
            taskDefinitionKey: 'startTask'
          },
          {
            id: 'node_2',
            name: '部门审批',
            taskDefinitionKey: 'deptTask'
          }
        ],
        msg: ''
      }
    }
  },

  // 退回任务
  {
    url: '/admin-api/bpm/task/return',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '退回成功'
      }
    }
  },

  // 委派任务
  {
    url: '/admin-api/bpm/task/delegate',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '委派成功'
      }
    }
  },

  // 转派任务
  {
    url: '/admin-api/bpm/task/transfer',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '转派成功'
      }
    }
  },

  // 加签
  {
    url: '/admin-api/bpm/task/create-sign',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '加签成功'
      }
    }
  },

  // 减签
  {
    url: '/admin-api/bpm/task/delete-sign',
    type: 'delete',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '减签成功'
      }
    }
  },

  // 抄送
  {
    url: '/admin-api/bpm/task/copy',
    type: 'put',
    response: (): ApiResponse<boolean> => {
      return {
        code: 0,
        data: true,
        msg: '抄送成功'
      }
    }
  },

  // 获取我的待办任务
  {
    url: '/admin-api/bpm/task/my-todo',
    type: 'get',
    response: (): ApiResponse<any> => {
      const task = generateMockTasks(1, TaskStatusEnum.WAIT)[0]
      return {
        code: 0,
        data: task,
        msg: ''
      }
    }
  },

  // 获取减签任务列表
  {
    url: '/admin-api/bpm/task/list-by-parent-task-id',
    type: 'get',
    response: (): ApiResponse<any[]> => {
      const tasks = generateMockTasks(3, TaskStatusEnum.WAIT)
      return {
        code: 0,
        data: tasks,
        msg: ''
      }
    }
  }
]

export default mockConfigs
