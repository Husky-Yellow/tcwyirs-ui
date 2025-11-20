<template>
  <section class="py-60px relative overflow-hidden section-bg">
    <div class="max-w-1124px mx-auto">
      <div class="flex flex-col items-start">
        <h2 class="font-['PingFang_SC'] font-medium text-[24px] leading-normal text-black/85">
          资源共享，带你享受资源互连互通的便利性
        </h2>

        <button
          class="gradient-button mt-24px px-40px py-12px text-white text-16px font-500 rounded-8px cursor-pointer transition-all duration-300"
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

<style scoped>
.section-bg {
  background: linear-gradient(
      180deg,
      rgba(248, 249, 252, 0.95) 0%,
      rgba(243, 246, 255, 0.4) 100%
    ),
    url('/src/assets/imgs/bg/homepage/resource-sharing-bg.png');
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
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
