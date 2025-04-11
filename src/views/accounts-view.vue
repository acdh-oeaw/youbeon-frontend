<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import DetailsPanel from "@/components/details-panel.vue";
import DetailsPanelSection from "@/components/details-panel-section.vue";
import FiltersPanel from "@/components/filters-panel.vue";
import InfoDialog from "@/components/info-dialog.vue";
import MainContent from "@/components/main-content.vue";
import MultiCombobox from "@/components/multi-combobox.vue";
import NetworkGraph, { type Graph } from "@/components/network-graph.vue";
import SingleSelect from "@/components/single-select.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import {
	edgeStrokeColor,
	highlightedEdgeStrokeColor,
	highlightedNodeColors,
} from "@/config/network-graph.config";
import { accounts, ideas, interviewReligions, interviews } from "@/db";
import type { Account, InterviewReligion, Resource, ResourceKeyMap, ResourceMap } from "@/db/types";

//

/**
 * Note that we create new objects for nodes and edges, because d3 will mutate them.
 */
const graph: Graph = { nodes: { fixed: [], dynamic: [] }, edges: [] };

accounts.forEach((account) => {
	graph.nodes.dynamic.push({ key: account.key, label: account.label, kind: account.kind });

	account.interviews.forEach((key) => {
		const religion = interviews.get(key)!.religion;
		graph.edges.push({ source: religion, target: account.key });
	});
});

interviewReligions.forEach((religion) => {
	graph.nodes.fixed.push({ key: religion.key, label: religion.label, kind: religion.kind });
});

//

type AccountFilters = Pick<ResourceKeyMap, "account" | "interview-religion">;
type AccountFilterKind = keyof AccountFilters;
type LabeledAccountFilterKinds = Map<AccountFilterKind, { key: AccountFilterKind; label: string }>;
type AccountFilterItems = Pick<ResourceMap, "account" | "interview-religion">;

const accountFilterItems: AccountFilterItems = {
	account: accounts,
	"interview-religion": interviewReligions,
};

const labeledAccountFilterKinds: LabeledAccountFilterKinds = new Map([
	["account", { key: "account", label: "Accounts" }],
	["interview-religion", { key: "interview-religion", label: "Religionen" }],
]);

const accountFilters = ref<AccountFilters>({ account: new Set(), "interview-religion": new Set() });
const defaultAccountFilterKind = "account";
const accountFilterKind = ref<AccountFilterKind>(defaultAccountFilterKind);

const selectedEntity = ref<
	| { entity: Account; kind: "account" }
	| { entity: InterviewReligion; kind: "interview-religion" }
	| null
>(null);

const highlighted = computed(() => {
	let matches = 0;
	/** Whether to display the help text for multiple matches in the legend. */
	let hasMultiple = false;

	const highlights = new Map<Resource["key"], number>();

	function add(key: Resource["key"]) {
		highlights.set(key, (highlights.get(key) ?? 0) + 1);
	}

	function count(key: Resource["key"]) {
		if (highlights.has(key)) {
			hasMultiple = true;
		} else {
			matches++;
		}
	}

	accountFilters.value.account.forEach((key) => {
		count(key);
		add(key);
	});

	accountFilters.value["interview-religion"].forEach((key) => {
		interviewReligions.get(key)?.accounts.forEach((key) => {
			count(key);
			add(key);
		});
	});

	return { accounts: highlights, hasMultiple, matches };
});

//

const route = useRoute();
const router = useRouter();

function isFilterKind(value: string): value is AccountFilterKind {
	return Object.keys(accountFilterItems).includes(value);
}

function syncFiltersWithSearchParams() {
	const searchParams = new URLSearchParams(window.location.search);
	const detailsId = searchParams.get("details-id");
	const detailsKind = searchParams.get("details-kind");
	const ids = searchParams.getAll("id").filter(Boolean);
	const kind = searchParams.get("kind") ?? defaultAccountFilterKind;

	if (isFilterKind(kind)) {
		const keys = new Set<Resource["key"]>();

		ids.forEach((key) => {
			if (accountFilterItems[kind].has(key)) {
				keys.add(key);
			}
		});

		accountFilters.value = {
			account: new Set(),
			"interview-religion": new Set(),
			[kind]: keys,
		};

		accountFilterKind.value = kind;
	}

	function isValidDetailsKind(value: string): value is "account" | "interview-religion" {
		return ["account", "interview-religion"].includes(value);
	}

	if (
		detailsId != null &&
		detailsKind != null &&
		isValidDetailsKind(detailsKind) &&
		accountFilterItems[detailsKind].has(detailsId)
	) {
		selectedEntity.value = {
			entity: accountFilterItems[detailsKind].get(detailsId)!,
			kind: detailsKind,
		} as
			| { entity: Account; kind: "account" }
			| { entity: InterviewReligion; kind: "interview-religion" };
	} else {
		selectedEntity.value = null;
	}
}

