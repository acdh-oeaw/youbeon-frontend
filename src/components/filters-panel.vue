<script lang="ts" setup>
import { useScreenColors } from '@/lib/use-screen-colors'

const colors = useScreenColors()
</script>

<template>
  <div
    class="absolute inset-x-0 top-0 z-dialog flex border-b-4 bg-background p-4 shadow-lg before:absolute before:inset-x-0 before:border-t before:border-neutral-200"
    :class="colors.borderColor[0]"
  >
    <form
      v-bind="$attrs"
      novalidate
      role="search"
      class="mx-auto w-full max-w-4xl"
      @submit.prevent=""
    >
      <slot />
    </form>
  </div>
</template>
