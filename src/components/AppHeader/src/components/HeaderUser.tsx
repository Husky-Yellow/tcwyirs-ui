import { defineComponent, type PropType, ref } from 'vue'
import { ArrowRight, User, SwitchButton, Refresh } from '@element-plus/icons-vue'
import {
  ElTooltip,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElAvatar,
  ElIcon,
  ElTag,
  ElDialog,
  ElRadioGroup,
  ElRadio,
  ElButton,
  ElMessage
} from 'element-plus'
import type { RoleVO } from '@/api/login/types'

interface Props {
  isLoggedIn: boolean
  userName: string
  userAvatar: string
  currentRole?: string
  roles?: string[]
  roleList?: RoleVO[]
  onLogin?: () => void
  onLogout?: () => void
  onProfile?: () => void
  onSwitchRole?: (role: string) => void
}

export default defineComponent({
  name: 'HeaderUser',
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userAvatar: {
      type: String,
      required: true
    },
    currentRole: {
      type: String,
      default: ''
    },
    roles: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    roleList: {
      type: Array as PropType<RoleVO[]>,
      default: () => []
    },
    onLogin: {
      type: Function as PropType<() => void>,
      default: undefined
    },
    onLogout: {
      type: Function as PropType<() => void>,
      default: undefined
    },
    onProfile: {
      type: Function as PropType<() => void>,
      default: undefined
    },
    onSwitchRole: {
      type: Function as PropType<(role: string) => void>,
      default: undefined
    }
  },
  setup(props: Props) {

    // 角色切换弹窗
    const switchRoleDialogVisible = ref(false)
    const selectedRole = ref('')

    // 角色名称映射（从 roleList 中查找）
    const getRoleDisplayName = (roleCode: string) => {
      // 从 roleList 中查找对应的角色名称
      const role = props.roleList?.find(r => r.code === roleCode)
      return role ? role.name : roleCode
    }

    const handleCommand = (command: string) => {
      if (command === 'profile') {
        props.onProfile?.()
      } else if (command === 'logout') {
        props.onLogout?.()
      } else if (command === 'switchRole') {
        // 打开角色切换弹窗
        selectedRole.value = props.currentRole || ''
        switchRoleDialogVisible.value = true
      }
    }

    // 确认切换角色
    const handleConfirmSwitchRole = () => {
      if (!selectedRole.value) {
        ElMessage.warning('请选择角色')
        return
      }

      if (selectedRole.value === props.currentRole) {
        ElMessage.info('您已经在当前角色下')
        switchRoleDialogVisible.value = false
        return
      }

      props.onSwitchRole?.(selectedRole.value)
      switchRoleDialogVisible.value = false
    }

    return () => (
      <>
        {!props.isLoggedIn ? (
          <ElTooltip content="点击登录" placement="bottom">
            <div
              class="flex cursor-pointer items-center gap-8px whitespace-nowrap transition-opacity hover:opacity-80"
              onClick={props.onLogin}
            >
              <ElAvatar
                size={32}
                src={props.userAvatar}
                class="transition-transform duration-200 hover:scale-105"
              />
              <span class="text-14px transition-colors duration-200 hover:text-[#409EFF]">
                {props.userName}
              </span>
            </div>
          </ElTooltip>
        ) : (
          <>
            <ElDropdown trigger="click" onCommand={handleCommand}>
              {{
                default: () => (
                  <div class="flex cursor-pointer items-center gap-8px whitespace-nowrap transition-opacity hover:opacity-80">
                    <ElAvatar
                      size={32}
                      src={props.userAvatar}
                      class="transition-transform duration-200 hover:scale-105"
                    />
                    <span class="text-14px text-#333">{props.userName}</span>
                    {props.currentRole && (
                      <ElTag size="small" type="primary" effect="plain">
                        {getRoleDisplayName(props.currentRole)}
                      </ElTag>
                    )}
                    <ElIcon class="text-12px text-#666">
                      <ArrowRight />
                    </ElIcon>
                  </div>
                ),
                dropdown: () => (
                  <ElDropdownMenu>
                    <ElDropdownItem command="profile">
                      <ElIcon>
                        <User />
                      </ElIcon>
                      <span>个人信息</span>
                    </ElDropdownItem>
                    {/* 暂时移除角色数量限制，方便调试 */}
                    {props.roles && props.roles.length > 0 && (
                      <ElDropdownItem command="switchRole">
                        <ElIcon>
                          <Refresh />
                        </ElIcon>
                        <span>切换角色</span>
                      </ElDropdownItem>
                    )}
                    <ElDropdownItem command="logout" divided>
                      <ElIcon>
                        <SwitchButton />
                      </ElIcon>
                      <span>退出登录</span>
                    </ElDropdownItem>
                  </ElDropdownMenu>
                )
              }}
            </ElDropdown>

            {/* 角色切换弹窗 */}
            <ElDialog
              v-model={switchRoleDialogVisible.value}
              title="切换角色"
              width="400px"
              append-to-body
              center
            >
              {{
                default: () => (
                  <div class="py-20px">
                    <div class="mb-16px text-14px text-#606266">请选择要切换的角色：</div>
                    <ElRadioGroup v-model={selectedRole.value} class="w-full">
                      <div class="flex flex-col gap-12px">
                        {props.roleList && props.roleList.length > 0 ? (
                          // 从 roleList 中遍历（优先）
                          props.roleList.map((role) => (
                            <ElRadio
                              key={role.code}
                              label={role.code}
                              size="large"
                              class="w-full border border-#dcdfe6 rounded-4px px-16px py-12px mr-0! hover:border-#409eff"
                            >
                              <span class="text-14px">{role.name}</span>
                            </ElRadio>
                          ))
                        ) : (
                          // 如果没有 roleList，从 roles 中遍历（兜底）
                          props.roles?.map((roleCode) => (
                            <ElRadio
                              key={roleCode}
                              label={roleCode}
                              size="large"
                              class="w-full border border-#dcdfe6 rounded-4px px-16px py-12px mr-0! hover:border-#409eff"
                            >
                              <span class="text-14px">{getRoleDisplayName(roleCode)}</span>
                            </ElRadio>
                          ))
                        )}
                      </div>
                    </ElRadioGroup>
                  </div>
                ),
                footer: () => (
                  <div class="flex justify-end gap-12px">
                    <ElButton onClick={() => (switchRoleDialogVisible.value = false)}>
                      取消
                    </ElButton>
                    <ElButton type="primary" onClick={handleConfirmSwitchRole}>
                      确定
                    </ElButton>
                  </div>
                )
              }}
            </ElDialog>
          </>
        )}
      </>
    )
  }
})
