import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/modules/user'

// Mock all dependencies
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

describe('store/modules/user - Simple Tests', () => {
  let userStore: ReturnType<typeof useUserStore>

  beforeEach(() => {
    setActivePinia(createPinia())
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
    it('should return correct getter values', () => {
      // Set up some test data
      userStore.permissions = new Set(['user:read'])
      userStore.roles = ['admin']
      userStore.isSetUser = true
      userStore.user = {
        id: 1,
        avatar: 'avatar.jpg',
        nickname: 'Test User',
        deptId: 1
      }

      expect(userStore.getPermissions).toEqual(new Set(['user:read']))
      expect(userStore.getRoles).toEqual(['admin'])
      expect(userStore.getIsSetUser).toBe(true)
      expect(userStore.getUser).toEqual({
        id: 1,
        avatar: 'avatar.jpg',
        nickname: 'Test User',
        deptId: 1
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

  describe('state mutations', () => {
    it('should update permissions', () => {
      userStore.permissions = new Set(['user:read', 'user:write'])
      expect(userStore.permissions).toEqual(new Set(['user:read', 'user:write']))
    })

    it('should update roles', () => {
      userStore.roles = ['admin', 'user']
      expect(userStore.roles).toEqual(['admin', 'user'])
    })

    it('should update user info', () => {
      const newUser = {
        id: 2,
        avatar: 'new-avatar.jpg',
        nickname: 'New User',
        deptId: 2
      }

      userStore.user = newUser
      expect(userStore.user).toEqual(newUser)
    })

    it('should update isSetUser flag', () => {
      userStore.isSetUser = true
      expect(userStore.isSetUser).toBe(true)
    })
  })
})
