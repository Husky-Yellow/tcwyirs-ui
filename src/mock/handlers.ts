import { http, HttpResponse, type HttpHandler } from 'msw'
import type { MockConfig, MockRequest } from './types'

// 自动导入所有 mock 模块
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
const mockConfigs: MockConfig[] = Object.values(modules).flatMap(
  (mod: any) => mod.default || []
)

/**
 * 解析 URL 参数
 */
function parseQuery(url: string): Record<string, string> {
  const urlObj = new URL(url)
  const query: Record<string, string> = {}
  urlObj.searchParams.forEach((value, key) => {
    query[key] = value
  })
  return query
}

/**
 * 将 MockConfig 转换为 MSW handler
 */
function createHandler(config: MockConfig): HttpHandler {
  const method = (config.type || 'get').toLowerCase() as keyof typeof http
  const urlPattern = new RegExp(config.url.replace(/\//g, '\\/'))

  return http[method](urlPattern, async ({ request }) => {
    const url = request.url
    const query = parseQuery(url)

    let body: Record<string, any> = {}
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        const text = await request.text()
        if (text) {
          body = JSON.parse(text)
        }
      } catch {
        // ignore parse errors
      }
    }

    const mockRequest: MockRequest = {
      method: request.method.toLowerCase(),
      body,
      query
    }

    let result: any
    if (typeof config.response === 'function') {
      result = config.response(mockRequest)
    } else {
      result = config.response
    }

    return HttpResponse.json(result)
  })
}

// 导出所有 handlers
export const handlers: HttpHandler[] = mockConfigs
  .filter((config) => config.url)
  .map(createHandler)
