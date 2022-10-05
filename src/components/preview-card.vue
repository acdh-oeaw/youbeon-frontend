<script lang="ts" setup>
import { ChatBubbleBottomCenterIcon } from '@heroicons/vue/24/outline'

const _props = defineProps<{
  color: string
  title: string
  to: { name: string }
}>()
</script>

<template>
  <router-link :to="to" class="grid gap-4">
    <div class="grid gap-1.5">
      <h3 class="flex items-center gap-2 font-display text-lg font-semibold">
        <chat-bubble-bottom-center-icon aria-hidden="true" class="h-6 w-6" />{{ title }}
      </h3>
      <div :class="[color, 'h-0.5']" />
    </div>
    <p class="text-sm leading-loose text-neutral-600">
      <slot />
    </p>
  </router-link>
</template>
