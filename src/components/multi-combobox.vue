<script lang="ts" setup>
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxLabel,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/vue";
import {
	CheckIcon as CheckMarkIcon,
	ChevronUpDownIcon as SelectorIcon,
	XMarkIcon,
} from "@heroicons/vue/20/solid";
import { computed, ref } from "vue";

interface Item {
	key: string;
	label: string;
}

const props = defineProps<{
	items: Map<Item["key"], Item>;
	modelValue: Array<Item["key"]>;
	label: string;
	getTagColor?: (key: Item["key"]) => string;
}>();
const emit = defineEmits<(event: "update:model-value", selectedKeys: Array<Item["key"]>) => void>();

function getDisplayLabel(selectedKey: unknown) {
	return props.items.get(selectedKey as Item["key"])?.label ?? "";
}

function getRemoveButtonDisplayLabel(key: Item["key"]) {
	return `Remove ${getDisplayLabel(key)}`;
}

function onRemoveSelectedKey(key: Item["key"]) {
	emit(
		"update:model-value",
		props.modelValue.filter((value) => {
			return value !== key;
		}),
	);
}

const searchTerm = ref("");

function onChangeSelection(value: Array<Item["key"]>) {
	emit("update:model-value", value);
}

const visibleItems = computed(() => {
	const allOptions = props.items;
	const searchTerms = searchTerm.value.toLowerCase().split(/\s+/).filter(Boolean);

	if (searchTerms.length === 0) return Array.from(allOptions.values());

	const visibleItems: Array<Item> = [];

	allOptions.forEach((option) => {
		const label = option.label.toLowerCase();
		if (
			searchTerms.some((searchTerm) => {
				return label.includes(searchTerm);
			})
		) {
			visibleItems.push(option);
		}
	});

	return visibleItems;
});

const placeholder = "Suche nach...";
const nothingFoundMessage = "Nichts gefunden.";

function getTagStyle(key: Item["key"]) {
	const bg = props.getTagColor?.(key);
	if (bg == null) return {};
	return { "--tag-color": bg, color: "white" };
}

const virtual = computed(() => {
	return { options: visibleItems.value };
});
</script>

<template>
	<combobox
		:model-value="modelValue"
		multiple
		as="div"
		class="relative"
		:virtual="virtual"
		@update:model-value="onChangeSelection"
	>
		<div class="grid gap-y-1">
			<combobox-label class="sr-only text-xs font-medium text-neutral-600">
				{{ label }}
			</combobox-label>
			<div
				class="relative flex w-full cursor-default flex-wrap items-center overflow-hidden rounded-lg bg-neutral-0 text-left text-sm shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-0/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300"
			>
				<ul v-if="modelValue.length > 0" class="flex flex-wrap gap-2 px-2 py-1 text-xs" role="list">
					<li
						v-for="key of modelValue"
						:key="key"
						class="relative inline-flex items-center gap-1 overflow-hidden rounded bg-primary-200 px-2 py-1 font-medium before:pointer-events-none before:absolute before:inset-0 before:[background-color:_var(--tag-color)]"
						:style="getTagStyle(key)"
					>
						<span class="relative block truncate">{{ getDisplayLabel(key) }}</span>
						<button class="relative" @click="onRemoveSelectedKey(key)">
							<span class="sr-only">{{ getRemoveButtonDisplayLabel(key) }}</span>
							<x-mark-icon aria-hidden="true" class="h-3 w-3" />
						</button>
					</li>
				</ul>
				<div class="relative min-w-[12rem] flex-1">
					<combobox-input
						autocomplete="off"
						class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-neutral-900 focus-visible:outline-none"
						:placeholder="placeholder"
						:value="searchTerm"
						@input="searchTerm = $event.target.value"
					/>
					<combobox-button
						class="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400"
					>
						<selector-icon class="h-5 w-5" aria-hidden="true" />
					</combobox-button>
				</div>
			</div>
		</div>
		<transition
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<combobox-options
				v-slot="{ option: item }"
				class="absolute z-overlay mt-1 max-h-80 min-h-[40px] w-full overflow-auto rounded-md bg-neutral-0 py-1 text-sm shadow-lg ring-1 ring-neutral-1000/5 focus:outline-none"
			>
				<div
					v-if="searchTerm !== '' && visibleItems.length === 0"
					class="relative cursor-default select-none px-4 py-2 text-neutral-700"
				>
					{{ nothingFoundMessage }}
				</div>
				<combobox-option v-slot="{ selected, active }" as="template" :value="item">
					<li
						class="relative w-full cursor-default select-none py-2 pl-10 pr-4"
						:class="{ 'bg-primary-100 text-primary-900': active }"
					>
						<span class="block truncate" :class="{ 'font-medium': selected }">
							{{ item.label }}
						</span>
						<span
							v-if="selected"
							class="absolute inset-y-0 left-0 grid place-items-center pl-3 text-primary-600"
						>
							<check-mark-icon aria-hidden="true" class="h-5 w-5" />
						</span>
					</li>
				</combobox-option>
			</combobox-options>
		</transition>
	</combobox>
</template>
