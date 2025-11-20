<template>
  <Form ref="formRef" :labelWidth="200" :rules="rules" :schema="schema">
    <template #sex="form">
      <el-radio-group v-model="form['sex']">
        <el-radio :value="1">{{ '男' }}</el-radio>
        <el-radio :value="2">{{ '女' }}</el-radio>
      </el-radio-group>
    </template>
  </Form>
  <div style="text-align: center">
    <XButton :title="'保存'" type="primary" @click="submit()" />
    <XButton :title="'重置'" type="danger" @click="init()" />
  </div>
</template>
<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import { FormSchema } from '@/types/data'
import type { FormExpose } from '@/components/Form'
import {
  getUserProfile,
  updateUserProfile,
  UserProfileUpdateReqVO
} from '@/api/system/user/profile'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'BasicInfo' })

const message = useMessage() // 消息弹窗
const userStore = useUserStore()

// 定义事件
const emit = defineEmits<{
  (e: 'success'): void
}>()

// 表单校验
const rules = reactive<FormRules>({
  nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  mobile: [
    { required: true, message: '请输入正确的手机号码', trigger: 'blur' },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ]
})
const schema = reactive<FormSchema[]>([
  {
    field: 'nickname',
    label: '用户昵称',
    component: 'Input'
  },
  {
    field: 'mobile',
    label: '手机号码',
    component: 'Input'
  },
  {
    field: 'email',
    label: '用户邮箱',
    component: 'Input'
  },
  {
    field: 'sex',
    label: '性别',
    component: 'InputNumber',
    value: 0
  }
])
const formRef = ref<FormExpose>() // 表单 Ref
const submit = () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      const data = unref(formRef)?.formModel as UserProfileUpdateReqVO
      await updateUserProfile(data)
      message.success('修改成功')
      const profile = await init()
      userStore.setUserNicknameAction(profile.nickname)
      // 发送成功事件
      emit('success')
    }
  })
}
const init = async () => {
  const res = await getUserProfile()
  unref(formRef)?.setValues(res)
  return res
}
onMounted(async () => {
  await init()
})
</script>
