import type { MockConfig, ApiResponse } from '../../types'

/**
 * 字段配置项
 */
interface FieldConfig {
  id: string
  manageId: string
  code: string
  name: string
  remark: string | null
  fieldType: number
  bizType: string
  encType: number | null
  length: number
  encFlag: number
  addFlag: number
  editFlag: number
  appViewFlag: number
  pcViewFlag: number
  sort: number
  version: string | null
  createTime: number
  parentCode: string
  fieldConfExtDOList: any[] | null
}

/**
 * 字段扩展配置
 */
interface FieldExtConfig {
  optionsJson: Array<{ label: string; value: string }>
  value: string | null
  name: string
}

// Mock 字段配置数据
const mockFieldConfigs: FieldConfig[] = [
  {
    id: '1947864796631695362',
    manageId: '1947864796501671937',
    code: 'id',
    name: '编码',
    remark: null,
    fieldType: 2,
    bizType: '0',
    encType: null,
    length: 20,
    encFlag: 0,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 1,
    version: null,
    createTime: 1753242132000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1947864796631695363',
    manageId: '1947864796501671937',
    code: 'label',
    name: '系统标签',
    remark: null,
    fieldType: 9,
    bizType: '0',
    encType: null,
    length: 20,
    encFlag: 0,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 2,
    version: null,
    createTime: 1753242132000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1947864796631695364',
    manageId: '1947864796501671937',
    code: 'create_time',
    name: '创建时间',
    remark: null,
    fieldType: 5,
    bizType: '0',
    encType: null,
    length: 20,
    encFlag: 0,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 3,
    version: null,
    createTime: 1753242132000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1947864796631695365',
    manageId: '1947864796501671937',
    code: 'update_time',
    name: '更新时间',
    remark: null,
    fieldType: 5,
    bizType: '0',
    encType: null,
    length: 20,
    encFlag: 0,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 4,
    version: null,
    createTime: 1753242132000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1947864796631695366',
    manageId: '1947864796501671937',
    code: 'deleted',
    name: '是否删除',
    remark: null,
    fieldType: 1,
    bizType: '0',
    encType: null,
    length: 20,
    encFlag: 0,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 5,
    version: null,
    createTime: 1753242132000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1947864796631695367',
    manageId: '1947864796501671937',
    code: 'creator',
    name: '创建者',
    remark: null,
    fieldType: 1,
    bizType: '0',
    encType: null,
    length: 20,
    encFlag: 0,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 6,
    version: null,
    createTime: 1753242132000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1947864796698804226',
    manageId: '1947864796501671937',
    code: 'updater',
    name: '更新者',
    remark: null,
    fieldType: 1,
    bizType: '0',
    encType: null,
    length: 20,
    encFlag: 0,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 7,
    version: null,
    createTime: 1753242132000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1947941875043885058',
    manageId: '1947864796501671937',
    code: 'card_type',
    name: '证件类型',
    remark: '',
    fieldType: 3,
    bizType: '0',
    encType: 0,
    length: 10,
    encFlag: 0,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 8,
    version: null,
    createTime: 1753260509000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1947941875056467969',
    manageId: '1947864796501671937',
    code: 'card_num',
    name: '证件号码',
    remark: '编码应符合 GB 11643',
    fieldType: 1,
    bizType: '0',
    encType: 1,
    length: 18,
    encFlag: 1,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 9,
    version: null,
    createTime: 1753260509000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1947941875060662273',
    manageId: '1947864796501671937',
    code: 'name',
    name: '姓名',
    remark: '',
    fieldType: 1,
    bizType: '0',
    encType: 0,
    length: 50,
    encFlag: 0,
    addFlag: 1,
    editFlag: 0,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 10,
    version: null,
    createTime: 1753260509000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1947941875064856578',
    manageId: '1947864796501671937',
    code: 'systems',
    name: '区域',
    remark: '与用户组织体系关联',
    fieldType: 8,
    bizType: '1',
    encType: 0,
    length: 50,
    encFlag: 0,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 1,
    pcViewFlag: 1,
    sort: 11,
    version: null,
    createTime: 1753260509000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1949711197233766402',
    manageId: '1947864796501671937',
    code: 'uploadText',
    name: '上传测试',
    remark: '上传测试',
    fieldType: 10,
    bizType: '1',
    encType: 0,
    length: 1,
    encFlag: 0,
    addFlag: 0,
    editFlag: 0,
    appViewFlag: 0,
    pcViewFlag: 0,
    sort: 12,
    version: null,
    createTime: 1753682348000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1949716984811278338',
    manageId: '1947864796501671937',
    code: 'uoliadtest',
    name: 'uoliadtest',
    remark: 'uoliadtest',
    fieldType: 10,
    bizType: '1',
    encType: 0,
    length: 1,
    encFlag: 0,
    addFlag: 1,
    editFlag: 1,
    appViewFlag: 0,
    pcViewFlag: 0,
    sort: 13,
    version: null,
    createTime: 1753683728000,
    parentCode: '0',
    fieldConfExtDOList: null
  },
  {
    id: '1952919593502203905',
    manageId: '1947864796501671937',
    code: 'test',
    name: '测试',
    remark: '',
    fieldType: 3,
    bizType: '1',
    encType: 0,
    length: 20,
    encFlag: 0,
    addFlag: 0,
    editFlag: 0,
    appViewFlag: 0,
    pcViewFlag: 0,
    sort: 14,
    version: null,
    createTime: 1754447289000,
    parentCode: '0',
    fieldConfExtDOList: null
  }
]

