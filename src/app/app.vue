<script lang="ts" setup>
import LoadingIndicator from "@/components/loading-indicator.vue";
import PageLayout from "@/components/page-layout.vue";
import SkipNav from "@/components/skip-nav.vue";
</script>

<template>
	<SkipNav />
	<PageLayout>
		<RouterView v-slot="{ Component }">
			<template v-if="Component">
				<KeepAlive>
					<Suspense>
						<component :is="Component" />
						<template #fallback>
							<LoadingIndicator />
						</template>
					</Suspense>
				</KeepAlive>
			</template>
		</RouterView>
	</PageLayout>
</template>
