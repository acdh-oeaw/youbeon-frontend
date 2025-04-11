<script lang="ts" setup>
import {
	ArrowsPointingOutIcon as ZoomResetIcon,
	MinusIcon as ZoomOutIcon,
	PlusIcon as ZoomInIcon,
} from "@heroicons/vue/20/solid";

import { useScreenColors } from "@/lib/use-screen-colors";

defineEmits<{
	// eslint-disable-next-line @typescript-eslint/prefer-function-type
	(event: "zoom-in" | "zoom-out" | "zoom-reset"): void;
}>();

const colors = useScreenColors();
</script>

<template>
	<aside class="absolute bottom-24 left-4 z-overlay hidden w-12 justify-center gap-2 xs:grid">
		<button
			aria-label="Zoom in"
			:class="[
				colors.borderColor[0],
				colors.backgroundColor[1],
				colors.hover.backgroundColor[0],
				'grid size-8 place-items-center rounded-full border-2 shadow-lg transition',
			]"
			@click="$emit('zoom-in')"
		>
			<ZoomInIcon aria-hidden="true" class="size-4" />
		</button>
		<button
			aria-label="Zoom out"
			:class="[
				colors.borderColor[0],
				colors.backgroundColor[1],
				colors.hover.backgroundColor[0],
				'grid size-8 place-items-center rounded-full border-2 shadow-lg transition',
			]"
			@click="$emit('zoom-out')"
		>
			<ZoomOutIcon aria-hidden="true" class="size-4" />
		</button>
		<button
			aria-label="Reset zoom"
			:class="[
				colors.borderColor[0],
				colors.backgroundColor[1],
				colors.hover.backgroundColor[0],
				'grid size-8 place-items-center rounded-full border-2 shadow-lg transition',
			]"
			@click="$emit('zoom-reset')"
		>
			<ZoomResetIcon aria-hidden="true" class="size-4" />
		</button>
		<slot />
	</aside>
</template>
