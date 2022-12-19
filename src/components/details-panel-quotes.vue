<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const _props = defineProps<{
	items: Array<string> | undefined
	label: string
}>()
</script>

<template>
	<disclosure v-if="items != null && items.length > 0" as="div" class="grid gap-2">
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
				<ul role="list" class="grid gap-2 leading-relaxed">
					<li v-for="(item, index) of items" :key="index">
						<span>{{ item }}</span>
					</li>
				</ul>
			</disclosure-panel>
		</transition>
	</disclosure>
</template>
