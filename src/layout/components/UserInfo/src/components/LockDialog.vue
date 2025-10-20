<script setup lang="ts">
import { useValidator } from '@/hooks/web/useValidator'
import { useDesign } from '@/hooks/web/useDesign'
import { useLockStore } from '@/store/modules/lock'
import avatarImg from '@/assets/imgs/avatar.gif'
import { useUserStore } from '@/store/modules/user'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('lock-dialog')

const { required } = useValidator()



const lockStore = useLockStore()

const props = defineProps({
  modelValue: {
    type: Boolean
  }
})

const userStore = useUserStore()
const avatar = computed(() => userStore.user.avatar || avatarImg)
const userName = computed(() => userStore.user.nickname ?? 'Admin')

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => {
    console.log('set: ', val)
    emit('update:modelValue', val)
  }
})

const dialogTitle = ref('锁定屏幕')

const formData = ref({
  password: undefined
})
const formRules = reactive({
  password: [required()]
})

const formRef = ref() // 表单 Ref
const handleLock = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  dialogVisible.value = false
  lockStore.setLockInfo({
    ...formData.value,
    isLock: true
  })
}
</script>

<template>
  <Dialog
    v-model="dialogVisible"
    width="500px"
    max-height="170px"
    :class="prefixCls"
    :title="dialogTitle"
  >
    <div class="flex flex-col items-center">
      <img :src="avatar" alt="" class="w-70px h-70px rounded-[50%]" />
      <span class="text-14px my-10px text-[var(--top-header-text-color)]">
        {{ userName }}
      </span>
    </div>
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
      <el-form-item :label="'锁屏密码'" prop="password">
        <el-input
          type="password"
          v-model="formData.password"
          :placeholder="'请输入' + '锁屏密码'"
          clearable
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <ElButton type="primary" @click="handleLock">{{ '锁定' }}</ElButton>
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
:global(.v-lock-dialog) {
  @media (max-width: 767px) {
    max-width: calc(100vw - 16px);
  }
}
</style>
