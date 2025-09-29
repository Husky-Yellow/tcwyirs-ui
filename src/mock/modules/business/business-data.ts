import type { MockConfig, ApiResponse, PageResponse } from '../../types'

/**
 * 业务数据项
 */
interface BusinessDataItem {
  id: string
  label: string | null
  create_time: number
  update_time: number
  deleted: boolean
  creator: string
  updater: string
  [key: string]: any // 支持动态字段
}

/**
 * 查询配置项
 */
interface QueryConfig {
  id: string
  manageId: string
  fieldIds: string
  fieldCodes: string
  hint: string
  queryType: number
  defaultValue: string
  sort: number
  createTime: number
}

/**
 * 操作配置项
 */
interface OperateConfig {
  id: string
  manageId: string
  operateName: string
  operateType: number
  showFlag: number
  sort: number
  createTime: number
}

// Mock 业务数据
const mockBusinessData: BusinessDataItem[] = [
  {
    id: '1947531577596104704',
    label: null,
    create_time: 1753162686000,
    update_time: 1753162686000,
    deleted: false,
    creator: '1',
    updater: '',
    REAL_C: '2',
    danxuan: '外部单选文本',
    duoxuan: null,
    bzdz: null,
    fh: null
  },
  {
    id: '1947531578552406016',
    label: null,
    create_time: 1753162687000,
    update_time: 1753162687000,
    deleted: false,
    creator: '1',
    updater: '',
    REAL_C: '1',
    danxuan: '内部单选文本',
    duoxuan: null,
    bzdz: null,
    fh: null
  },
  {
    id: '1947552044268695552',
    label: null,
    create_time: 1753167566000,
    update_time: 1753167566000,
    deleted: false,
    creator: '1',
    updater: '',
    REAL_C: '2',
    danxuan: '1',
    duoxuan: null,
    bzdz: null,
    fh: null
  }
]

// Mock 查询配置
const mockQueryConfigs: QueryConfig[] = [
  {
    id: '1950464185697132546',
    manageId: '1947864796501671937',
    fieldIds: '1947941875060662273',
    fieldCodes: 'name',
    fieldNames: '姓名',
    hint: '111111',
    queryType: 0,
    defaultValue: '',
    sort: 0,
    createTime: 1753861874000
  },
  {
    id: '1950464185810378753',
    manageId: '1947864796501671937',
    fieldIds: '1947941875064856578',
    fieldCodes: 'systems',
    fieldNames: '区域',
    hint: '',
    queryType: 2,
    defaultValue: '',
    sort: 1,
    createTime: 1753861874000
  },
  {
    id: '1952923438194188290',
    manageId: '1947864796501671937',
    fieldIds: '1947941875056467969,1947941875060662273',
    fieldCodes: 'card_num,name',
    fieldNames: '证件号码,姓名',
    hint: '432423',
    queryType: 0,
    defaultValue: '',
    sort: 2,
    createTime: 1754448206000
  }
]

// Mock 操作配置
const mockOperateConfigs: OperateConfig[] = [
  {
    id: '1932726818544558081',
    manageId: '1935524876651073537',
    operateName: '添加',
    operateType: 0,
    showFlag: 0,
    sort: 0,
    createTime: 1749632957000
  },
  {
    id: '1932726880922247170',
    manageId: '1935524876651073537',
    operateName: '编辑',
    operateType: 1,
    showFlag: 0,
    sort: 1,
    createTime: 1749632971000
  },
  {
    id: '1932726927856508929',
    manageId: '1935524876651073537',
    operateName: '删除',
    operateType: 2,
    showFlag: 0,
    sort: 2,
    createTime: 1749632983000
  },
  {
    id: '1932726958261018625',
    manageId: '1935524876651073537',
    operateName: '导入',
    operateType: 3,
    showFlag: 0,
    sort: 3,
    createTime: 1749632990000
  },
  {
    id: '1932726998052380673',
    manageId: '1935524876651073537',
    operateName: '导出',
    operateType: 4,
    showFlag: 0,
    sort: 4,
    createTime: 1749632999000
  }
]

const mockConfigs: MockConfig[] = [
  // 获取业务数据分页列表 (POST)
  {
    url: '/admin-api/data/business-data/page',
    type: 'post',
    response: ({ body, query }): ApiResponse<PageResponse<BusinessDataItem>> => {
      const { pageNo = 1, pageSize = 10 } = body || query || {}
      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: mockBusinessData.slice(start, end),
          total: mockBusinessData.length
        },
        msg: ''
      }
    }
  },

  // 获取业务数据分页列表 (GET)
  {
    url: '/admin-api/data/business-data/page',
    type: 'get',
    response: (): ApiResponse<BusinessDataItem[]> => ({
      code: 0,
      data: [],
      msg: ''
    })
  },

  // 业务数据新增校验
  {
    url: '/admin-api/data/business-data/add-check',
    type: 'post',
    response: (): ApiResponse<null> => ({
      code: 0,
      data: null,
      msg: ''
    })
  },

  // 获取查询配置列表
  {
    url: '/admin-api/data/query-conf/list',
    type: 'get',
    response: ({ query }): ApiResponse<QueryConfig[]> => {
      const { manageId } = query
      if (manageId) {
        return {
          code: 0,
          data: mockQueryConfigs.filter((item) => item.manageId === manageId),
          msg: ''
        }
      }
      return {
        code: 0,
        data: mockQueryConfigs,
        msg: ''
      }
    }
  },

  // 获取操作配置列表
  {
    url: '/admin-api/data/operate-conf/list',
    type: 'get',
    response: ({ query }): ApiResponse<OperateConfig[]> => {
      const { manageId } = query
      if (manageId) {
        return {
          code: 0,
          data: mockOperateConfigs.filter((item) => item.manageId === manageId),
          msg: ''
        }
      }
      return {
        code: 0,
        data: mockOperateConfigs,
        msg: ''
      }
    }
  },

  // 获取配置列表（通用）
  {
    url: '/admin-api/data/conf/list',
    type: 'get',
    response: (): ApiResponse<any[]> => ({
      code: 0,
      data: [
        {
          id: '1937786492331507715',
          manageId: '1935524876651073537',
          formId: null,
          fieldId: '1935951343205822465',
          fieldCode: null,
          type: 2,
          rule: 1,
          customJson: null,
          createTime: 1750839277000
        },
        {
          id: '1938149476572663810',
          manageId: '1935524876651073537',
          formId: null,
          fieldId: '1937390336233467906',
          fieldCode: null,
          type: 2,
          rule: 1,
          customJson: null,
          createTime: 1750925819000
        }
      ],
      msg: ''
    })
  },

  // 获取排序配置列表
  {
    url: '/admin-api/data/sort-conf/list',
    type: 'get',
    response: (): ApiResponse<any[]> => ({
      code: 0,
      data: [
        {
          id: '1937786492331507715',
          manageId: '1935524876651073537',
          formId: null,
          fieldId: '1935951343205822465',
          fieldCode: null,
          type: 2,
          rule: 1,
          customJson: null,
          createTime: 1750839277000
        }
      ],
      msg: ''
    })
  }
]

export default mockConfigs
