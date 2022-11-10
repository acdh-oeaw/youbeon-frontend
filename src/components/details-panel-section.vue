<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { computed } from 'vue'

import type { Resource } from '@/db/types'

const props = defineProps<{
  keys: Set<Resource['key']> | undefined
  items: Map<Resource['key'], Resource>
  route?: string
  label: string
}>()

const sortedItems = computed(() => {
  const sorted: Array<Resource> = []

  if (props.keys == null) return sorted

  for (const key of props.keys) {
    const item = props.items.get(key)
    if (item == null) continue
    sorted.push(item)
  }

  sorted.sort((a, b) => {
    return a.label.localeCompare(b.label)
  })

  return sorted
})
</script>

<template>
  <disclosure v-if="keys != null && keys.size > 0" as="div" class="grid gap-2">
    <disclosure-button class="flex items-center justify-between">
      <h3 class="font-display text-sm font-medium text-neutral-600">{{ label }}</h3>
      <chevron-down-icon
        aria-hidden="true"
        class="h-5 w-5 transform transition ui-open:rotate-180"
      />
    </disclosure-button>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-75 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <disclosure-panel>
        <ul role="list" class="grid gap-0.5">
          <li v-for="item of sortedItems" :key="item.key">
            <router-link
              v-if="route != null"
              :to="{ name: route, query: { id: [item.key], kind: item.kind } }"
              >{{ item.label }}</router-link
            >
            <span v-else>{{ item.label }}</span>
          </li>
        </ul>
      </disclosure-panel>
    </transition>
  </disclosure>
</template>
