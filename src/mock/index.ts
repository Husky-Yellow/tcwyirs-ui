/**
 * MSW Mock 服务入口
 *
 * 在开发环境中，MSW 会拦截网络请求并返回 mock 数据
 * 现有的 mock 模块格式保持不变，由 handlers.ts 自动转换为 MSW 格式
 */

export { setupMock } from './browser'
export { handlers } from './handlers'

// 导出类型定义
export type {
  MockConfig,
  MockRequest,
  MockRequestOptions,
  ApiResponse,
  PageResponse
} from './types'
