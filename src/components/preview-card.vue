<script lang="ts" setup>
const _props = defineProps<{
  color: string
  title: string
}>()
</script>

<template>
  <div class="grid gap-8">
    <div class="relative">
      <img alt="" class="absolute -top-5 -left-8 h-20 w-20" src="@/assets/images/bubble.svg" />
      <h3 class="relative flex items-center gap-2 bg-neutral-50 font-display text-lg font-semibold">
        {{ title }}
      </h3>
      <div :class="[color, 'relative h-1']" />
    </div>
    <p class="text-sm leading-loose text-neutral-600 sm:text-base sm:leading-loose">
      <slot />
    </p>
  </div>
</template>
