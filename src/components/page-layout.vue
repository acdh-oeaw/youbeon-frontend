<script lang="ts" setup>
import PageFooter from '@/components/page-footer.vue'
import PageHeader from '@/components/page-header.vue'
</script>

<template>
  <div class="grid min-h-full grid-rows-[auto_1fr_auto]">
    <page-header />
    <div>
      <slot />
    </div>
    <page-footer />
  </div>
</template>
