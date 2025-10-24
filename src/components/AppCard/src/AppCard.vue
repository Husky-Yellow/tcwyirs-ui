<template>
  <div class="bg-white rounded-12px shadow-sm">
    <div>
      <slot name="header"> </slot>
    </div>
    <div class="py-12px px-20px">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'AppCard' })
</script>
