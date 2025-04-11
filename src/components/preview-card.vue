<script lang="ts" setup>
const _props = defineProps<{
	color: string;
	title: string;
}>();
</script>

<template>
	<div class="grid gap-8">
		<div class="relative">
			<img
				alt=""
				class="absolute -left-8 -top-5 w-20 lg:-left-10 lg:-top-7 lg:size-24"
				src="@/assets/images/bubble.svg"
			/>
			<h3
				class="relative flex items-center gap-2 bg-neutral-50 font-display text-lg font-semibold md:text-xl"
			>
				{{ title }}
			</h3>
			<div :class="[color, 'relative h-1']" />
		</div>
		<p class="text-sm font-light leading-relaxed text-neutral-600 sm:text-base sm:leading-relaxed">
			<slot />
		</p>
	</div>
</template>
