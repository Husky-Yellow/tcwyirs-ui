<template>
  <div class="legend-list">
    <div
      v-for="item in items"
      :key="item.name"
      class="legend-item"
    >
      <div class="legend-item__left">
        <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
        <span class="legend-name">{{ item.name }}</span>
      </div>
      <span class="legend-value">{{ item.value }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface LegendItem {
  name: string
  value: number
  color: string
}

interface Props {
  items: LegendItem[]
}

defineOptions({ name: 'LegendList' })

defineProps<Props>()
</script>

<style lang="scss" scoped>
.legend-list {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  margin-bottom: 8px;

  &__left {
    display: flex;
    align-items: center;
  }

  .legend-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .legend-name {
    font-size: 14px;
    color: #606266;
  }

  .legend-value {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }
}
</style>
