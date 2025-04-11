<script lang="ts" setup>
import { ref } from "vue";

import { useElementDimensions } from "@/lib/use-element-dimensions";

const element = ref<HTMLElement | null>(null);
const dimensions = useElementDimensions(element);
</script>

<template>
	<div ref="element" class="absolute grid size-full overflow-hidden">
		<slot v-if="dimensions != null" :height="dimensions.height" :width="dimensions.width" />
	</div>
</template>
