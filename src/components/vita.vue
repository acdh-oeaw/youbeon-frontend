<script lang="ts" setup>
import { computed } from "vue";

const _props = defineProps<{
	name: string;
	pid: string;
	image: string;
	bio: string;
}>();

const imageUrl = computed(() => {
	return new URL(`/src/assets/images/${_props.image}`, import.meta.url).href;
});
</script>

<template>
	<div class="flex flex-col items-center md:flex-row">
		<img alt="" class="size-60 flex-shrink-0" :src="imageUrl" />
		<div class="flex flex-col gap-2">
			<h3 class="font-display text-base sm:text-lg">{{ name }}</h3>
			<p>
				(<a :href="pid">{{ pid }}</a
				>)
				<br />
				<br />
				{{ bio }}
			</p>
		</div>
	</div>
</template>
