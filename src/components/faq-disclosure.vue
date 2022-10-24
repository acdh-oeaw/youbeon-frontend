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
      <h3 class="text-left font-display text-base sm:text-lg">{{ title }}</h3>
      <chevron-down-icon
        aria-hidden="true"
        class="h-5 w-5 flex-shrink-0 transition ui-open:rotate-180"
      />
    </disclosure-button>
    <disclosure-panel
      class="grid max-w-2xl gap-2 text-sm font-medium leading-loose text-neutral-600 sm:text-base sm:leading-loose"
    >
      <slot />
    </disclosure-panel>
  </disclosure-root>
</template>
