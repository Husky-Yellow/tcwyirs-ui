import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { setCssVar, humpToUnderline } from '@/utils'
import { ElMessage } from 'element-plus'

// Mock dependencies
vi.mock('@/hooks/web/useCache', () => ({
  useCache: vi.fn(() => ({
    wsCache: {
      get: vi.fn(),
      set: vi.fn()
    }
  })),
  CACHE_KEY: {
    LAYOUT: 'layout',
    IS_DARK: 'isDark',
    THEME: 'theme'
  }
}))

vi.mock('@/utils', () => ({
  setCssVar: vi.fn(),
  humpToUnderline: vi.fn((str) => str.replace(/([A-Z])/g, '-$1').toLowerCase())
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    warning: vi.fn()
  }
}))

describe('store/modules/app', () => {
  let appStore: ReturnType<typeof useAppStore>
  let mockWsCache: any

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())

    // Mock wsCache
    mockWsCache = {
      get: vi.fn((key) => {
        const cache: Record<string, any> = {
          layout: 'classic',
          isDark: false,
          theme: {
            elColorPrimary: '#409eff'
          },
          fixedMenu: false,
          currentSize: 'default'
        }
        return cache[key]
      }),
      set: vi.fn()
    }

    // Mock useCache to return our mock
    vi.mocked(useCache).mockReturnValue({ wsCache: mockWsCache })

    // Mock document methods
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: {
          add: vi.fn(),
          remove: vi.fn()
        }
      },
      writable: true
    })

    appStore = useAppStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(appStore.breadcrumb).toBe(true)
      expect(appStore.collapse).toBe(false)
      expect(appStore.layout).toBe('classic')
      expect(appStore.isDark).toBe(false)
      expect(appStore.currentSize).toBe('default')
      expect(appStore.mobile).toBe(false)
      expect(appStore.title).toBeDefined()
    })
  })

  describe('getters', () => {
    it('should return correct getter values', () => {
      expect(appStore.getBreadcrumb()).toBe(true)
      expect(appStore.getCollapse()).toBe(false)
      expect(appStore.getLayout()).toBe('classic')
      expect(appStore.getIsDark()).toBe(false)
      expect(appStore.getCurrentSize()).toBe('default')
      expect(appStore.getMobile()).toBe(false)
    })
  })

  describe('setBreadcrumb', () => {
    it('should set breadcrumb value', () => {
      appStore.setBreadcrumb(false)
      expect(appStore.breadcrumb).toBe(false)
    })
  })

  describe('setCollapse', () => {
    it('should set collapse value', () => {
      appStore.setCollapse(true)
      expect(appStore.collapse).toBe(true)
    })
  })

  describe('setLayout', () => {
    it('should set layout and cache it', () => {
      appStore.setLayout('top')
      expect(appStore.layout).toBe('top')
      expect(mockWsCache.set).toHaveBeenCalledWith(CACHE_KEY.LAYOUT, 'top')
    })

    it('should show warning when trying to change layout on mobile', () => {
      appStore.mobile = true
      appStore.setLayout('top')
      expect(ElMessage.warning).toHaveBeenCalledWith('移动端模式下不支持切换其他布局')
      expect(appStore.layout).toBe('classic') // Should remain unchanged
    })
  })

  describe('setIsDark', () => {
    it('should set dark mode and update DOM classes', () => {
      appStore.setIsDark(true)
      expect(appStore.isDark).toBe(true)
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light')
      expect(mockWsCache.set).toHaveBeenCalledWith(CACHE_KEY.IS_DARK, true)
    })

    it('should set light mode and update DOM classes', () => {
      appStore.setIsDark(false)
      expect(appStore.isDark).toBe(false)
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('light')
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark')
      expect(mockWsCache.set).toHaveBeenCalledWith(CACHE_KEY.IS_DARK, false)
    })
  })

  describe('setCurrentSize', () => {
    it('should set current size and cache it', () => {
      appStore.setCurrentSize('large')
      expect(appStore.currentSize).toBe('large')
      expect(mockWsCache.set).toHaveBeenCalledWith('currentSize', 'large')
    })
  })

  describe('setMobile', () => {
    it('should set mobile value', () => {
      appStore.setMobile(true)
      expect(appStore.mobile).toBe(true)
    })
  })

  describe('setTheme', () => {
    it('should merge theme and cache it', () => {
      const newTheme = {
        elColorPrimary: '#ff0000',
        leftMenuBgColor: '#000000'
      }

      appStore.setTheme(newTheme)

      expect(appStore.theme.elColorPrimary).toBe('#ff0000')
      expect(appStore.theme.leftMenuBgColor).toBe('#000000')
      expect(mockWsCache.set).toHaveBeenCalledWith(CACHE_KEY.THEME, appStore.theme)
    })
  })

  describe('setCssVarTheme', () => {
    it('should set CSS variables for theme', () => {
      appStore.theme = {
        elColorPrimary: '#ff0000',
        leftMenuBgColor: '#000000'
      }

      appStore.setCssVarTheme()

      expect(setCssVar).toHaveBeenCalledWith('--el-color-primary', '#ff0000')
      expect(setCssVar).toHaveBeenCalledWith('--left-menu-bg-color', '#000000')
    })
  })

  describe('setFixedMenu', () => {
    it('should set fixed menu and cache it', () => {
      appStore.setFixedMenu(true)
      expect(appStore.fixedMenu).toBe(true)
      expect(mockWsCache.set).toHaveBeenCalledWith('fixedMenu', true)
    })
  })

  describe('setPageLoading', () => {
    it('should set page loading state', () => {
      appStore.setPageLoading(true)
      expect(appStore.pageLoading).toBe(true)
    })
  })

  describe('setTitle', () => {
    it('should set title', () => {
      appStore.setTitle('New Title')
      expect(appStore.title).toBe('New Title')
    })
  })

  describe('setFooter', () => {
    it('should set footer visibility', () => {
      appStore.setFooter(true)
      expect(appStore.footer).toBe(true)
    })
  })

  describe('various setter methods', () => {
    it('should set breadcrumb icon', () => {
      appStore.setBreadcrumbIcon(false)
      expect(appStore.breadcrumbIcon).toBe(false)
    })

    it('should set unique opened', () => {
      appStore.setUniqueOpened(false)
      expect(appStore.uniqueOpened).toBe(false)
    })

    it('should set hamburger', () => {
      appStore.setHamburger(false)
      expect(appStore.hamburger).toBe(false)
    })

    it('should set screenfull', () => {
      appStore.setScreenfull(false)
      expect(appStore.screenfull).toBe(false)
    })

    it('should set size', () => {
      appStore.setSize(false)
      expect(appStore.size).toBe(false)
    })

    it('should set locale', () => {
      appStore.setLocale(false)
      expect(appStore.locale).toBe(false)
    })

    it('should set message', () => {
      appStore.setMessage(false)
      expect(appStore.message).toBe(false)
    })

    it('should set tags view', () => {
      appStore.setTagsView(false)
      expect(appStore.tagsView).toBe(false)
    })

    it('should set tags view immerse', () => {
      appStore.setTagsViewImmerse(true)
      expect(appStore.tagsViewImmerse).toBe(true)
    })

    it('should set tags view icon', () => {
      appStore.setTagsViewIcon(false)
      expect(appStore.tagsViewIcon).toBe(false)
    })

    it('should set logo', () => {
      appStore.setLogo(false)
      expect(appStore.logo).toBe(false)
    })

    it('should set fixed header', () => {
      appStore.setFixedHeader(false)
      expect(appStore.fixedHeader).toBe(false)
    })

    it('should set grey mode', () => {
      appStore.setGreyMode(true)
      expect(appStore.greyMode).toBe(true)
    })
  })
})
