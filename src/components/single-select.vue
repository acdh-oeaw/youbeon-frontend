<script lang="ts" setup>
import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from '@headlessui/vue'
import {
	CheckIcon as CheckMarkIcon,
	ChevronUpDownIcon as SelectorIcon,
} from '@heroicons/vue/20/solid'

interface Item {
	key: string
	label: string
}

const props = defineProps<{
	items: Map<Item['key'], Item>
	modelValue: Item['key']
	label: string
}>()
const emit = defineEmits<{
	(event: 'update:model-value', selectedKey: Item['key']): void
}>()

function getDisplayLabel(selectedKey: Item['key']) {
	return props.items.get(selectedKey)?.label ?? ''
}
</script>

<template>
	<listbox
		:model-value="modelValue"
		as="div"
		class="relative"
		@update:model-value="(value) => emit('update:model-value', value)"
	>
		<div class="grid gap-y-1">
			<listbox-label class="sr-only text-xs font-medium text-neutral-600">
				{{ label }}
			</listbox-label>
			<listbox-button
				class="relative w-full cursor-default rounded-lg bg-neutral-0 py-2 pl-3 pr-10 text-left text-sm shadow-md focus:outline-none focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-neutral-0/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300"
			>
				<span class="block truncate">{{ getDisplayLabel(modelValue) }}</span>
				<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
					<selector-icon class="h-5 w-5 text-neutral-400" aria-hidden="true" />
				</span>
			</listbox-button>
		</div>
		<transition
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<listbox-options
				class="absolute z-overlay mt-1 max-h-72 w-full overflow-auto rounded-md bg-neutral-0 py-1 text-sm shadow-lg ring-1 ring-neutral-1000/5 focus:outline-none"
			>
				<listbox-option
					v-for="[key, item] of items"
					v-slot="{ selected }"
					:key="key"
					:value="key"
					class="relative cursor-default select-none py-2 pl-10 pr-4 ui-active:bg-primary-100 ui-active:text-primary-900"
				>
					<span class="block truncate ui-selected:font-medium">{{ item.label }}</span>
					<span
						v-if="selected"
						class="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600"
					>
						<check-mark-icon aria-hidden="true" class="h-5 w-5" />
					</span>
				</listbox-option>
			</listbox-options>
		</transition>
	</listbox>
</template>
