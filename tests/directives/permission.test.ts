import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createApp } from 'vue'
import { hasPermi, hasPermission } from '@/directives/permission/hasPermi'
import { useUserStore } from '@/store/modules/user'

// Mock dependencies
vi.mock('@/store/modules/user', () => ({
  useUserStore: vi.fn()
}))

describe('directives/permission', () => {
  let mockUserStore: any
  let app: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock user store
    mockUserStore = {
      permissions: new Set(['user:read', 'user:write'])
    }

    vi.mocked(useUserStore).mockReturnValue(mockUserStore)

    // Create test app
    app = createApp({})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('hasPermission', () => {
    it('should return true for super admin permission', () => {
      mockUserStore.permissions = new Set(['*:*:*'])

      const result = hasPermission(['user:read'])

      expect(result).toBe(true)
    })

    it('should return true when user has required permission', () => {
      mockUserStore.permissions = new Set(['user:read', 'user:write'])

      const result = hasPermission(['user:read'])

      expect(result).toBe(true)
    })

    it('should return true when user has any of the required permissions', () => {
      mockUserStore.permissions = new Set(['user:write'])

      const result = hasPermission(['user:read', 'user:write'])

      expect(result).toBe(true)
    })

    it('should return false when user does not have required permission', () => {
      mockUserStore.permissions = new Set(['user:write'])

      const result = hasPermission(['user:read'])

      expect(result).toBe(false)
    })

    it('should return false when user has no permissions', () => {
      mockUserStore.permissions = new Set()

      const result = hasPermission(['user:read'])

      expect(result).toBe(false)
    })

    it('should handle empty permission array', () => {
      mockUserStore.permissions = new Set(['user:read'])

      const result = hasPermission([])

      expect(result).toBe(false)
    })
  })

  describe('hasPermi directive', () => {
    it('should register directive correctly', () => {
      const directiveSpy = vi.fn()
      app.directive = directiveSpy

      hasPermi(app)

      expect(directiveSpy).toHaveBeenCalledWith('hasPermi', expect.any(Function))
    })

    it('should remove element when user lacks permission', () => {
      mockUserStore.permissions = new Set(['user:write'])

      const mockElement = {
        parentNode: {
          removeChild: vi.fn()
        }
      }

      const binding = {
        value: ['user:read']
      }

      // Get the directive function
      let directiveFunction: any
      app.directive = vi.fn((name, fn) => {
        if (name === 'hasPermi') {
          directiveFunction = fn
        }
      })

      hasPermi(app)

      // Call the directive function
      directiveFunction(mockElement, binding)

      expect(mockElement.parentNode.removeChild).toHaveBeenCalledWith(mockElement)
    })

    it('should keep element when user has permission', () => {
      mockUserStore.permissions = new Set(['user:read'])

      const mockElement = {
        parentNode: {
          removeChild: vi.fn()
        }
      }

      const binding = {
        value: ['user:read']
      }

      // Get the directive function
      let directiveFunction: any
      app.directive = vi.fn((name, fn) => {
        if (name === 'hasPermi') {
          directiveFunction = fn
        }
      })

      hasPermi(app)

      // Call the directive function
      directiveFunction(mockElement, binding)

      expect(mockElement.parentNode.removeChild).not.toHaveBeenCalled()
    })

    it('should throw error for empty permission array', () => {
      const mockElement = {}
      const binding = {
        value: []
      }

      // Get the directive function
      let directiveFunction: any
      app.directive = vi.fn((name, fn) => {
        if (name === 'hasPermi') {
          directiveFunction = fn
        }
      })

      hasPermi(app)

      // Call the directive function
      expect(() => directiveFunction(mockElement, binding)).toThrow('请设置操作权限标签值')
    })

    it('should throw error for null permission value', () => {
      const mockElement = {}
      const binding = {
        value: null
      }

      // Get the directive function
      let directiveFunction: any
      app.directive = vi.fn((name, fn) => {
        if (name === 'hasPermi') {
          directiveFunction = fn
        }
      })

      hasPermi(app)

      // Call the directive function
      expect(() => directiveFunction(mockElement, binding)).toThrow('请设置操作权限标签值')
    })

    it('should throw error for undefined permission value', () => {
      const mockElement = {}
      const binding = {
        value: undefined
      }

      // Get the directive function
      let directiveFunction: any
      app.directive = vi.fn((name, fn) => {
        if (name === 'hasPermi') {
          directiveFunction = fn
        }
      })

      hasPermi(app)

      // Call the directive function
      expect(() => directiveFunction(mockElement, binding)).toThrow('请设置操作权限标签值')
    })

    it('should handle element without parentNode', () => {
      mockUserStore.permissions = new Set(['user:write'])

      const mockElement = {
        parentNode: null
      }

      const binding = {
        value: ['user:read']
      }

      // Get the directive function
      let directiveFunction: any
      app.directive = vi.fn((name, fn) => {
        if (name === 'hasPermi') {
          directiveFunction = fn
        }
      })

      hasPermi(app)

      // Call the directive function - should not throw error
      expect(() => directiveFunction(mockElement, binding)).not.toThrow()
    })
  })
})

