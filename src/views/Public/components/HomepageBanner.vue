<template>
  <section
    class="relative min-h-500px flex items-center overflow-hidden bg-cover bg-center"
    style="background-image: url('/src/assets/imgs/bg/homepage/banner-background.png')"
  >
    <div class="max-w-1200px mx-auto px-20px w-full">
      <div class="flex items-center justify-between gap-60px">
        <div class="flex-1 max-w-600px">
          <h1 class="text-50px mb-20px leading-tight">
            <span class="text-#409EFF font-alibaba">芯连万物</span>
            <span class="text-#1f2937">共创万物智联时代</span>
          </h1>

          <p class="text-16px text-#6b7280 mb-40px leading-1.8">
            构筑互联互通的资源共享协作网络，实现企业级数智资源、应用资源、组建资源的高动共用
          </p>

          <button
            class="px-40px py-16px bg-#409EFF text-white text-16px font-500 rounded-8px cursor-pointer transition-all duration-300 hover:bg-#66b1ff hover:shadow-lg"
            @click="$emit('navigate')"
          >
            进入工作台
          </button>
        </div>

        <div class="flex-1 flex justify-end">
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
