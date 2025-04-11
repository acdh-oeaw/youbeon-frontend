<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const _props = defineProps<{
	items: Array<string> | undefined;
	label: string;
}>();
</script>

<template>
	<Disclosure v-if="items != null && items.length > 0" as="div" class="grid gap-2">
		<DisclosureButton class="flex items-center justify-between">
			<h3 class="font-display text-sm font-medium text-neutral-600">{{ label }}</h3>
			<ChevronDownIcon aria-hidden="true" class="size-5 transition ui-open:rotate-180" />
		</DisclosureButton>
		<Transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition duration-75 ease-out"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<DisclosurePanel>
				<ul class="grid gap-2 leading-relaxed" role="list">
					<li v-for="(item, index) of items" :key="index">
						<span>{{ item }}</span>
					</li>
				</ul>
			</DisclosurePanel>
		</Transition>
	</Disclosure>
</template>
