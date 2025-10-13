import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getAccessToken,
  getRefreshToken,
  setToken,
  removeToken,
  formatToken,
  getLoginForm,
  setLoginForm,
  removeLoginForm,
  getTenantId,
  setTenantId,
  getVisitTenantId,
  setVisitTenantId,
  type LoginFormType
} from '@/utils/auth'

// Mock the cache module
vi.mock('@/hooks/web/useCache', () => ({
  useCache: () => ({
    wsCache: {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn()
    }
  }),
  CACHE_KEY: {
    LoginForm: 'LOGIN_FORM',
    TenantId: 'TENANT_ID',
    VisitTenantId: 'VISIT_TENANT_ID'
  }
}))

// Mock the jsencrypt module
vi.mock('@/utils/jsencrypt', () => ({
  decrypt: vi.fn((value) => `decrypted_${value}`),
  encrypt: vi.fn((value) => `encrypted_${value}`)
}))

describe('utils/auth', () => {
  let mockWsCache: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock wsCache
    mockWsCache = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn()
    }

    // Mock the useCache hook to return our mock
    vi.doMock('@/hooks/web/useCache', () => ({
      useCache: () => ({ wsCache: mockWsCache }),
      CACHE_KEY: {
        LoginForm: 'LOGIN_FORM',
        TenantId: 'TENANT_ID',
        VisitTenantId: 'VISIT_TENANT_ID'
      }
    }))
  })

  describe('getAccessToken', () => {
    it('should return access token from cache', () => {
      mockWsCache.get.mockReturnValue('test-access-token')

      const result = getAccessToken()

      expect(mockWsCache.get).toHaveBeenCalledWith('ACCESS_TOKEN')
      expect(result).toBe('test-access-token')
    })

    it('should return fallback token when primary token is not found', () => {
      mockWsCache.get
        .mockReturnValueOnce(null) // First call for ACCESS_TOKEN
        .mockReturnValueOnce('fallback-token') // Second call for 'ACCESS_TOKEN'

      const result = getAccessToken()

      expect(mockWsCache.get).toHaveBeenCalledTimes(2)
      expect(result).toBe('fallback-token')
    })
  })

  describe('getRefreshToken', () => {
    it('should return refresh token from cache', () => {
      mockWsCache.get.mockReturnValue('test-refresh-token')

      const result = getRefreshToken()

      expect(mockWsCache.get).toHaveBeenCalledWith('REFRESH_TOKEN')
      expect(result).toBe('test-refresh-token')
    })
  })

  describe('setToken', () => {
    it('should set both access and refresh tokens', () => {
      const token = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      }

      setToken(token)

      expect(mockWsCache.set).toHaveBeenCalledWith('REFRESH_TOKEN', 'new-refresh-token')
      expect(mockWsCache.set).toHaveBeenCalledWith('ACCESS_TOKEN', 'new-access-token')
    })
  })

  describe('removeToken', () => {
    it('should remove both access and refresh tokens', () => {
      removeToken()

      expect(mockWsCache.delete).toHaveBeenCalledWith('ACCESS_TOKEN')
      expect(mockWsCache.delete).toHaveBeenCalledWith('REFRESH_TOKEN')
    })
  })

  describe('formatToken', () => {
    it('should format token with Bearer prefix', () => {
      const result = formatToken('test-token')
      expect(result).toBe('Bearer test-token')
    })
  })

  describe('getLoginForm', () => {
    it('should return decrypted login form', () => {
      const mockLoginForm: LoginFormType = {
        tenantName: 'test-tenant',
        username: 'test-user',
        password: 'encrypted_password',
        rememberMe: true
      }

      mockWsCache.get.mockReturnValue(mockLoginForm)

      const result = getLoginForm()

      expect(mockWsCache.get).toHaveBeenCalledWith('LOGIN_FORM')
      expect(result).toEqual({
        ...mockLoginForm,
        password: 'decrypted_encrypted_password'
      })
    })

    it('should return undefined when no login form is cached', () => {
      mockWsCache.get.mockReturnValue(null)

      const result = getLoginForm()

      expect(result).toBeUndefined()
    })
  })

  describe('setLoginForm', () => {
    it('should encrypt password and set login form', () => {
      const loginForm: LoginFormType = {
        tenantName: 'test-tenant',
        username: 'test-user',
        password: 'plain_password',
        rememberMe: true
      }

      setLoginForm(loginForm)

      expect(mockWsCache.set).toHaveBeenCalledWith(
        'LOGIN_FORM',
        {
          ...loginForm,
          password: 'encrypted_plain_password'
        },
        { exp: 30 * 24 * 60 * 60 }
      )
    })
  })

  describe('removeLoginForm', () => {
    it('should remove login form from cache', () => {
      removeLoginForm()

      expect(mockWsCache.delete).toHaveBeenCalledWith('LOGIN_FORM')
    })
  })

  describe('getTenantId', () => {
    it('should return tenant ID from cache', () => {
      mockWsCache.get.mockReturnValue(123)

      const result = getTenantId()

      expect(mockWsCache.get).toHaveBeenCalledWith('TENANT_ID')
      expect(result).toBe(123)
    })
  })

  describe('setTenantId', () => {
    it('should set tenant ID in cache', () => {
      setTenantId(456)

      expect(mockWsCache.set).toHaveBeenCalledWith('TENANT_ID', 456)
    })
  })

  describe('getVisitTenantId', () => {
    it('should return visit tenant ID from cache', () => {
      mockWsCache.get.mockReturnValue(789)

      const result = getVisitTenantId()

      expect(mockWsCache.get).toHaveBeenCalledWith('VISIT_TENANT_ID')
      expect(result).toBe(789)
    })
  })

  describe('setVisitTenantId', () => {
    it('should set visit tenant ID in cache', () => {
      setVisitTenantId(101112)

      expect(mockWsCache.set).toHaveBeenCalledWith('VISIT_TENANT_ID', 101112)
    })
  })
})
