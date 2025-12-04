<template>
  <div class="relative h-full w-full">
    <!-- 标题 -->
    <h2 v-if="title" class="mb-32px text-20px text-#1a1a1a font-600">
      {{ title }}
    </h2>

    <div class="relative">
      <!-- 卡片容器 -->
      <div class="overflow-hidden">
        <div
          class="flex gap-20px transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(calc(-${currentIndex * (100 / visibleCards)}% - ${currentIndex * gap}px))` }"
        >
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="flex-shrink-0"
            :style="{ width: `calc(${100 / visibleCards}% - ${gap * (visibleCards - 1) / visibleCards}px)` }"
          >
            <!-- 卡片 -->
            <div class="flex flex-col">
              <!-- 图片 -->
              <div class="relative mb-16px h-200px w-full overflow-hidden rounded-8px bg-#f0f2f5">
                <img
                  v-if="card.image"
                  :src="card.image"
                  :alt="card.title || `卡片 ${index + 1}`"
                  class="h-full w-full object-cover"
                />
                <div v-else class="h-full w-full flex items-center justify-center text-14px text-#999">
                  暂无图片
                </div>
              </div>

              <!-- 文字描述 -->
              <div class="text-14px text-#000000a6 leading-22px">
                {{ card.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 左右箭头 (仅当卡片数量 > visibleCards 时显示) -->
      <template v-if="cards.length > visibleCards">
        <!-- 左箭头 -->
        <button
          class="absolute left--40px top-100px z-10 h-32px w-32px flex cursor-pointer items-center justify-center border-1 border-#1677ff rounded-full border-solid bg-white text-#1677ff transition-all duration-300 disabled:cursor-not-allowed hover:bg-#1677ff hover:text-white disabled:opacity-30"
          :disabled="currentIndex === 0"
          @click="prev"
        >
          <Icon icon="ep:arrow-left" class="text-16px" />
        </button>

        <!-- 右箭头 -->
        <button
          class="absolute right--40px top-100px z-10 h-32px w-32px flex cursor-pointer items-center justify-center border-1 border-#1677ff rounded-full border-solid bg-white text-#1677ff transition-all duration-300 disabled:cursor-not-allowed hover:bg-#1677ff hover:text-white disabled:opacity-30"
          :disabled="currentIndex >= cards.length - visibleCards"
          @click="next"
        >
          <Icon icon="ep:arrow-right" class="text-16px" />
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface CardItem {
  image: string
  title?: string
  description: string
}

interface Props {
  cards?: CardItem[]
  title?: string
  visibleCards?: number
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  cards: () => [],
  title: '资源介绍标题',
  visibleCards: 3,
  gap: 20
})

const currentIndex = ref(0)

const next = () => {
  if (currentIndex.value < props.cards.length - props.visibleCards) {
    currentIndex.value++
  }
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}
</script>
