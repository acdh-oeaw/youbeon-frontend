<script lang="ts" setup>
import {
	Dialog as DialogRoot,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/20/solid";
import { InformationCircleIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

import { useScreenColors } from "@/lib/use-screen-colors";

const _props = defineProps<{
	title: string;
}>();

const isOpen = ref(false);

function toggle() {
	isOpen.value = !isOpen.value;
}

const colors = useScreenColors();
const label = "Info";
</script>

<template>
	<button
		:aria-label="label"
		:class="[
			colors.borderColor[0],
			colors.backgroundColor[1],
			colors.hover.backgroundColor[0],
			'absolute bottom-4 left-4 z-overlay hidden size-12 place-items-center rounded-full border-2 shadow-lg transition xs:grid',
		]"
		@click="toggle"
	>
		<InformationCircleIcon aria-hidden="true" class="size-6" />
	</button>
	<TransitionRoot appear as="template" :show="isOpen">
		<DialogRoot class="relative z-dialog" @close="toggle">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-neutral-1000/30 transition" />
			</TransitionChild>

			<div class="fixed inset-0 flex items-center justify-center p-4">
				<TransitionChild
					as="template"
					enter="duration-300 ease-out"
					enter-from="opacity-0 scale-95"
					enter-to="opacity-100 scale-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100 scale-100"
					leave-to="opacity-0 scale-95"
				>
					<DialogPanel
						:class="[
							colors.borderColor[0],
							'grid w-full max-w-sm gap-4 rounded-lg border-4 bg-neutral-0 p-8 shadow-lg transition',
						]"
					>
						<button aria-label="Close dialog" class="absolute right-4 top-4" @click="toggle">
							<XMarkIcon aria-hidden="true" class="size-5" />
						</button>
						<DialogTitle class="font-display text-lg font-medium leading-tight">
							{{ title }}
						</DialogTitle>
						<div class="grid gap-4">
							<slot :close="toggle" />
						</div>
					</DialogPanel>
				</TransitionChild>
			</div>
		</DialogRoot>
	</TransitionRoot>
</template>
