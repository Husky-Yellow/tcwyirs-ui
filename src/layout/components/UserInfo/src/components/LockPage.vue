<script lang="ts" setup>
import { resetRouter } from '@/router'
import { deleteUserCache } from '@/hooks/web/useCache'
import { useLockStore } from '@/store/modules/lock'
import { useNow } from '@/hooks/web/useNow'
import { useDesign } from '@/hooks/web/useDesign'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useUserStore } from '@/store/modules/user'
import avatarImg from '@/assets/imgs/avatar.gif'

const tagsViewStore = useTagsViewStore()

const { replace } = useRouter()

const userStore = useUserStore()

const password = ref('')
const loading = ref(false)
const errMsg = ref(false)
const showDate = ref(true)

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('lock-page')

const avatar = computed(() => userStore.user.avatar || avatarImg)
const userName = computed(() => userStore.user.nickname ?? 'Admin')

const lockStore = useLockStore()

const { hour, month, minute, meridiem, year, day, week } = useNow(true)

// 解锁
async function unLock() {
  if (!password.value) {
    return
  }
  let pwd = password.value
  try {
    loading.value = true
    const res = await lockStore.unLock(pwd)
    errMsg.value = !res
  } finally {
    loading.value = false
  }
}

// 返回登录
async function goLogin() {
  await userStore.loginOut().catch(() => {})
  // 登出后清理
  deleteUserCache() // 清空用户缓存
  tagsViewStore.delAllViews()
  // resetRouter() // 重置静态路由表
  lockStore.resetLockInfo()
  replace('/login')
}

function handleShowForm(show = false) {
  showDate.value = show
}
</script>

<template>
  <div
    :class="prefixCls"
    class="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black"
  >
    <div
      :class="`${prefixCls}__unlock`"
      class="sm:text-md absolute left-1/2 top-0 h-16 flex flex-col translate-x-1/2 transform cursor-pointer items-center justify-center pt-5 text-white xl:text-xl"
      @click="handleShowForm(false)"
      v-show="showDate"
    >
      <Icon icon="ep:lock" />
      <span>{{ '点击解锁' }}</span>
    </div>

    <div class="h-screen w-screen flex items-center justify-center">
      <div :class="`${prefixCls}__hour`" class="relative mr-5 h-2/5 w-2/5 md:mr-20 md:h-4/5">
        <span>{{ hour }}</span>
        <span class="meridiem text-md absolute left-5 top-5 xl:text-xl" v-show="showDate">
          {{ meridiem }}
        </span>
      </div>
      <div :class="`${prefixCls}__minute w-2/5 h-2/5 md:h-4/5 `">
        <span> {{ minute }}</span>
      </div>
    </div>
    <transition name="fade-slide">
      <div :class="`${prefixCls}-entry`" v-show="!showDate">
        <div :class="`${prefixCls}-entry-content`">
          <div class="flex flex-col items-center">
            <img :src="avatar" alt="" class="h-70px w-70px rounded-[50%]" />
            <span class="my-10px text-14px text-[var(--logo-title-text-color)]">
              {{ userName }}
            </span>
          </div>
          <ElInput
            type="password"
            :placeholder="'请输入锁屏密码'"
            class="enter-x"
            v-model="password"
          />
          <span :class="`text-14px ${prefixCls}-entry__err-msg enter-x`" v-if="errMsg">
            {{ '锁屏密码错误' }}
          </span>
          <div :class="`${prefixCls}-entry__footer enter-x`">
            <ElButton
              type="primary"
              size="small"
              class="enter-x mr-2 mt-2"
              link
              :disabled="loading"
              @click="handleShowForm(true)"
            >
              {{ '返回' }}
            </ElButton>
            <ElButton
              type="primary"
              size="small"
              class="enter-x mr-2 mt-2"
              link
              :disabled="loading"
              @click="goLogin"
            >
              {{ '返回登录' }}
            </ElButton>
            <ElButton
              type="primary"
              class="mt-2"
              size="small"
              link
              @click="unLock()"
              :disabled="loading"
            >
              {{ '进入系统' }}
            </ElButton>
          </div>
        </div>
      </div>
    </transition>

    <div class="enter-y absolute bottom-5 w-full text-center text-gray-300 2xl:text-3xl xl:text-xl">
      <div class="enter-x mb-4 text-5xl" v-show="!showDate">
        {{ hour }}:{{ minute }} <span class="text-3xl">{{ meridiem }}</span>
      </div>
      <div class="text-2xl">{{ year }}/{{ month }}/{{ day }} {{ week }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$prefix-cls: '#{$namespace}-lock-page';

// Small screen / tablet
$screen-sm: 576px;

// Medium screen / desktop
$screen-md: 768px;

// Large screen / wide desktop
$screen-lg: 992px;

// Extra large screen / full hd
$screen-xl: 1200px;

// Extra extra large screen / large desktop
$screen-2xl: 1600px;

$error-color: #ed6f6f;

.#{$prefix-cls} {
  z-index: 3000;

  &__unlock {
    transform: translate(-50%, 0);
  }

  &__hour,
  &__minute {
    display: flex;
    font-weight: 700;
    color: #bababa;
    background-color: #141313;
    border-radius: 30px;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: $screen-md) {
      span:not(.meridiem) {
        font-size: 160px;
      }
    }

    @media screen and (min-width: $screen-md) {
      span:not(.meridiem) {
        font-size: 160px;
      }
    }

    @media screen and (max-width: $screen-sm) {
      span:not(.meridiem) {
        font-size: 90px;
      }
    }
    @media screen and (min-width: $screen-lg) {
      span:not(.meridiem) {
        font-size: 220px;
      }
    }

    @media screen and (min-width: $screen-xl) {
      span:not(.meridiem) {
        font-size: 260px;
      }
    }
    @media screen and (min-width: $screen-2xl) {
      span:not(.meridiem) {
        font-size: 320px;
      }
    }
  }

  &-entry {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    justify-content: center;
    align-items: center;

    &-content {
      width: 260px;
    }

    &__header {
      text-align: center;

      &-img {
        width: 70px;
        margin: 0 auto;
        border-radius: 50%;
      }

      &-name {
        margin-top: 5px;
        font-weight: 500;
        color: #bababa;
      }
    }

    &__err-msg {
      display: inline-block;
      margin-top: 10px;
      color: $error-color;
    }

    &__footer {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