// 简化的字段配置数据（用于管理ID查询）
const mockSimpleFieldConfigs = [
  {
    id: '1947864796631695362',
    manageId: '1947864796501671937',
    code: 'id',
    name: '编码',
    fieldType: 2,
    bizType: '0',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 1
  },
  {
    id: '1947864796631695363',
    manageId: '1947864796501671937',
    code: 'label',
    name: '系统标签',
    fieldType: 9,
    bizType: '0',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 1
  },
  {
    id: '1947864796631695364',
    manageId: '1947864796501671937',
    code: 'create_time',
    name: '创建时间',
    fieldType: 5,
    bizType: '0',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 1
  },
  {
    id: '1947864796631695365',
    manageId: '1947864796501671937',
    code: 'update_time',
    name: '更新时间',
    fieldType: 5,
    bizType: '0',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 1
  },
  {
    id: '1947864796631695366',
    manageId: '1947864796501671937',
    code: 'deleted',
    name: '是否删除',
    fieldType: 1,
    bizType: '0',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 1
  },
  {
    id: '1947864796631695367',
    manageId: '1947864796501671937',
    code: 'creator',
    name: '创建者',
    fieldType: 1,
    bizType: '0',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 1
  },
  {
    id: '1947864796698804226',
    manageId: '1947864796501671937',
    code: 'updater',
    name: '更新者',
    fieldType: 1,
    bizType: '0',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 1
  },
  {
    id: '1947941875043885058',
    manageId: '1947864796501671937',
    code: 'card_type',
    name: '证件类型',
    fieldType: 3,
    bizType: '0',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 1
  },
  {
    id: '1947941875056467969',
    manageId: '1947864796501671937',
    code: 'card_num',
    name: '证件号码',
    fieldType: 1,
    bizType: '0',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 1
  },
  {
    id: '1947941875060662273',
    manageId: '1947864796501671937',
    code: 'name',
    name: '姓名',
    fieldType: 1,
    bizType: '0',
    addFlag: 1,
    editFlag: 0,
    pcViewFlag: 1
  },
  {
    id: '1947941875064856578',
    manageId: '1947864796501671937',
    code: 'systems',
    name: '区域',
    fieldType: 8,
    bizType: '1',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 1
  },
  {
    id: '1949711197233766402',
    manageId: '1947864796501671937',
    code: 'uploadText',
    name: '上传测试',
    fieldType: 10,
    bizType: '1',
    addFlag: 0,
    editFlag: 0,
    pcViewFlag: 0
  },
  {
    id: '1949716984811278338',
    manageId: '1947864796501671937',
    code: 'uoliadtest',
    name: 'uoliadtest',
    fieldType: 10,
    bizType: '1',
    addFlag: 1,
    editFlag: 1,
    pcViewFlag: 0
  },
  {
    id: '1952919593502203905',
    manageId: '1947864796501671937',
    code: 'test',
    name: '测试',
    fieldType: 3,
    bizType: '1',
    addFlag: 0,
    editFlag: 0,
    pcViewFlag: 0
  }
]

