<template>
  <section
    class="relative min-h-500px flex items-center overflow-hidden bg-cover bg-center"
    style="background-image: url('/src/assets/imgs/bg/homepage/banner-background.png')"
  >
    <div class="max-w-1200px mx-auto px-20px w-full">
      <div class="flex items-center justify-between gap-60px">
        <div class="w-full max-w-700px flex-shrink-0">
          <h1 class="text-50px mb-20px leading-tight">
            <span class="gradient-text font-alibaba mr-17px">芯连万物</span>
            <span class="text-#1f2937 font-alibaba font-bold text-[50px] text-black/85">共创万物智联时代</span>
          </h1>

          <p class="font-['PingFang_SC'] font-normal text-[14px] text-black/65">
            构筑互联互通的资源共享协作网络，实现企业级数智资源、应用资源、组建资源的高动共用
          </p>

          <button
            class="gradient-button mt-84px px-40px py-16px text-white text-16px font-500 rounded-full cursor-pointer transition-all duration-300"
            @click="$emit('navigate')"
          >
            进入工作台
          </button>
        </div>

        <div class="flex justify-end">
          <img
            src="/src/assets/imgs/bg/homepage/banner-illustration.png"
            alt="Banner Illustration"
            class="w-326px h-314px"
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
