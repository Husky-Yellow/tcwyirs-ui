<template>
  <section
    class="relative min-h-500px flex items-center overflow-hidden bg-cover bg-center"
    style="background-image: url('/src/assets/imgs/bg/homepage/banner-background.png')"
  >
    <div class="mx-auto max-w-1200px w-full px-20px">
      <div class="flex items-center justify-between gap-60px">
        <div class="max-w-700px w-full flex-shrink-0">
          <h1 class="mb-20px text-50px leading-tight">
            <span class="gradient-text font-alibaba mr-17px">芯连万物</span>
            <span class="font-alibaba text-[50px] text-#1f2937 text-black/85 font-bold">共创万物智联时代</span>
          </h1>

          <p class="text-[14px] text-black/65 font-normal font-['PingFang_SC']">
            构筑互联互通的资源共享协作网络，实现企业级数智资源、应用资源、组建资源的高动共用
          </p>

          <button
            class="gradient-button mt-84px cursor-pointer rounded-full px-40px py-16px text-16px text-white font-500 transition-all duration-300"
            @click="$emit('navigate')"
          >
            进入工作台
          </button>
        </div>

        <div class="flex justify-end">
          <img
            src="/src/assets/imgs/bg/homepage/banner-illustration.png"
            alt="Banner Illustration"
            class="h-314px w-326px"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'HomepageBanner' })
defineEmits<{ navigate: [] }>()
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #1677ff 0%, #16d4ff 50%, #1677ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-button {
  background: linear-gradient(90deg, #165dff 0%, #00c8ff 74%, #165dff 100%);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
  border: none;
}

.gradient-button:hover {
  box-shadow: 0 6px 16px rgba(22, 93, 255, 0.4);
  transform: translateY(-2px);
}

.gradient-button:active {
  transform: translateY(0);
}
</style>
