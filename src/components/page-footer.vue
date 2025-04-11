<script lang="ts" setup>
import { metadata } from "~/config/metadata.config";
</script>

<template>
	<footer class="bg-[#424C55] text-neutral-100">
		<div class="mx-auto max-w-5xl">
			<div class="flex justify-between px-6 py-2 font-medium xs:px-8">
				<small class="text-xs">
					&copy;
					<a
						class="hover:text-neutral-0"
						:href="metadata.creator.website"
						rel="noreferrer"
						target="_blank"
					>
						{{ metadata.creator.shortName ?? metadata.creator.name }}
					</a>
					{{ new Date().getUTCFullYear() }}
				</small>
				<RouterLink class="text-xs hover:text-neutral-0" :to="{ name: 'imprint' }">
					Impressum
				</RouterLink>
			</div>
		</div>
	</footer>
</template>
