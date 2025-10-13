import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkPermi, checkRole } from '@/utils/permission'
import { hasPermission } from '@/directives/permission/hasPermi'
import { useCache, CACHE_KEY } from '@/hooks/web/useCache'

// Mock dependencies
vi.mock('@/directives/permission/hasPermi', () => ({
  hasPermission: vi.fn()
}))

vi.mock('@/hooks/web/useCache', () => ({
  useCache: vi.fn(() => ({
    wsCache: {
      get: vi.fn()
    }
  })),
  CACHE_KEY: {
    USER: 'user'
  }
}))

describe('utils/permission', () => {
  let mockWsCache: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock wsCache
    mockWsCache = {
      get: vi.fn()
    }

    vi.mocked(useCache).mockReturnValue({ wsCache: mockWsCache })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('checkPermi', () => {
    it('should call hasPermission with correct permissions', () => {
      const permissions = ['user:read', 'user:write']

      checkPermi(permissions)

      expect(hasPermission).toHaveBeenCalledWith(permissions)
    })

    it('should return result from hasPermission', () => {
      const permissions = ['user:read']
      vi.mocked(hasPermission).mockReturnValue(true)

      const result = checkPermi(permissions)

      expect(result).toBe(true)
    })

    it('should handle empty permissions array', () => {
      const permissions: string[] = []
      vi.mocked(hasPermission).mockReturnValue(false)

      const result = checkPermi(permissions)

      expect(result).toBe(false)
    })
  })

  describe('checkRole', () => {
    it('should return true for super_admin role', () => {
      const userInfo = {
        roles: ['super_admin', 'user']
      }
      mockWsCache.get.mockReturnValue(userInfo)

      const result = checkRole(['admin'])

      expect(result).toBe(true)
    })

    it('should return true when user has required role', () => {
      const userInfo = {
        roles: ['admin', 'user']
      }
      mockWsCache.get.mockReturnValue(userInfo)

      const result = checkRole(['admin'])

      expect(result).toBe(true)
    })

    it('should return false when user does not have required role', () => {
      const userInfo = {
        roles: ['user']
      }
      mockWsCache.get.mockReturnValue(userInfo)

      const result = checkRole(['admin'])

      expect(result).toBe(false)
    })

    it('should return false when user has no roles', () => {
      const userInfo = {
        roles: []
      }
      mockWsCache.get.mockReturnValue(userInfo)

      const result = checkRole(['admin'])

      expect(result).toBe(false)
    })

    it('should return false when userInfo is null', () => {
      mockWsCache.get.mockReturnValue(null)

      const result = checkRole(['admin'])

      expect(result).toBe(false)
    })

    it('should return false when userInfo is undefined', () => {
      mockWsCache.get.mockReturnValue(undefined)

      const result = checkRole(['admin'])

      expect(result).toBe(false)
    })

    it('should handle multiple required roles', () => {
      const userInfo = {
        roles: ['user', 'editor']
      }
      mockWsCache.get.mockReturnValue(userInfo)

      const result = checkRole(['admin', 'editor'])

      expect(result).toBe(true)
    })

    it('should return false and log error for empty roles array', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = checkRole([])

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('请设置角色权限标签值')

      consoleSpy.mockRestore()
    })

    it('should return false and log error for null roles', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = checkRole(null as any)

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('请设置角色权限标签值')

      consoleSpy.mockRestore()
    })

    it('should return false and log error for undefined roles', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = checkRole(undefined as any)

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('请设置角色权限标签值')

      consoleSpy.mockRestore()
    })

    it('should handle case-sensitive role matching', () => {
      const userInfo = {
        roles: ['Admin'] // Different case
      }
      mockWsCache.get.mockReturnValue(userInfo)

      const result = checkRole(['admin'])

      expect(result).toBe(false)
    })
  })
})

