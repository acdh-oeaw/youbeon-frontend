<script lang="ts" setup>
import { Switch as SwitchControl, SwitchGroup, SwitchLabel } from '@headlessui/vue'

const _props = defineProps<{
  modelValue: boolean
  label: string
  name?: string
}>()
const emit = defineEmits<{
  (event: 'update:model-value', value: boolean): void
}>()
</script>

<template>
  <switch-group as="div" class="grid gap-1">
    <switch-label class="text-xs font-medium text-neutral-600">Filter</switch-label>
    <switch-control
      :model-value="modelValue"
      class="border-transparent relative my-1.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-0/75 ui-checked:bg-neutral-900 ui-not-checked:bg-neutral-200"
      :name="name"
      @update:model-value="(value) => emit('update:model-value', value)"
    >
      <span class="sr-only">{{ label }}</span>
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-neutral-0 transition ui-checked:translate-x-6 ui-not-checked:translate-x-1"
      />
    </switch-control>
  </switch-group>
</template>
