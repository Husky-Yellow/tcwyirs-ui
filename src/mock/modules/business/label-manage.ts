import type { MockConfig, ApiResponse, PageResponse } from '../../types'

/**
 * 标签管理项
 */
interface LabelManageItem {
  id: string
  labelId: string
  parentId: number | string
  rootId: number | string | null
  linkMsg: string | null
  num: string
  name: string
  type: number
  flag: string
  createTime: number
  children: LabelManageItem[]
}

/**
 * 标签配置项
 */
interface LabelConfig {
  id: string | number
  name: string
  sort: number
  count: number | null
  type: number
  createTime: number
}

/**
 * 标签树节点
 */
interface LabelTreeNode {
  id: string
  parentId: number | string
  name: string
  childList: LabelTreeNode[] | null
}

// Mock 标签管理数据
const mockLabelManageItems: LabelManageItem[] = [
  {
    id: '1947864828944613378',
    labelId: '1932725509586165761',
    parentId: 0,
    rootId: 0,
    linkMsg: null,
    num: 'lab003',
    name: '重点人员',
    type: 1,
    flag: '10000000',
    createTime: 1753242139000,
    children: [
      {
        id: '1947864929045872642',
        labelId: '1932725509586165761',
        parentId: '1947864828944613378',
        rootId: '1947864828944613378',
        linkMsg: null,
        num: 'lab005',
        name: '信访人员',
        type: 1,
        flag: '00000000',
        createTime: 1753242163000,
        children: [
          {
            id: '1953300165879672833',
            labelId: '1932725509586165761',
            parentId: '1947864929045872642',
            rootId: '1947864828944613378',
            linkMsg: null,
            num: 'lab019',
            name: 'test',
            type: 1,
            flag: '00000000',
            createTime: 1754538025000,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: '1947864737554923522',
    labelId: '1932725509586165761',
    parentId: 0,
    rootId: 0,
    linkMsg: null,
    num: 'lab001',
    name: '实有人口',
    type: 0,
    flag: '10010000',
    createTime: 1753242118000,
    children: [
      {
        id: '1947864796501671937',
        labelId: '1932725509586165761',
        parentId: '1947864737554923522',
        rootId: '1947864737554923522',
        linkMsg: null,
        num: 'lab002',
        name: '户籍人口',
        type: 0,
        flag: '11111011',
        createTime: 1753242132000,
        children: [
          {
            id: '1947864879469199361',
            labelId: '1932725509586165761',
            parentId: '1947864796501671937',
            rootId: '1947864737554923522',
            linkMsg: null,
            num: 'lab004',
            name: '流动人口',
            type: 0,
            flag: '10000000',
            createTime: 1753242152000,
            children: []
          }
        ]
      }
    ]
  }
]

// Mock 标签配置数据
const mockLabelConfigs: LabelConfig[] = [
  {
    id: '1932725509586165761',
    name: '人口标签',
    sort: 0,
    count: 6,
    type: 0,
    createTime: 1749632644000
  },
  {
    id: '1932725558747602946',
    name: '组织标签',
    sort: 0,
    count: 4,
    type: 0,
    createTime: 1749632656000
  },
  {
    id: '1932725585146552322',
    name: '场所标签',
    sort: 0,
    count: 4,
    type: 0,
    createTime: 1749632662000
  },
  {
    id: '1932725612145287170',
    name: '物的标签',
    sort: 0,
    count: 4,
    type: 0,
    createTime: 1749632669000
  },
  {
    id: '1947932122160914434',
    name: '自定义标签',
    sort: null,
    count: 1,
    type: 1,
    createTime: 1753258183000
  }
]

// Mock 标签树数据
const mockLabelTree: LabelTreeNode[] = [
  {
    id: '1947864737554923522',
    parentId: 0,
    name: '实有人口',
    childList: [
      {
        id: '1947864796501671937',
        parentId: '1947864737554923522',
        name: '户籍人口',
        childList: [
          {
            id: '1947864879469199361',
            parentId: '1947864796501671937',
            name: '流动人口',
            childList: null
          }
        ]
      }
    ]
  },
  {
    id: '1947864828944613378',
    parentId: 0,
    name: '重点人员',
    childList: [
      {
        id: '1947864929045872642',
        parentId: '1947864828944613378',
        name: '信访人员',
        childList: [
          {
            id: '1953300165879672833',
            parentId: '1947864929045872642',
            name: 'test',
            childList: null
          }
        ]
      }
    ]
  }
]

const mockConfigs: MockConfig[] = [
  // 获取标签管理分页数据
  {
    url: '/admin-api/data/label-manage/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<LabelManageItem>> => {
      const { pageNo = 1, pageSize = 10 } = query
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockLabelManageItems.slice(start, end),
          total: mockLabelManageItems.length
        },
        msg: ''
      }
    }
  },

  // 获取标签树结构
  {
    url: '/admin-api/data/label-manage/tree',
    type: 'get',
    response: (): ApiResponse<LabelTreeNode[]> => ({
      code: 0,
      data: mockLabelTree,
      msg: ''
    })
  },

  // 根据管理ID获取标签树
  {
    url: '/admin-api/data/label-manage/by-manageId-tree',
    type: 'get',
    response: (): ApiResponse<LabelTreeNode[]> => ({
      code: 0,
      data: mockLabelTree,
      msg: ''
    })
  },

  // 获取标签配置列表
  {
    url: '/admin-api/data/label-conf/list',
    type: 'get',
    response: (): ApiResponse<LabelConfig[]> => ({
      code: 0,
      data: mockLabelConfigs,
      msg: ''
    })
  }
]

export default mockConfigs
