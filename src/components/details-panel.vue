<script lang="ts" setup>
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { onMounted, onUnmounted } from 'vue'

import DetailsPanelTitle from '@/components/details-panel-title.vue'
import { useScreenColors } from '@/lib/use-screen-colors'

const _props = defineProps<{
	title: string | undefined
	isOpen: boolean
}>()

const emit = defineEmits<{
	(event: 'close-panel'): void
}>()

/**
 * Intended behavior is similar to a popover, which must be closed intentionally:
 * - unlike a dialog, it should not trap focus, and it should allow interaction outside (i.e. clicking another node)
 * - unlike a popover, it should *not* close when focus moves outside
 */

function onClose() {
	emit('close-panel')
}

function onEscapeKey(event: KeyboardEvent) {
	if (event.key === 'Escape') {
		onClose()
	}
}

onMounted(() => {
	document.addEventListener('keyup', onEscapeKey)
})

onUnmounted(() => {
	document.removeEventListener('keyup', onEscapeKey)
})

const colors = useScreenColors()
const titleId = 'popover-title'
</script>

<template>
	<transition
		appear
		class="transition"
		enter-active-class="duration-300 ease-out"
		enter-from-class="opacity-0 scale-95"
		enter-to-class="opacity-100 scale-100"
		leave-active-class="duration-200 ease-in"
		leave-from-class="opacity-100 scale-100"
		leave-to-class="opacity-0 scale-95"
	>
		<aside
			v-if="isOpen"
			:aria-labelledby="titleId"
			:class="[
				colors.borderColor[0],
				'absolute inset-x-4 bottom-4 z-dialog ml-auto max-w-sm rounded-lg border-4 bg-background shadow-lg sm:inset-x-8 sm:bottom-8',
			]"
		>
			<div class="divide-neutral-200 overflow-hidden">
				<div class="flex items-start justify-between gap-4 px-4 py-2">
					<details-panel-title :id="titleId">
						{{ title }}
						<slot name="link" />
					</details-panel-title>
					<button aria-label="Close details panel" @click="onClose">
						<x-mark-icon aria-hidden="true" class="h-5 w-5" />
					</button>
				</div>
				<div class="grid max-h-96 gap-4 overflow-auto py-4 px-4 text-sm">
					<slot />
				</div>
			</div>
		</aside>
	</transition>
</template>
