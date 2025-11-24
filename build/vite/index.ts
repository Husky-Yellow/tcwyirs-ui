import { resolve } from 'path'
import type { PluginOption } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import progress from 'vite-plugin-progress'
import checker from 'vite-plugin-checker'
import PurgeIcons from 'vite-plugin-purge-icons'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import topLevelAwait from 'vite-plugin-top-level-await'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng'
import UnoCSS from 'unocss/vite'

/**
 * 创建 Vite 插件配置
 * @param isBuild 是否为生产构建
 * @returns Vite 插件数组
 */
export function createVitePlugins(isBuild = false): PluginOption[] {
  const root = process.cwd()

  // 路径查找
  function pathResolve(dir: string) {
    return resolve(root, '.', dir)
  }

  const plugins: PluginOption[] = [
    // Vue 核心插件
    Vue(),
    VueJsx(),

    // UnoCSS 原子化 CSS
    UnoCSS(),

    // 构建进度显示
    progress(),

    // 图标按需加载
    PurgeIcons(),

    // Element Plus 按需引入样式
    ElementPlus({}),

    // 自动导入 API
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
        /\.md$/
      ],
      imports: [
        'vue',
        'vue-router',
        {
          '@/hooks/web/useMessage': ['useMessage'],
          '@/hooks/web/useTable': ['useTable'],
          '@/hooks/web/useCrudSchemas': ['useCrudSchemas'],
          '@/utils/formRules': ['required'],
          '@/utils/dict': ['DICT_TYPE']
        }
      ],
      dts: 'src/types/auto-imports.d.ts',
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: false,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),

    // 自动导入组件
    Components({
      dts: 'src/types/auto-components.d.ts',
      resolvers: [ElementPlusResolver()],
      globs: [
        'src/components/**/**.{vue,tsx}',
        '!src/components/**/README.md',
        '!src/components/DiyEditor/components/mobile/**'
      ]
    }),

    // SVG 图标插件
    createSvgIconsPlugin({
      iconDirs: [pathResolve('src/assets/svgs')],
      symbolId: 'icon-[dir]-[name]'
    }),

    // EJS 模板支持
    ViteEjsPlugin(),

    // Top-level await 支持
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: (i) => `__tla_${i}`
    })
  ]

  // 开发环境插件
  if (!isBuild) {
    plugins.push(
      // TypeScript 检查 (仅开发环境)
      // 注意: ESLint 和 vueTsc 检查禁用，因为 vite-plugin-checker 0.6.x 不兼容 ESLint 9 和 vue-tsc 2.x
      // 请使用 pnpm lint:eslint 手动运行 ESLint
      checker({
        typescript: true,
        overlay: {
          initialIsOpen: false
        }
      })
      // MSW mock 在 main.ts 中通过 setupMock() 初始化
    )
  }

  // 生产环境插件
  if (isBuild) {
    plugins.push(
      // Gzip 压缩 (仅生产环境)
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: false
      })
    )
  }

  return plugins
}
