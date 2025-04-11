<script lang="ts" setup>
import { MagnifyingGlassIcon, XMarkIcon as CloseIcon } from "@heroicons/vue/20/solid";
import { ref } from "vue";

import FilterPanelForm from "@/components/filter-panel-form.vue";
import { useScreenColors } from "@/lib/use-screen-colors";

const colors = useScreenColors();

const isOpen = ref(false);
const filterPanelId = "search-filters";
</script>

<template>
	<div
		class="absolute inset-x-0 top-0 z-dialog hidden border-b-4 bg-background p-4 shadow-lg sm:flex"
		:class="colors.borderColor[0]"
	>
		<FilterPanelForm v-bind="$attrs">
			<slot />
		</FilterPanelForm>
	</div>

	<div class="sm:hidden">
		<button
			:aria-controls="filterPanelId"
			:aria-expanded="isOpen"
			aria-label="Suchfilter anzeigen"
			class="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-neutral-0 shadow-xl"
			:class="colors.backgroundColor[0]"
			@click="isOpen = true"
		>
			<MagnifyingGlassIcon aria-hidden="true" class="size-5" />
		</button>
		<div v-if="isOpen">
			<Transition
				appear
				enter-active-class="transition duration-300 ease-out"
				enter-from-class="opacity-0 scale-95"
				enter-to-class="opacity-100 scale-100"
				leave-active-class="transition duration-200 ease-in"
				leave-from-class="opacity-100 scale-100"
				leave-to-class="opacity-0 scale-95"
			>
				<div
					:id="filterPanelId"
					class="absolute inset-x-0 top-0 z-dialog flex border-b-4 bg-background p-4 pr-12 shadow-lg"
					:class="colors.borderColor[0]"
				>
					<button
						aria-label="Suchfilter verbergen"
						class="absolute right-0 top-0 z-10 grid size-10 place-items-center"
						@click="isOpen = false"
					>
						<CloseIcon aria-hidden="true" class="size-5" />
					</button>
					<FilterPanelForm v-bind="$attrs">
						<slot />
					</FilterPanelForm>
				</div>
			</Transition>
		</div>
	</div>
</template>
