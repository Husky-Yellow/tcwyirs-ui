<template>
  <h2 class="enter-x mb-3 text-center text-2xl font-bold xl:text-center xl:text-3xl">
    {{ getFormTitle }}
  </h2>
</template>
<script lang="ts" setup>
import { LoginStateEnum, useLoginState } from './useLogin'

defineOptions({ name: 'LoginFormTitle' })

const { getLoginState } = useLoginState()

const getFormTitle = computed(() => {
  const titleObj = {
    [LoginStateEnum.RESET_PASSWORD]: '重置密码',
    [LoginStateEnum.LOGIN]: '登录',
    [LoginStateEnum.REGISTER]: '注册',
    [LoginStateEnum.MOBILE]: '手机登录',
    [LoginStateEnum.QR_CODE]: '二维码登录',
    [LoginStateEnum.SSO]: 'SSO登录'
  }
  return titleObj[unref(getLoginState)]
})
</script>
