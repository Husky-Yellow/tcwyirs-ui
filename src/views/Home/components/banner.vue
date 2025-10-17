<template>
  <div class="w-full h-75 bg-cover bg-center bg-no-repeat rounded-3 relative overflow-hidden" style="background-image: linear-gradient(to right, #1F54DB, #FFFFFF), url('@/assets/imgs/home/home_banner.png')">
    <div class="flex h-full items-center px-10 relative z-2 md:flex-row flex-col md:text-left text-center">
      <!-- Left section with text content -->
      <div class="flex-none w-45% pr-5 md:mb-0 mb-5">
        <h1 class="text-8 md:text-8 text-6 font-bold leading-tight mb-4">
          <span class="text-black">早上好,欢迎来到</span>
          <span class="text-blue-500">万物智联平台</span>
        </h1>
        <p class="text-base md:text-base text-sm text-gray-600 leading-relaxed m-0">
          万物智联运营门户平台这是一段关于平台介绍的文文本,这是一段关于平台介绍的文文本,这是一段关于平台介绍的文文本
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'IndexBanner' })
</script>
