<script lang="ts" setup>
const _props = defineProps<{
  title: string
  to: { name: string }
}>()
</script>

<template>
  <router-link :to="to" class="grid gap-4">
    <h3 class="font-semibold">{{ title }}</h3>
    <p class="text-sm font-medium leading-relaxed text-neutral-500">
      <slot />
    </p>
  </router-link>
</template>
