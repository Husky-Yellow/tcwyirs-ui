<template>
  <el-form
    v-show="isVisible"
    ref="formLogin"
    :model="form"
    :rules="LoginRules"
    class="w-full space-y-4"
    size="large"
  >
    <LoginFormTitle />

    <el-form-item v-if="isTenantEnabled" prop="tenantName">
      <el-input v-model="form.tenantName" placeholder="请输入租户名称" :prefix-icon="icons.house" />
    </el-form-item>

    <el-form-item prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="icons.avatar" />
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="form.password"
        placeholder="请输入密码"
        :prefix-icon="icons.lock"
        type="password"
        show-password
        @keyup.enter="handleSubmit"
      />
    </el-form-item>

    <div class="flex items-center justify-between">
      <el-checkbox v-model="form.rememberMe"> 记住我 </el-checkbox>
      <el-link type="primary" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
        忘记密码
      </el-link>
    </div>

    <el-button
      :loading="loginLoading"
      type="primary"
      size="large"
      class="w-full"
      @click="handleSubmit"
    >
      登录
    </el-button>

    <Verify
      v-if="isCaptchaEnabled"
      ref="verify"
      captchaType="blockPuzzle"
      :imgSize="{ width: '400px', height: '200px' }"
      mode="pop"
      @success="login"
    />
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, unref } from 'vue'
import { useRouter } from 'vue-router'
import {
  useToggle,
  useLocalStorage,
  watchDebounced,
  useUrlSearchParams,
  tryOnMounted,
  useEventListener
} from '@vueuse/core'
import { ElLoading, ElMessage, type FormInstance } from 'element-plus'
import { Verify } from '@/components/Verifition'
import LoginFormTitle from './LoginFormTitle.vue'
import { useIcon } from '@/hooks/web/useIcon'
import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, useFormValid, useLoginState } from './useLogin'

defineOptions({ name: 'LoginForm' })

const router = useRouter()
const permissionStore = usePermissionStore()

const { setLoginState, getLoginState } = useLoginState()

const formLogin = ref<FormInstance>()
const { validForm } = useFormValid(formLogin)
const verify = ref<InstanceType<typeof Verify>>()
const [loginLoading, toggleLoginLoading] = useToggle(false)
const rememberMe = useLocalStorage('tcwyirs-remember-me', false)
const redirect = computed(() => (useUrlSearchParams('history').redirect as string) || '/')

const icons = {
  house: useIcon({ icon: 'ep:house' }),
  avatar: useIcon({ icon: 'ep:avatar' }),
  lock: useIcon({ icon: 'ep:lock' })
}

const isVisible = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)
const isCaptchaEnabled = computed(() => import.meta.env.VITE_APP_CAPTCHA_ENABLE !== 'false')
const isTenantEnabled = computed(() => import.meta.env.VITE_APP_TENANT_ENABLE !== 'false')

const LoginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const form = reactive({
  tenantName: import.meta.env.VITE_APP_DEFAULT_LOGIN_TENANT || '',
  username: import.meta.env.VITE_APP_DEFAULT_LOGIN_USERNAME || '',
  password: import.meta.env.VITE_APP_DEFAULT_LOGIN_PASSWORD || '',
  captchaVerification: '',
  rememberMe: rememberMe.value
})

const handleSubmit = async () => {
  if (!isCaptchaEnabled.value) {
    await login({})
  } else {
    verify.value?.show()
  }
}

let timeoutId: number | null = null
const startLoginTimeout = () => {
  timeoutId = window.setTimeout(() => {
    toggleLoginLoading(false)
    ElMessage.error('登录超时，请重试')
  }, 30000)
}
const stopLoginTimeout = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

const setTenantId = async () => {
  if (isTenantEnabled.value && form.tenantName) {
    try {
      const res = await LoginApi.getTenantIdByName(form.tenantName)
      authUtil.setTenantId(res)
    } catch (error) {
      console.error('获取租户ID失败:', error)
    }
  }
}

const loadCache = async () => {
  const cached = authUtil.getLoginForm()
  if (cached) Object.assign(form, cached)
}

const loadTenantByWebsite = async () => {
  try {
    const res = await LoginApi.getTenantByWebsite(location.host)
    if (res?.name && res?.id) {
      form.tenantName = res.name
      authUtil.setTenantId(res.id)
    }
  } catch (error) {
    console.error('根据域名获取租户信息失败:', error)
  }
}

const login = async (params: { captchaVerification?: string } = {}) => {
  toggleLoginLoading(true)
  startLoginTimeout()
  const loadingInstance = ElLoading.service({ lock: true, text: '正在加载系统中...' })

  try {
    await setTenantId()
    if (!(await validForm())) return

    const loginData = { ...form, captchaVerification: params.captchaVerification || '' }
    const token = await LoginApi.login(loginData)
    if (!token) return

    loginData.rememberMe ? authUtil.setLoginForm(loginData) : authUtil.removeLoginForm()
    authUtil.setToken(token)

    const path = redirect.value.includes('sso')
      ? window.location.href.replace('/login?redirect=', '')
      : redirect.value || permissionStore.addRouters[0]?.path || '/'

    redirect.value.includes('sso') ? (window.location.href = path) : await router.push({ path })
  } finally {
    toggleLoginLoading(false)
    stopLoginTimeout()
    loadingInstance.close()
  }
}

watchDebounced(
  () => form.rememberMe,
  (value) => {
    rememberMe.value = value
  },
  { debounce: 300 }
)

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter' && isVisible.value) {
    e.preventDefault()
    handleSubmit()
  }
})

tryOnMounted(() => Promise.all([loadCache(), loadTenantByWebsite()]))
</script>

<style lang="scss" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
</style>
