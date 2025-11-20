import { resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import { createVitePlugins } from './build/vite'
import { exclude, include } from './build/vite/optimize'

// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()

// 路径查找
function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

/**
 * 环境变量类型转换辅助函数
 */
function wrapperEnv(envConf: Record<string, string>) {
  const ret: Record<string, any> = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName

    // 转换端口号为数字
    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }

    ret[envName] = realName
  }

  return ret
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build'

  // 统一加载环境变量
  const envConfig = loadEnv(mode, root)
  const viteEnv = wrapperEnv(envConfig)

  const {
    VITE_PORT,
    VITE_OPEN,
    VITE_BASE_PATH,
    VITE_OUT_DIR,
    VITE_DROP_DEBUGGER,
    VITE_DROP_CONSOLE,
    VITE_SOURCEMAP
  } = viteEnv

  return {
    base: VITE_BASE_PATH,

    server: {
      port: VITE_PORT,
      host: '0.0.0.0',
      open: VITE_OPEN,
      strictPort: false,
      cors: true,
      hmr: {
        overlay: true
      }
    },

    preview: {
      port: 4173,
      host: '0.0.0.0',
      strictPort: false,
      cors: true
    },

    plugins: createVitePlugins(isBuild),

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variables.scss" as *;',
          javascriptEnabled: true,
          silenceDeprecations: ['legacy-js-api']
        }
      },
      devSourcemap: !isBuild
    },

    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        },
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        }
      ]
    },

    build: {
      target: 'es2015',
      outDir: VITE_OUT_DIR || 'dist',
      assetsDir: 'assets',
      minify: 'esbuild',
      sourcemap: VITE_SOURCEMAP,
      chunkSizeWarningLimit: 2000,
      cssCodeSplit: true,
      esbuildOptions: {
        drop: [
          ...(VITE_DROP_CONSOLE ? ['console'] : []),
          ...(VITE_DROP_DEBUGGER ? ['debugger'] : [])
        ]
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            echarts: ['echarts', 'echarts-wordcloud'],
            'form-create': ['@form-create/element-ui'],
            'form-designer': ['@form-create/designer'],
            editor: ['@wangeditor/editor', '@wangeditor/editor-for-vue'],
            utils: ['axios', 'dayjs', 'crypto-js', 'es-toolkit', 'qs'],
            bpmn: ['bpmn-js', 'bpmn-js-properties-panel', 'diagram-js', 'camunda-bpmn-moddle']
          }
        }
      }
    },

    optimizeDeps: {
      include,
      exclude,
      force: false
    },

    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    },

    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'console.debug'] : [],
      drop: VITE_DROP_DEBUGGER ? ['debugger'] : []
    }
  }
}