watch(
	() => {
		return route.query;
	},
	syncFiltersWithSearchParams,
	{ immediate: true },
);

function onClickNode(key: Resource["key"], kind: Resource["kind"]) {
	void router.push({ query: { ...route.query, "details-id": key, "details-kind": kind } });
}

function onChangeAccountFilterKind(kind: string) {
	void router.push({ query: { ...route.query, kind: kind as AccountFilterKind } });
}

function onChangeAccountFilters(id: Array<Resource["key"]>) {
	void router.push({ query: { ...route.query, id } });
}

function onCloseDetailsPanel() {
	const { "details-id": _, "details-kind": __, ...query } = route.query;
	void router.push({ query });
}

function getColor() {
	return highlightedNodeColors.account.selected;
}
</script>

<template>
	<MainContent class="h-full overflow-hidden">
		<h1 class="sr-only">{{ $router.currentRoute.value.meta["title"] }}</h1>

		<VisualisationContainer v-slot="{ width, height }">
			<NetworkGraph
				:edge-stroke-color="edgeStrokeColor.account"
				:graph="graph"
				:height="height"
				:highlighted="highlighted.accounts"
				:highlighted-edge-stroke-color="highlightedEdgeStrokeColor.account"
				:matched="accountFilters[accountFilterKind]"
				:selected="selectedEntity?.entity"
				:width="width"
				@click-node="onClickNode"
			/>
		</VisualisationContainer>

		<FiltersPanel
			id="accounts-filters"
			class="grid items-start gap-4 sm:grid-cols-[1fr_auto]"
			name="accounts-filters"
		>
			<MultiCombobox
				:get-tag-color="getColor"
				:items="accountFilterItems[accountFilterKind]"
				:label="labeledAccountFilterKinds.get(accountFilterKind)!.label"
				:model-value="Array.from(accountFilters[accountFilterKind])"
				name="active-places-filters"
				@update:model-value="onChangeAccountFilters"
			/>
			<SingleSelect
				class="min-w-32 flex-1"
				:items="labeledAccountFilterKinds"
				label="Filter-Kategorie"
				:model-value="accountFilterKind"
				name="accounts-filter-kind"
				@update:model-value="onChangeAccountFilterKind"
			/>
			<div v-if="highlighted.matches > 0" class="flex items-center gap-2 text-xs">
				<span>{{ highlighted.matches }} Treffer.</span>
				<span v-if="highlighted.hasMultiple">
					Gemeinsame Accounts
					<span
						class="mx-1 inline-block size-2.5 rounded-full"
						:style="{ backgroundColor: highlightedNodeColors.account.multiple }"
					/>
				</span>
			</div>
		</FiltersPanel>

		<DetailsPanel
			:key="selectedEntity?.entity.key"
			:is-open="selectedEntity != null"
			:title="selectedEntity?.entity.label"
			@close-panel="onCloseDetailsPanel"
		>
			<template v-if="selectedEntity?.kind === 'account'" #link>
				<a
					aria-label="Instagram"
					:href="`https://instagram.com/${selectedEntity?.entity.label}`"
					rel="noreferrer"
					target="_blank"
				>
					<img alt="" class="size-5" src="@/assets/images/instagram.svg" />
				</a>
			</template>
			<DetailsPanelSection
				:items="ideas"
				:keys="selectedEntity?.entity.ideas"
				label="Verknüpfte Ideen"
				route="ideas"
			/>
		</DetailsPanel>

		<InfoDialog title="Info">
			<div>Klick auf Account: hebt den Account hervor und öffnet das Kontext-Menü</div>
			<div>Suche nach Accounts: hebt den gesuchten Account hervor</div>
			<div>
				Suche nach einer Religionsgruppen: hebt alle Accounts hervor, die mit der gesuchten
				Religionsgruppe assoziiert sind
			</div>
			<div>
				Suche nach mehreren Religionsgruppen: hebt alle Accounts hervor, die mit den jeweiligen
				Religionen assoziiert sind; Accounts, die von mehreren der ausgewählten Religionen "geteilt"
				werden, werden gesondert hervorgehoben
			</div>
		</InfoDialog>
	</MainContent>
</template>
