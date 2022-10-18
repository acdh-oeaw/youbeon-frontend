<script lang="ts" setup>
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import {
  CheckIcon as CheckMarkIcon,
  ChevronUpDownIcon as SelectorIcon,
  XMarkIcon,
} from '@heroicons/vue/20/solid'
import { useVirtualList } from '@vueuse/core'
import { computed, ref } from 'vue'

interface Item {
  key: string
  label: string
}

const props = defineProps<{
  items: Map<Item['key'], Item>
  modelValue: Array<Item['key']>
  label: string
  getTagColor?: (key: Item['key']) => string
}>()
const emit = defineEmits<{
  (event: 'update:model-value', selectedKeys: Array<Item['key']>): void
}>()

function getDisplayLabel(selectedKey: unknown) {
  return props.items.get(selectedKey as Item['key'])?.label ?? ''
}

function getRemoveButtonDisplayLabel(key: Item['key']) {
  return `Remove ${getDisplayLabel(key)}`
}

function onRemoveSelectedKey(key: Item['key']) {
  emit(
    'update:model-value',
    props.modelValue.filter((value) => {
      return value !== key
    }),
  )
}

const searchTerm = ref('')

const visibleItems = computed(() => {
  const allOptions = props.items
  const searchTerms = searchTerm.value.toLowerCase().split(/\s+/).filter(Boolean)

  if (searchTerms.length === 0) return Array.from(allOptions.values())

  const visibleItems: Array<Item> = []

  allOptions.forEach((option) => {
    const label = option.label.toLowerCase()
    if (
      searchTerms.some((searchTerm) => {
        return label.includes(searchTerm)
      })
    ) {
      visibleItems.push(option)
    }
  })

  return visibleItems
})

const { list, containerProps, wrapperProps } = useVirtualList(visibleItems, {
  itemHeight: 36,
  overscan: 10,
})

const placeholder = 'Suche...'
const nothingFoundMessage = 'Nichts gefunden.'
</script>

<template>
  <combobox
    :model-value="modelValue"
    multiple
    as="div"
    class="relative"
    @update:model-value="(value) => emit('update:model-value', value)"
  >
    <div class="grid gap-y-1">
      <combobox-label class="sr-only text-xs font-medium text-neutral-600">{{
        label
      }}</combobox-label>
      <div
        class="relative w-full cursor-default overflow-hidden rounded-lg bg-neutral-0 text-left text-sm shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-0/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300"
      >
        <ul v-if="modelValue.length > 0" class="flex flex-wrap gap-2 p-2 text-xs" role="list">
          <li
            v-for="key of modelValue"
            :key="key"
            class="relative inline-flex items-center gap-1 overflow-hidden rounded bg-primary-200 px-2 py-1 font-medium before:pointer-events-none before:absolute before:inset-0 before:opacity-25 before:[background-color:_var(--tag-color)]"
            :style="{ '--tag-color': getTagColor?.(key) }"
          >
            <span class="relative block truncate">{{ getDisplayLabel(key) }}</span>
            <button class="relative" @click="onRemoveSelectedKey(key)">
              <span class="sr-only">{{ getRemoveButtonDisplayLabel(key) }}</span>
              <x-mark-icon aria-hidden="true" class="h-3 w-3" />
            </button>
          </li>
        </ul>
        <div class="relative">
          <combobox-input
            autocomplete="off"
            class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-neutral-900 focus-visible:outline-none"
            :display-value="() => searchTerm"
            :placeholder="placeholder"
            @change="searchTerm = $event.target.value"
          />
          <combobox-button
            class="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400"
          >
            <selector-icon class="h-5 w-5" aria-hidden="true" />
          </combobox-button>
        </div>
      </div>
    </div>
    <transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <combobox-options
        class="absolute z-overlay mt-1 w-full rounded-md bg-neutral-0 py-1 text-sm shadow-lg ring-1 ring-neutral-1000/5 focus:outline-none"
      >
        <div
          v-if="searchTerm !== '' && visibleItems.length === 0"
          class="relative cursor-default select-none py-2 px-4 text-neutral-700"
        >
          {{ nothingFoundMessage }}
        </div>
        <div v-bind="containerProps" style="height: 100%" class="max-h-80 overflow-auto">
          <div v-bind="wrapperProps">
            <combobox-option
              v-for="{ data: item } of list"
              v-slot="{ selected }"
              :key="item.key"
              :value="item.key"
              class="relative cursor-default select-none py-2 pl-10 pr-4 ui-active:bg-primary-100 ui-active:text-primary-900"
              style="height: 36px"
            >
              <span class="block truncate ui-selected:font-medium">{{ item.label }}</span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 grid place-items-center pl-3 text-primary-600"
              >
                <check-mark-icon aria-hidden="true" class="h-5 w-5" />
              </span>
            </combobox-option>
          </div>
        </div>
      </combobox-options>
    </transition>
  </combobox>
</template>
