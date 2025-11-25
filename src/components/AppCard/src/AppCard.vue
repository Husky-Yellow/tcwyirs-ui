<template>
  <div class="rounded-12px bg-white shadow-sm">
    <div>
      <slot name="header"> </slot>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'AppCard' })
</script>
