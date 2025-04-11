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
	disabled?: boolean;
	empty?: boolean;
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

const selectedValues = computed<Array<Item>>(() => {
	return props.modelValue.map((key) => {
		return props.items.get(key)!;
	});
});

function onChangeSelection(value: Array<Item>) {
	emit(
		"update:model-value",
		value.map((item) => item.key),
	);
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

const virtual = computed<{ options: Array<Item>; disabled: (item: unknown) => boolean }>(() => {
	return {
		options:
			visibleItems.value.length > 0
				? visibleItems.value
				: [{ key: "_empty_", label: nothingFoundMessage, empty: true }],
		disabled(item) {
			const _item = item as Item;
			return Boolean(_item.disabled || _item.empty);
		},
	};
});
</script>

<template>
	<Combobox
		as="div"
		by="key"
		class="relative"
		:model-value="selectedValues"
		multiple
		:virtual="virtual"
		@update:model-value="onChangeSelection"
	>
		<div class="grid gap-y-1">
			<ComboboxLabel class="sr-only text-xs font-medium text-neutral-600">
				{{ label }}
			</ComboboxLabel>
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
							<XMarkIcon aria-hidden="true" class="size-3" />
						</button>
					</li>
				</ul>
				<div class="relative min-w-48 flex-1">
					<ComboboxInput
						autocomplete="off"
						class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-neutral-900 focus-visible:outline-none"
						:placeholder="placeholder"
						:value="searchTerm"
						@input="searchTerm = $event.target.value"
					/>
					<ComboboxButton
						class="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400"
					>
						<SelectorIcon aria-hidden="true" class="size-5" />
					</ComboboxButton>
				</div>
			</div>
		</div>
		<Transition
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<ComboboxOptions
				v-slot="{ option: item }"
				class="absolute z-overlay mt-1 max-h-80 min-h-[40px] w-full overflow-auto rounded-md bg-neutral-0 py-1 text-sm shadow-lg ring-1 ring-neutral-1000/5 focus:outline-none"
			>
				<template v-if="item.empty">
					<ComboboxOption as="template" disabled :value="item">
						<div
							class="relative w-full cursor-default select-none py-2 pl-10 pr-4 italic text-neutral-700"
						>
							{{ item.label }}
						</div>
					</ComboboxOption>
				</template>
				<template v-else>
					<ComboboxOption
						v-slot="{ selected, active }"
						as="template"
						:disabled="item.disabled"
						:value="item"
					>
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
								<CheckMarkIcon aria-hidden="true" class="size-5" />
							</span>
						</li>
					</ComboboxOption>
				</template>
			</ComboboxOptions>
		</Transition>
	</Combobox>
</template>
