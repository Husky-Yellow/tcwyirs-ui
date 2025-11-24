import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

/**
 * 启动 MSW Mock 服务
 */
export async function setupMock() {
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'bypass', // 未匹配的请求直接放行
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    })
    console.log('[MSW] Mock Service Worker started')
  }
}
