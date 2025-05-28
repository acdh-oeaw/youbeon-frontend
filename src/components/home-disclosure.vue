<script lang="ts" setup>
import { Disclosure as DisclosureRoot, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const _props = defineProps<{
	title: string;
}>();
</script>

<template>
	<DisclosureRoot as="div" class="grid gap-4" default-open>
		<DisclosureButton class="flex items-center justify-between gap-8">
			<h2 class="font-display text-xl font-bold sm:text-2xl">{{ title }}</h2>
			<ChevronDownIcon aria-hidden="true" class="size-5 shrink-0 transition ui-open:rotate-180" />
		</DisclosureButton>
		<DisclosurePanel
			class="grid max-w-5xl gap-2 text-sm font-light leading-relaxed text-neutral-600 sm:text-base sm:leading-relaxed"
		>
			<slot />
		</DisclosurePanel>
	</DisclosureRoot>
</template>
