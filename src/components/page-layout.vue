<script lang="ts" setup>
import PageFooter from "@/components/page-footer.vue";
import PageHeader from "@/components/page-header.vue";
</script>

<template>
	<div class="grid min-h-full grid-rows-[1fr_auto]">
		<PageHeader />
		<div class="pt-[64px]">
			<slot />
		</div>
		<PageFooter />
	</div>
</template>
