import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { getAccessToken, removeToken } from '@/utils/auth'
import { getInfo, loginOut } from '@/api/login'
import { CACHE_KEY, useCache, deleteUserCache } from '@/hooks/web/useCache'

// Mock dependencies
vi.mock('@/utils/auth', () => ({
  getAccessToken: vi.fn(),
  removeToken: vi.fn()
}))

vi.mock('@/api/login', () => ({
  getInfo: vi.fn(),
  loginOut: vi.fn()
}))

vi.mock('@/hooks/web/useCache', () => ({
  useCache: vi.fn(() => ({
    wsCache: {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn()
    }
  })),
  deleteUserCache: vi.fn(),
  CACHE_KEY: {
    USER: 'user',
    ROLE_ROUTERS: 'roleRouters'
  }
}))

describe('store/modules/user', () => {
  let userStore: ReturnType<typeof useUserStore>
  let mockWsCache: any

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())

    // Mock wsCache
    mockWsCache = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn()
    }

    // Mock useCache to return our mock
    vi.mocked(useCache).mockReturnValue({ wsCache: mockWsCache })

    userStore = useUserStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(userStore.permissions).toEqual(new Set<string>())
      expect(userStore.roles).toEqual([])
      expect(userStore.isSetUser).toBe(false)
      expect(userStore.user).toEqual({
        id: 0,
        avatar: '',
        nickname: '',
        deptId: 0
      })
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      // Set up some test data
      userStore.permissions = new Set(['user:read', 'user:write'])
      userStore.roles = ['admin', 'user']
      userStore.isSetUser = true
      userStore.user = {
        id: 1,
        avatar: 'avatar.jpg',
        nickname: 'Test User',
        deptId: 1
      }
    })

    it('should return permissions', () => {
      expect(userStore.getPermissions).toEqual(new Set(['user:read', 'user:write']))
    })

    it('should return roles', () => {
      expect(userStore.getRoles).toEqual(['admin', 'user'])
    })

    it('should return isSetUser status', () => {
      expect(userStore.getIsSetUser).toBe(true)
    })

    it('should return user info', () => {
      expect(userStore.getUser).toEqual({
        id: 1,
        avatar: 'avatar.jpg',
        nickname: 'Test User',
        deptId: 1
      })
    })
  })

  describe('setUserInfoAction', () => {
    it('should reset state when no access token', async () => {
      vi.mocked(getAccessToken).mockReturnValue(null)

      await userStore.setUserInfoAction()

      expect(userStore.permissions).toEqual(new Set<string>())
      expect(userStore.roles).toEqual([])
      expect(userStore.isSetUser).toBe(false)
    })

    it('should set user info from API when no cache', async () => {
      const mockUserInfo = {
        permissions: ['user:read', 'user:write'],
        roles: ['admin'],
        user: {
          id: 1,
          avatar: 'avatar.jpg',
          nickname: 'Test User',
          deptId: 1
        },
        menus: []
      }

      vi.mocked(getAccessToken).mockReturnValue('test-token')
      vi.mocked(getInfo).mockResolvedValue(mockUserInfo)
      mockWsCache.get.mockReturnValue(null)

      await userStore.setUserInfoAction()

      expect(userStore.permissions).toEqual(new Set(['user:read', 'user:write']))
      expect(userStore.roles).toEqual(['admin'])
      expect(userStore.user).toEqual(mockUserInfo.user)
      expect(userStore.isSetUser).toBe(true)
      expect(mockWsCache.set).toHaveBeenCalledWith(CACHE_KEY.USER, mockUserInfo)
      expect(mockWsCache.set).toHaveBeenCalledWith(CACHE_KEY.ROLE_ROUTERS, mockUserInfo.menus)
    })

    it('should set user info from cache when available', async () => {
      const mockUserInfo = {
        permissions: ['user:read'],
        roles: ['user'],
        user: {
          id: 2,
          avatar: 'cached-avatar.jpg',
          nickname: 'Cached User',
          deptId: 2
        },
        menus: []
      }

      vi.mocked(getAccessToken).mockReturnValue('test-token')
      mockWsCache.get.mockReturnValue(mockUserInfo)
      vi.mocked(getInfo).mockResolvedValue(mockUserInfo)

      await userStore.setUserInfoAction()

      expect(userStore.permissions).toEqual(new Set(['user:read']))
      expect(userStore.roles).toEqual(['user'])
      expect(userStore.user).toEqual(mockUserInfo.user)
      expect(userStore.isSetUser).toBe(true)
    })

    it('should handle API error gracefully when cache exists', async () => {
      const mockUserInfo = {
        permissions: ['user:read'],
        roles: ['user'],
        user: {
          id: 2,
          avatar: 'cached-avatar.jpg',
          nickname: 'Cached User',
          deptId: 2
        },
        menus: []
      }

      vi.mocked(getAccessToken).mockReturnValue('test-token')
      mockWsCache.get.mockReturnValue(mockUserInfo)
      vi.mocked(getInfo).mockRejectedValue(new Error('API Error'))

      // The function should not throw an error
      await expect(userStore.setUserInfoAction()).resolves.not.toThrow()

      // Should still set user info from cache
      expect(userStore.permissions).toEqual(new Set(['user:read']))
      expect(userStore.roles).toEqual(['user'])
      expect(userStore.user).toEqual(mockUserInfo.user)
      expect(userStore.isSetUser).toBe(true)
    })
  })

  describe('setUserAvatarAction', () => {
    it('should update user avatar', async () => {
      const mockUserInfo = {
        permissions: ['user:read'],
        roles: ['user'],
        user: {
          id: 1,
          avatar: 'old-avatar.jpg',
          nickname: 'Test User',
          deptId: 1
        },
        menus: []
      }

      // Set up user state first
      userStore.permissions = new Set(['user:read'])
      userStore.roles = ['user']
      userStore.user = mockUserInfo.user
      userStore.isSetUser = true

      mockWsCache.get.mockReturnValue(mockUserInfo)

      await userStore.setUserAvatarAction('new-avatar.jpg')

      expect(userStore.user.avatar).toBe('new-avatar.jpg')
      expect(mockUserInfo.user.avatar).toBe('new-avatar.jpg')
      expect(mockWsCache.set).toHaveBeenCalledWith(CACHE_KEY.USER, mockUserInfo)
    })
  })

  describe('setUserNicknameAction', () => {
    it('should update user nickname', async () => {
      const mockUserInfo = {
        permissions: ['user:read'],
        roles: ['user'],
        user: {
          id: 1,
          avatar: 'avatar.jpg',
          nickname: 'Old Nickname',
          deptId: 1
        },
        menus: []
      }

      // Set up user state first
      userStore.permissions = new Set(['user:read'])
      userStore.roles = ['user']
      userStore.user = mockUserInfo.user
      userStore.isSetUser = true

      mockWsCache.get.mockReturnValue(mockUserInfo)

      await userStore.setUserNicknameAction('New Nickname')

      expect(userStore.user.nickname).toBe('New Nickname')
      expect(mockUserInfo.user.nickname).toBe('New Nickname')
      expect(mockWsCache.set).toHaveBeenCalledWith(CACHE_KEY.USER, mockUserInfo)
    })
  })

  describe('loginOut', () => {
    it('should logout user and reset state', async () => {
      // Set up some user data
      userStore.permissions = new Set(['user:read'])
      userStore.roles = ['admin']
      userStore.isSetUser = true
      userStore.user = {
        id: 1,
        avatar: 'avatar.jpg',
        nickname: 'Test User',
        deptId: 1
      }

      vi.mocked(loginOut).mockResolvedValue(undefined)

      await userStore.loginOut()

      expect(loginOut).toHaveBeenCalled()
      expect(removeToken).toHaveBeenCalled()
      expect(deleteUserCache).toHaveBeenCalled()
      expect(userStore.permissions).toEqual(new Set<string>())
      expect(userStore.roles).toEqual([])
      expect(userStore.isSetUser).toBe(false)
      expect(userStore.user).toEqual({
        id: 0,
        avatar: '',
        nickname: '',
        deptId: 0
      })
    })
  })

  describe('resetState', () => {
    it('should reset all state to initial values', () => {
      // Set up some user data
      userStore.permissions = new Set(['user:read'])
      userStore.roles = ['admin']
      userStore.isSetUser = true
      userStore.user = {
        id: 1,
        avatar: 'avatar.jpg',
        nickname: 'Test User',
        deptId: 1
      }

      userStore.resetState()

      expect(userStore.permissions).toEqual(new Set<string>())
      expect(userStore.roles).toEqual([])
      expect(userStore.isSetUser).toBe(false)
      expect(userStore.user).toEqual({
        id: 0,
        avatar: '',
        nickname: '',
        deptId: 0
      })
    })
  })
})
