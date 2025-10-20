<template>
  <div>
    <div class="text-center">
      <UserAvatar :img="userInfo?.avatar" />
    </div>
    <ul class="list-group list-group-striped">
      <li class="list-group-item">
        <Icon class="mr-5px" icon="ep:user" />
        {{ '用户名称' }}
        <div class="pull-right">{{ userInfo?.username }}</div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="ep:phone" />
        {{ '手机号码' }}
        <div class="pull-right">{{ userInfo?.mobile }}</div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="fontisto:email" />
        {{ '用户邮箱' }}
        <div class="pull-right">{{ userInfo?.email }}</div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="carbon:tree-view-alt" />
        {{ '所属部门' }}
        <div v-if="userInfo?.dept" class="pull-right">{{ userInfo?.dept.name }}</div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="ep:suitcase" />
        {{ '所属岗位' }}
        <div v-if="userInfo?.posts" class="pull-right">
          {{ userInfo?.posts.map((post) => post.name).join(',') }}
        </div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="icon-park-outline:peoples" />
        {{ '所属角色' }}
        <div v-if="userInfo?.roles" class="pull-right">
          {{ userInfo?.roles.map((role) => role.name).join(',') }}
        </div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="ep:calendar" />
        {{ '创建日期' }}
        <div class="pull-right">{{ formatDate(userInfo.createTime) }}</div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import UserAvatar from './UserAvatar.vue'

import { getUserProfile, ProfileVO } from '@/api/system/user/profile'

defineOptions({ name: 'ProfileUser' })

const userInfo = ref({} as ProfileVO)
const getUserInfo = async () => {
  const users = await getUserProfile()
  userInfo.value = users
}

// 暴露刷新方法
defineExpose({
  refresh: getUserInfo
})

onMounted(async () => {
  await getUserInfo()
})
</script>

<style scoped>
.text-center {
  position: relative;
  height: 120px;
  text-align: center;
}

.list-group-striped > .list-group-item {
  padding-right: 0;
  padding-left: 0;
  border-right: 0;
  border-left: 0;
  border-radius: 0;
}

.list-group {
  padding-left: 0;
  list-style: none;
}

.list-group-item {
  padding: 11px 0;
  margin-bottom: -1px;
  font-size: 13px;
  border-top: 1px solid #e7eaec;
  border-bottom: 1px solid #e7eaec;
}

.pull-right {
  float: right !important;
}
</style>