const mockConfigs: MockConfig[] = [
  // 获取字段配置列表
  {
    url: '/admin-api/data/field-conf/list',
    type: 'get',
    response: ({ query }): ApiResponse<FieldConfig[]> => {
      const { manageId } = query
      if (manageId) {
        return {
          code: 0,
          data: mockFieldConfigs.filter((item) => item.manageId === manageId),
          msg: ''
        }
      }
      return {
        code: 0,
        data: mockFieldConfigs,
        msg: ''
      }
    }
  },

  // 根据管理ID获取字段配置列表
  {
    url: '/admin-api/data/field-conf/list-by-manage-id',
    type: 'get',
    response: ({ query }): ApiResponse<any[]> => {
      const { manageId } = query
      if (manageId) {
        return {
          code: 0,
          data: mockSimpleFieldConfigs.filter((item) => item.manageId === manageId),
          msg: ''
        }
      }
      return {
        code: 0,
        data: mockSimpleFieldConfigs,
        msg: ''
      }
    }
  },

  // 获取基础字段配置列表
  {
    url: '/admin-api/data/field-conf/list-base',
    type: 'get',
    response: (): ApiResponse<any[]> => ({
      code: 0,
      data: [
        {
          id: '1943563868319539201',
          manageId: '1943559705967841281',
          code: '姓名',
          name: 'name',
          remark: '请输入姓名',
          fieldType: 1,
          bizType: '1',
          encType: 0,
          length: 20,
          encFlag: 0,
          addFlag: 0,
          editFlag: 0,
          appViewFlag: 0,
          pcViewFlag: 0,
          sort: 8,
          version: null,
          createTime: 1752216711000,
          parentCode: '0',
          fieldConfExtDOList: []
        }
      ],
      msg: ''
    })
  },

  // 获取单个字段配置详情
  {
    url: '/admin-api/data/field-conf/get',
    type: 'get',
    response: ({ query }): ApiResponse<any> => {
      const { id } = query
      const randomId = id || Math.floor(Math.random() * 10000).toString()
      const randomFieldType = Math.ceil(Math.random() * 10)
      const randomBizType = Math.round(Math.random())
      const randomBoolean = () => Math.round(Math.random())

      const fieldTypeOptions = {
        3: [
          {
            optionsJson: [
              { label: '男', value: 'M' },
              { label: '女', value: 'F' }
            ],
            value: null,
            name: '性别选项'
          }
        ],
        4: [
          {
            optionsJson: [
              { label: '阅读', value: 'reading' },
              { label: '运动', value: 'sports' },
              { label: '音乐', value: 'music' }
            ],
            value: null,
            name: '兴趣选项'
          }
        ],
        default: [
          {
            optionsJson: [],
            value: null,
            name: '无'
          }
        ]
      }

      return {
        code: 0,
        data: {
          uuid: randomId + '-uuid',
          id: randomId,
          manageId: 'M' + randomId,
          code: 'field_' + randomId,
          name: '字段' + randomId,
          remark: '这是字段' + randomId + '的备注',
          fieldType: randomFieldType,
          bizType: randomBizType.toString(),
          length: Math.floor(Math.random() * 50) + 1,
          encFlag: randomBoolean(),
          encType: randomBoolean(),
          addFlag: randomBoolean(),
          editFlag: randomBoolean(),
          appViewFlag: randomBoolean(),
          pcViewFlag: randomBoolean(),
          fieldConfExtDOList: fieldTypeOptions[randomFieldType] || fieldTypeOptions.default,
          parentCode: randomFieldType === 3 || randomFieldType === 4 ? 'parent_' + randomId : ''
        },
        msg: ''
      }
    }
  }
]

export default mockConfigs
