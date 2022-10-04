<script lang="ts" setup>
import { Disclosure as DisclosureRoot, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const _props = defineProps<{
  title: string
}>()
</script>

<template>
  <disclosure-root as="div" class="grid gap-4">
    <disclosure-button class="flex items-center justify-between gap-8">
      <h3 class="font-display">{{ title }}</h3>
      <chevron-down-icon aria-hidden="true" class="h-5 w-5 transition ui-open:rotate-180" />
    </disclosure-button>
    <disclosure-panel
      class="grid max-w-xl gap-2 text-sm font-medium leading-relaxed text-neutral-600"
    >
      <slot />
    </disclosure-panel>
  </disclosure-root>
</template>
