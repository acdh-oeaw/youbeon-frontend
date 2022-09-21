<script lang="ts" setup>
import {
  ArrowsPointingOutIcon as ZoomResetIcon,
  MinusIcon as ZoomOutIcon,
  PlusIcon as ZoomInIcon,
} from '@heroicons/vue/20/solid'

defineEmits<{
  (event: 'zoom-in'): void
  (event: 'zoom-out'): void
  (event: 'zoom-reset'): void
}>()
</script>

<template>
  <aside class="absolute bottom-24 left-4 z-overlay hidden w-12 justify-center gap-2 xs:grid">
    <button
      aria-label="Zoom in"
      class="grid h-8 w-8 place-items-center rounded-full border-4 border-brand-cyan bg-brand-cyan-tint shadow-lg transition hover:bg-brand-cyan"
      @click="$emit('zoom-in')"
    >
      <zoom-in-icon aria-hidden="true" class="h-4 w-4" />
    </button>
    <button
      aria-label="Zoom out"
      class="grid h-8 w-8 place-items-center rounded-full border-4 border-brand-cyan bg-brand-cyan-tint shadow-lg transition hover:bg-brand-cyan"
      @click="$emit('zoom-out')"
    >
      <zoom-out-icon aria-hidden="true" class="h-4 w-4" />
    </button>
    <button
      aria-label="Reset zoom"
      class="grid h-8 w-8 place-items-center rounded-full border-4 border-brand-cyan bg-brand-cyan-tint shadow-lg transition hover:bg-brand-cyan"
      @click="$emit('zoom-reset')"
    >
      <zoom-reset-icon aria-hidden="true" class="h-4 w-4" />
    </button>
  </aside>
</template>
