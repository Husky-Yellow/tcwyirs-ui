<template>
  <div
    class="banner relative h-196px w-full overflow-hidden rounded-3 bg-cover bg-center bg-no-repeat"
  >
    <div
      class="relative z-2 h-full flex flex-col items-center px-10 text-center md:flex-row md:text-left"
    >
      <!-- Left section with text content -->
      <div class="mb-5 w-45% flex-none pr-5 md:mb-0">
        <h1 class="mb-4 text-6 text-8 font-bold leading-tight md:text-8">
          <span class="text-black">早上好,欢迎来到</span>
          <span class="text-blue-500">万物智联平台</span>
        </h1>
        <p class="m-0 text-base text-sm text-gray-600 leading-relaxed md:text-base">
          万物智联运营门户平台这是一段关于平台介绍的文文本,这是一段关于平台介绍的文文本,这是一段关于平台介绍的文文本
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'IndexBanner' })
</script>

<style scoped>
.banner {
  background-image: url('@/assets/imgs/home/home_banner.png');
}
</style>
