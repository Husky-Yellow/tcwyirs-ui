import Mock from 'mockjs'
import type { MockConfig, MockRequestOptions, MockRequest } from './types'

/**
 * 解析 URL 参数
 * @param url - 包含查询参数的 URL
 * @returns 解析后的参数对象
 */
function param2Obj(url: string): Record<string, string> {
  const search = decodeURIComponent(url.split('?')[1] || '').replace(/\+/g, ' ')
  if (!search) return {}
  
  return Object.fromEntries(
    search.split('&')
      .filter(item => item.includes('='))
      .map(item => {
        const [key, value = ''] = item.split('=')
        return [key, value]
      })
  )
}

// 自动导入所有 mock 模块
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
export const mocks = Object.values(modules).flatMap((mod: any) => mod.default || mod)

// 类型定义已移动到 types.ts

/**
 * 初始化 Mock XHR
 */
export function mockXHR(): void {
  // 保存原始的 send 方法
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  
  // 重写 send 方法
  Mock.XHR.prototype.send = function(...args: any[]) {
    if (this.custom?.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false
      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...args)
  }

  /**
   * 包装响应函数
   * @param respond - 响应数据或响应函数
   * @returns 包装后的响应函数
   */
  function XHR2ExpressReqWrap(respond: any) {
    return function(options: MockRequestOptions) {
      let result = null
      
      if (typeof respond === 'function') {
        const { body, type, url } = options
        const mockRequest: MockRequest = {
          method: type.toLowerCase(),
          body: body ? safeJsonParse(body) : {},
          query: param2Obj(url)
        }
        result = respond(mockRequest)
      } else {
        result = respond
      }
      
      return Mock.mock(result)
    }
  }

  // 注册所有 mock 接口
  mocks.forEach((mock: MockConfig) => {
    if (!mock.url) {
      console.warn('Mock config missing url:', mock)
      return
    }
    
    Mock.mock(
      new RegExp(mock.url.replace(/\//g, '\\/')), 
      mock.type || 'get', 
      XHR2ExpressReqWrap(mock.response)
    )
  })
}

/**
 * 安全的 JSON 解析
 * @param str - 待解析的字符串
 * @returns 解析后的对象或空对象
 */
function safeJsonParse(str: string): Record<string, any> {
  try {
    return JSON.parse(str)
  } catch {
    return {}
  }
}