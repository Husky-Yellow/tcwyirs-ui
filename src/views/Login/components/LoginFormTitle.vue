<template>
  <div class="mb-8">
    <h2 v-if="!isRegister" class="text-2xl font-bold text-gray-800 xl:text-3xl">
      登陆/注册
    </h2>
    <div v-else class="flex items-center gap-3">
      <button @click="handleBack" class="text-blue-500 hover:text-blue-600">
        <Icon icon="ep:arrow-left" class="text-20px" />
      </button>
      <h2 class="text-2xl font-bold text-gray-800 xl:text-3xl">
        注册
      </h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Icon } from '@/components/Icon'
import { LoginStateEnum, useLoginState } from './useLogin'

defineOptions({ name: 'LoginFormTitle' })

const { getLoginState, setLoginState } = useLoginState()

const isRegister = computed(() => getLoginState.value === LoginStateEnum.REGISTER)

const handleBack = () => {
  setLoginState(LoginStateEnum.LOGIN)
}
</script>
