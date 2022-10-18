<script lang="ts" setup>
import { useScreenColors } from '@/lib/use-screen-colors'

const colors = useScreenColors()
</script>

<template>
  <form
    :class="[
      colors.borderColor[0],
      colors.backgroundColor[1],
      'absolute inset-x-4 top-4 z-dialog mx-auto max-w-4xl rounded-lg border-4 p-4 shadow-lg sm:inset-x-8',
    ]"
    novalidate
    role="search"
    @submit.prevent=""
  >
    <slot />
  </form>
</template>
