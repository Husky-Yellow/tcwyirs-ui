<template>
  <section
    class="py-100px relative overflow-hidden"
    style="background: linear-gradient(180deg, rgba(248, 249, 252, 0.95) 0%, rgba(243, 246, 255, 0.4) 100%);"
  >
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
      style="background-image: url('/src/assets/imgs/bg/homepage/resource-sharing-bg.png');"
    ></div>

    <div class="relative max-w-1200px mx-auto px-20px">
      <div class="flex flex-col items-start">
        <h2 class="text-32px font-700 text-#1f2937 mb-40px">
          资源共享，带你享受资源互连互通的便利性
        </h2>

        <button
          class="px-32px py-14px bg-#409EFF text-white text-16px font-500 rounded-8px cursor-pointer transition-all duration-300 hover:bg-#66b1ff hover:shadow-lg"
          @click="$emit('navigate')"
        >
          智能要素超市
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'ResourceSharingCTA' })
defineEmits<{ navigate: [] }>()
</script>
