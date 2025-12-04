// 寮曞叆unocss css
import '@/plugins/unocss'

// 瀵煎叆鍏ㄥ眬鐨剆vg鍥炬爣
import '@/plugins/svgIcon'

// 寮曞叆鐘舵€佺鐞?
import { setupStore } from '@/store'

// 鍏ㄥ眬缁勪欢
import { setupGlobCom } from '@/components'

// 寮曞叆 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 寮曞叆 form-create
import { setupFormCreate } from '@/plugins/formCreate'

// 寮曞叆鍏ㄥ眬鏍峰紡
import '@/styles/index.scss'

// 寮曞叆鍔ㄧ敾
import '@/plugins/animate.css'

// 璺敱
import router, { setupRouter } from '@/router'

// 鎸囦护
import { setupAuth, setupMountedFocus } from '@/directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'

import VueDOMPurifyHTML from 'vue-dompurify-html' // 瑙ｅ喅v-html 鐨勫畨鍏ㄩ殣鎮?

// 鍒涘缓瀹炰緥
const setupAll = async () => {
  // 寮€鍙戠幆澧冨惎鍔?MSW Mock 鏈嶅姟
  if (import.meta.env.DEV) {
    const { setupMock } = await import('./mock')
    await setupMock()
  }

  const app = createApp(App)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupFormCreate(app)

  setupRouter(app)

  // directives 鎸囦护
  setupAuth(app)
  setupMountedFocus(app)

  await router.isReady()

  app.use(VueDOMPurifyHTML)

  app.mount('#app')
}

setupAll()


