import { store } from '@/store'
import { defineStore } from 'pinia'
import { getAccessToken, removeToken } from '@/utils/auth'
import { CACHE_KEY, useCache, deleteUserCache } from '@/hooks/web/useCache'
import { getInfo, loginOut, switchRole } from '@/api/login'
import type { RoleVO } from '@/api/login/types'

const { wsCache } = useCache()

interface UserVO {
  id: number
  avatar: string
  nickname: string
  deptId: number
}

interface UserInfoVO {
  // USER 缓存
  permissions: Set<string>
  roles: string[]
  roleList: RoleVO[] // 角色列表
  currentRole: string // 当前角色
  isSetUser: boolean
  user: UserVO
}

export const useUserStore = defineStore('admin-user', {
  state: (): UserInfoVO => ({
    permissions: new Set<string>(),
    roles: [],
    roleList: [],
    currentRole: '',
    isSetUser: false,
    user: {
      id: 0,
      avatar: '',
      nickname: '',
      deptId: 0
    }
  }),
  getters: {
    getPermissions(): Set<string> {
      return this.permissions
    },
    getRoles(): string[] {
      return this.roles
    },
    getRoleList(): RoleVO[] {
      return this.roleList
    },
    getCurrentRole(): string {
      return this.currentRole
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUser(): UserVO {
      return this.user
    }
  },
  actions: {
    async setUserInfoAction() {
      if (!getAccessToken()) {
        this.resetState()
        return null
      }
      let userInfo = wsCache.get(CACHE_KEY.USER)
      if (!userInfo) {
        userInfo = await getInfo()
      } else {
        // 特殊：在有缓存的情况下，进行加载。但是即使加载失败，也不影响后续的操作，保证可以进入系统
        try {
          userInfo = await getInfo()
        } catch (error) {}
      }
      this.permissions = new Set(userInfo.permissions)
      this.roles = userInfo.roles
      this.roleList = userInfo.roleList || [] // 存储角色列表
      // 设置当前角色：默认使用第一个角色，或从缓存中获取
      const cachedRole = wsCache.get(CACHE_KEY.CURRENT_ROLE)
      this.currentRole = cachedRole || (userInfo.roles && userInfo.roles.length > 0 ? userInfo.roles[0] : '')
      if (!cachedRole && this.currentRole) {
        wsCache.set(CACHE_KEY.CURRENT_ROLE, this.currentRole)
      }
      this.user = userInfo.user
      this.isSetUser = true
      wsCache.set(CACHE_KEY.USER, userInfo)
      wsCache.set(CACHE_KEY.ROLE_ROUTERS, userInfo.menus)
    },
    async setUserAvatarAction(avatar: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.user.avatar = avatar
      userInfo.user.avatar = avatar
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async setUserNicknameAction(nickname: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.user.nickname = nickname
      userInfo.user.nickname = nickname
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async loginOut() {
      try {
        await loginOut()
      } catch (error) {
        // 即使后端登出失败，也要清理本地状态
        console.error('后端登出失败:', error)
      } finally {
        // 无论API调用成功与否，都清理本地状态
        removeToken()
        deleteUserCache() // 删除用户缓存
        wsCache.delete(CACHE_KEY.CURRENT_ROLE) // 删除当前角色
        this.resetState()
      }
    },
    async switchRoleAction(roleCode: string) {
      try {
        // 从 roleList 中查找对应的 roleId
        const role = this.roleList.find(r => r.code === roleCode)
        if (!role) {
          throw new Error('角色不存在')
        }

        // 调用切换角色接口（传递 roleId）
        await switchRole(role.id)
        // 更新当前角色
        this.currentRole = roleCode
        wsCache.set(CACHE_KEY.CURRENT_ROLE, roleCode)
        // 重新加载用户信息
        await this.setUserInfoAction()
      } catch (error) {
        console.error('切换角色失败:', error)
        throw error
      }
    },
    resetState() {
      this.permissions = new Set<string>()
      this.roles = []
      this.roleList = []
      this.currentRole = ''
      this.isSetUser = false
      this.user = {
        id: 0,
        avatar: '',
        nickname: '',
        deptId: 0
      }
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
