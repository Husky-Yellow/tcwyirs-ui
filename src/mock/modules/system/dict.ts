import type { MockConfig, ApiResponse, PageResponse } from '../../types'
import type { DictData } from '../../types'

// Mock 字典数据
const mockDictData: DictData[] = [
  {
    id: '1945719078731190274',
    sort: 1,
    label: '居民身份证',
    value: '1',
    dictType: 'card_type',
    status: 0,
    colorType: '',
    cssClass: '',
    remark: '',
    createTime: 1752730553000
  },
  {
    id: '1945719153461104642',
    sort: 2,
    label: '护照',
    value: '2',
    dictType: 'card_type',
    status: 0,
    colorType: '',
    cssClass: '',
    remark: '',
    createTime: 1752730571000
  },
  {
    id: '1945719203234910209',
    sort: 3,
    label: '港澳同胞回乡证',
    value: '3',
    dictType: 'card_type',
    status: 0,
    colorType: '',
    cssClass: '',
    remark: '',
    createTime: 1752730582000
  },
  {
    id: '1945719307886989314',
    sort: 4,
    label: '港澳居民来往内地通行证',
    value: '4',
    dictType: 'card_type',
    status: 0,
    colorType: '',
    cssClass: '',
    remark: '',
    createTime: 1752730607000
  },
  {
    id: '1945719345983852546',
    sort: 5,
    label: '中华人民共和国来往港澳通行证',
    value: '5',
    dictType: 'card_type',
    status: 0,
    colorType: '',
    cssClass: '',
    remark: '',
    createTime: 1752730616000
  },
  {
    id: '1945719394566475777',
    sort: 6,
    label: '台湾居民来往大陆通行证',
    value: '6',
    dictType: 'card_type',
    status: 0,
    colorType: '',
    cssClass: '',
    remark: '',
    createTime: 1752730628000
  },
  {
    id: '1945719440703819777',
    sort: 7,
    label: '大陆居民往来台湾通行证',
    value: '7',
    dictType: 'card_type',
    status: 0,
    colorType: '',
    cssClass: '',
    remark: '',
    createTime: 1752730639000
  }
]

const mockConfigs: MockConfig[] = [
  // 获取字典数据分页列表
  {
    url: '/admin-api/system/dict-data/page',
    type: 'get',
    response: ({ query }): ApiResponse<PageResponse<DictData>> => {
      const {
        pageNo = 1,
        pageSize = 10,
        dictType,
        label,
        status
      } = query

      let filteredData = mockDictData

      // 按字典类型过滤
      if (dictType) {
        filteredData = filteredData.filter(item => item.dictType === dictType)
      }

      // 按标签过滤
      if (label) {
        filteredData = filteredData.filter(item =>
          item.label.toLowerCase().includes(label.toLowerCase())
        )
      }

      // 按状态过滤
      if (status !== undefined && status !== '') {
        filteredData = filteredData.filter(item => item.status === Number(status))
      }

      const start = (Number(pageNo) - 1) * Number(pageSize)
      const end = start + Number(pageSize)

      return {
        code: 0,
        data: {
          list: filteredData.slice(start, end),
          total: filteredData.length
        },
        msg: ''
      }
    }
  },

  // 获取字典数据列表（不分页）
  {
    url: '/admin-api/system/dict-data/list',
    type: 'get',
    response: ({ query }): ApiResponse<DictData[]> => {
      const { dictType } = query

      if (dictType) {
        return {
          code: 0,
          data: mockDictData.filter(item => item.dictType === dictType),
          msg: ''
        }
      }

      return {
        code: 0,
        data: mockDictData,
        msg: ''
      }
    }
  },

  // 获取字典数据精简列表（simple-list）
  {
    url: '/admin-api/system/dict-data/simple-list',
    type: 'get',
    response: ({ query }): ApiResponse<DictData[]> => {
      const { dictType } = query
      let data = mockDictData
      if (dictType) {
        data = data.filter((item) => item.dictType === dictType)
      }
      return {
        code: 0,
        data,
        msg: ''
      }
    }
  }
]

export default mockConfigs