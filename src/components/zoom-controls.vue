<script lang="ts" setup>
import {
  ArrowsPointingOutIcon as ZoomResetIcon,
  MinusIcon as ZoomOutIcon,
  PlusIcon as ZoomInIcon,
} from '@heroicons/vue/20/solid'

import { useScreenColors } from '@/lib/use-screen-colors'

defineEmits<{
  (event: 'zoom-in'): void
  (event: 'zoom-out'): void
  (event: 'zoom-reset'): void
}>()

const { backgroundColor, borderColor, hover } = useScreenColors()
</script>

<template>
  <aside class="absolute bottom-24 left-4 z-overlay hidden w-12 justify-center gap-2 xs:grid">
    <button
      aria-label="Zoom in"
      :class="[
        borderColor[0],
        backgroundColor[1],
        hover.backgroundColor[0],
        'grid h-8 w-8 place-items-center rounded-full border-2 shadow-lg transition',
      ]"
      @click="$emit('zoom-in')"
    >
      <zoom-in-icon aria-hidden="true" class="h-4 w-4" />
    </button>
    <button
      aria-label="Zoom out"
      :class="[
        borderColor[0],
        backgroundColor[1],
        hover.backgroundColor[0],
        'grid h-8 w-8 place-items-center rounded-full border-2 shadow-lg transition',
      ]"
      @click="$emit('zoom-out')"
    >
      <zoom-out-icon aria-hidden="true" class="h-4 w-4" />
    </button>
    <button
      aria-label="Reset zoom"
      :class="[
        borderColor[0],
        backgroundColor[1],
        hover.backgroundColor[0],
        'grid h-8 w-8 place-items-center rounded-full border-2 shadow-lg transition',
      ]"
      @click="$emit('zoom-reset')"
    >
      <zoom-reset-icon aria-hidden="true" class="h-4 w-4" />
    </button>
    <slot />
  </aside>
</template>
