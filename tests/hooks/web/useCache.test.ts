import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCache, deleteUserCache, CACHE_KEY } from '@/hooks/web/useCache'

// Mock WebStorageCache
const mockWebStorageCache = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn()
}

vi.mock('web-storage-cache', () => ({
  default: vi.fn(() => mockWebStorageCache)
}))

describe('hooks/web/useCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCache', () => {
    it('should return wsCache instance with localStorage by default', () => {
      const { wsCache } = useCache()

      expect(wsCache).toBe(mockWebStorageCache)
    })

    it('should return wsCache instance with sessionStorage when specified', () => {
      const { wsCache } = useCache('sessionStorage')

      expect(wsCache).toBe(mockWebStorageCache)
    })

    it('should return wsCache instance with localStorage when specified', () => {
      const { wsCache } = useCache('localStorage')

      expect(wsCache).toBe(mockWebStorageCache)
    })
  })

  describe('CACHE_KEY', () => {
    it('should have correct cache keys', () => {
      expect(CACHE_KEY.ROLE_ROUTERS).toBe('roleRouters')
      expect(CACHE_KEY.USER).toBe('user')
      expect(CACHE_KEY.VisitTenantId).toBe('visitTenantId')
      expect(CACHE_KEY.IS_DARK).toBe('isDark')
      expect(CACHE_KEY.LANG).toBe('lang')
      expect(CACHE_KEY.THEME).toBe('theme')
      expect(CACHE_KEY.LAYOUT).toBe('layout')
      expect(CACHE_KEY.DICT_CACHE).toBe('dictCache')
      expect(CACHE_KEY.LoginForm).toBe('loginForm')
      expect(CACHE_KEY.TenantId).toBe('tenantId')
    })
  })

  describe('deleteUserCache', () => {
    it('should delete user-related cache', () => {
      deleteUserCache()

      expect(mockWebStorageCache.delete).toHaveBeenCalledWith(CACHE_KEY.USER)
      expect(mockWebStorageCache.delete).toHaveBeenCalledWith(CACHE_KEY.ROLE_ROUTERS)
      expect(mockWebStorageCache.delete).toHaveBeenCalledWith(CACHE_KEY.VisitTenantId)
    })

    it('should not delete login form cache', () => {
      deleteUserCache()

      expect(mockWebStorageCache.delete).not.toHaveBeenCalledWith(CACHE_KEY.LoginForm)
    })
  })
})
