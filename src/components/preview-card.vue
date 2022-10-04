<script lang="ts" setup>
const _props = defineProps<{
  color: string
  title: string
  to: { name: string }
}>()
</script>

<template>
  <router-link :to="to" class="grid gap-3">
    <div class="grid gap-1">
      <h3 class="font-display text-lg font-semibold">{{ title }}</h3>
      <div :class="[color, 'h-0.5']" />
    </div>
    <p class="text-sm leading-relaxed text-neutral-600">
      <slot />
    </p>
  </router-link>
</template>
