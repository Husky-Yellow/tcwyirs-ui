import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLocale } from '@/hooks/web/useLocale'
import { useLocaleStoreWithOut } from '@/store/modules/locale'
import { i18n } from '@/plugins/vueI18n'
import { setHtmlPageLang } from '@/plugins/vueI18n/helper'

// Mock dependencies
vi.mock('@/store/modules/locale', () => ({
  useLocaleStoreWithOut: vi.fn()
}))

vi.mock('@/plugins/vueI18n', () => ({
  i18n: {
    mode: 'legacy',
    global: {
      locale: 'zh-CN',
      setLocaleMessage: vi.fn()
    }
  }
}))

vi.mock('@/plugins/vueI18n/helper', () => ({
  setHtmlPageLang: vi.fn()
}))

describe('hooks/web/useLocale', () => {
  let mockLocaleStore: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock locale store
    mockLocaleStore = {
      setCurrentLocale: vi.fn()
    }

    vi.mocked(useLocaleStoreWithOut).mockReturnValue(mockLocaleStore)
  })

  describe('useLocale', () => {
    it('should return changeLocale function', () => {
      const { changeLocale } = useLocale()

      expect(typeof changeLocale).toBe('function')
    })
  })

  describe('changeLocale', () => {
    it('should change locale to zh-CN', async () => {
      // Mock dynamic import
      const mockZhCN = { default: { common: { ok: '确定' } } }
      vi.doMock('../../locales/zh-CN.ts', () => mockZhCN)

      const { changeLocale } = useLocale()

      await changeLocale('zh-CN')

      expect(i18n.global.setLocaleMessage).toHaveBeenCalledWith('zh-CN', mockZhCN.default)
      expect(mockLocaleStore.setCurrentLocale).toHaveBeenCalledWith({
        lang: 'zh-CN'
      })
      expect(setHtmlPageLang).toHaveBeenCalledWith('zh-CN')
    })

    it('should change locale to en', async () => {
      // Mock dynamic import
      const mockEn = { default: { common: { ok: 'OK' } } }
      vi.doMock('../../locales/en.ts', () => mockEn)

      const { changeLocale } = useLocale()

      await changeLocale('en')

      expect(i18n.global.setLocaleMessage).toHaveBeenCalledWith('en', mockEn.default)
      expect(mockLocaleStore.setCurrentLocale).toHaveBeenCalledWith({
        lang: 'en'
      })
      expect(setHtmlPageLang).toHaveBeenCalledWith('en')
    })

    it('should handle legacy i18n mode', async () => {
      // Mock legacy mode
      vi.mocked(i18n).mode = 'legacy'
      vi.mocked(i18n.global).locale = 'zh-CN'

      const mockZhCN = { default: { common: { ok: '确定' } } }
      vi.doMock('../../locales/zh-CN.ts', () => mockZhCN)

      const { changeLocale } = useLocale()

      await changeLocale('zh-CN')

      expect(i18n.global.setLocaleMessage).toHaveBeenCalledWith('zh-CN', mockZhCN.default)
      expect(mockLocaleStore.setCurrentLocale).toHaveBeenCalledWith({
        lang: 'zh-CN'
      })
    })

    it('should handle composition i18n mode', async () => {
      // Mock composition mode
      vi.mocked(i18n).mode = 'composition'
      const mockLocale = { value: 'zh-CN' }
      vi.mocked(i18n.global).locale = mockLocale

      const mockZhCN = { default: { common: { ok: '确定' } } }
      vi.doMock('../../locales/zh-CN.ts', () => mockZhCN)

      const { changeLocale } = useLocale()

      await changeLocale('zh-CN')

      expect(mockLocale.value).toBe('zh-CN')
      expect(i18n.global.setLocaleMessage).toHaveBeenCalledWith('zh-CN', mockZhCN.default)
      expect(mockLocaleStore.setCurrentLocale).toHaveBeenCalledWith({
        lang: 'zh-CN'
      })
    })

    it('should handle import error gracefully', async () => {
      // Mock import error
      vi.doMock('../../locales/invalid.ts', () => {
        throw new Error('Import failed')
      })

      const { changeLocale } = useLocale()

      await expect(changeLocale('invalid')).rejects.toThrow('Import failed')
    })
  })
})
