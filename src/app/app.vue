<script lang="ts" setup>
import LoadingIndicator from "@/components/loading-indicator.vue";
import PageLayout from "@/components/page-layout.vue";
import SkipNav from "@/components/skip-nav.vue";
</script>

<template>
	<skip-nav />
	<page-layout>
		<router-view v-slot="{ Component }">
			<template v-if="Component">
				<keep-alive>
					<suspense>
						<component :is="Component" />
						<template #fallback>
							<loading-indicator />
						</template>
					</suspense>
				</keep-alive>
			</template>
		</router-view>
	</page-layout>
</template>
