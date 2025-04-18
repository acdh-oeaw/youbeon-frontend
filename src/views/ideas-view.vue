<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import DetailsPanel from "@/components/details-panel.vue";
import DetailsPanelQuotes from "@/components/details-panel-quotes.vue";
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
import { accounts, ideas, interviewReligions, interviews, places } from "@/db";
import type { Idea, InterviewReligion, Resource, ResourceKeyMap, ResourceMap } from "@/db/types";

//

/**
 * Note that we create new objects for nodes and edges, because d3 will mutate them.
 */
const graph: Graph = { nodes: { fixed: [], dynamic: [] }, edges: [] };

ideas.forEach((idea) => {
	graph.nodes.dynamic.push({ key: idea.key, label: idea.label, kind: idea.kind });

	idea.interviews.forEach((key) => {
		const religion = interviews.get(key)!.religion;
		graph.edges.push({ source: religion, target: idea.key });
	});
});

interviewReligions.forEach((religion) => {
	graph.nodes.fixed.push({ key: religion.key, label: religion.label, kind: religion.kind });
});

//

type IdeaFilters = Pick<ResourceKeyMap, "idea" | "interview-religion">;
type IdeaFilterKind = keyof IdeaFilters;
type LabeledIdeaFilterKinds = Map<IdeaFilterKind, { key: IdeaFilterKind; label: string }>;
type IdeaFilterItems = Pick<ResourceMap, "idea" | "interview-religion">;

const ideaFilterItems: IdeaFilterItems = {
	idea: ideas,
	"interview-religion": interviewReligions,
};

const labeledIdeaFilterKinds: LabeledIdeaFilterKinds = new Map([
	["idea", { key: "idea", label: "Ideen" }],
	["interview-religion", { key: "interview-religion", label: "Religionen" }],
]);

const ideaFilters = ref<IdeaFilters>({ idea: new Set(), "interview-religion": new Set() });
const defaultIdeaFilterKind = "idea";
const ideaFilterKind = ref<IdeaFilterKind>(defaultIdeaFilterKind);

const selectedEntity = ref<
	{ entity: Idea; kind: "idea" } | { entity: InterviewReligion; kind: "interview-religion" } | null
>(null);

const highlighted = computed(() => {
	let matches = 0;
	/** Whether to display the help text for multiple matches in the legend. */
	let hasMultiple = false;

	const highlights = new Map<Resource["key"], number>();

	function add(key: Resource["key"]) {
		if (highlights.has(key)) {
			hasMultiple = true;
		}

		highlights.set(key, (highlights.get(key) ?? 0) + 1);
	}

	function count(key: Resource["key"]) {
		if (highlights.has(key)) {
			hasMultiple = true;
		} else {
			matches++;
		}
	}

	ideaFilters.value.idea.forEach((key) => {
		count(key);
		add(key);
	});

	ideaFilters.value["interview-religion"].forEach((key) => {
		interviewReligions.get(key)?.ideas.forEach((key) => {
			count(key);
			add(key);
		});
	});

	ideaFilters.value.idea.forEach((key) => {
		ideas.get(key)?.ideas.forEach((key) => {
			add(key);
		});
	});

	return { ideas: highlights, hasMultiple, matches };
});

//

const route = useRoute();
const router = useRouter();

function isFilterKind(value: string): value is IdeaFilterKind {
	return Object.keys(ideaFilterItems).includes(value);
}

function syncFiltersWithSearchParams() {
	const searchParams = new URLSearchParams(window.location.search);
	const detailsId = searchParams.get("details-id");
	const detailsKind = searchParams.get("details-kind");
	const ids = searchParams.getAll("id").filter(Boolean);
	const kind = searchParams.get("kind") ?? defaultIdeaFilterKind;

	if (isFilterKind(kind)) {
		const keys = new Set<Resource["key"]>();

		ids.forEach((key) => {
			if (ideaFilterItems[kind].has(key)) {
				keys.add(key);
			}
		});

		ideaFilters.value = {
			idea: new Set(),
			"interview-religion": new Set(),
			[kind]: keys,
		};

		ideaFilterKind.value = kind;
	}

	function isValidDetailsKind(value: string): value is "idea" | "interview-religion" {
		return ["idea", "interview-religion"].includes(value);
	}

	if (
		detailsId != null &&
		detailsKind != null &&
		isValidDetailsKind(detailsKind) &&
		ideaFilterItems[detailsKind].has(detailsId)
	) {
		selectedEntity.value = {
			entity: ideaFilterItems[detailsKind].get(detailsId)!,
			kind: detailsKind,
		} as { entity: Idea; kind: "idea" } | { entity: InterviewReligion; kind: "interview-religion" };
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

function onChangeIdeaFilterKind(kind: string) {
	void router.push({ query: { ...route.query, kind: kind as IdeaFilterKind } });
}

function onChangeIdeaFilters(id: Array<Resource["key"]>) {
	void router.push({ query: { ...route.query, id } });
}

function onCloseDetailsPanel() {
	const { "details-id": _, "details-kind": __, ...query } = route.query;
	void router.push({ query });
}

function getColor() {
	return highlightedNodeColors.idea.selected;
}
</script>

<template>
	<MainContent class="h-full overflow-hidden">
		<h1 class="sr-only">{{ $router.currentRoute.value.meta["title"] }}</h1>

		<VisualisationContainer v-slot="{ width, height }">
			<NetworkGraph
				:edge-stroke-color="edgeStrokeColor.idea"
				:graph="graph"
				:height="height"
				:highlighted="highlighted.ideas"
				:highlighted-edge-stroke-color="highlightedEdgeStrokeColor.idea"
				:matched="ideaFilters[ideaFilterKind]"
				:selected="selectedEntity?.entity"
				:width="width"
				@click-node="onClickNode"
			/>
		</VisualisationContainer>

		<FiltersPanel
			id="ideas-filters"
			class="grid items-start gap-4 sm:grid-cols-[1fr_auto]"
			name="ideas-filters"
		>
			<MultiCombobox
				:get-tag-color="getColor"
				:items="ideaFilterItems[ideaFilterKind]"
				:label="labeledIdeaFilterKinds.get(ideaFilterKind)!.label"
				:model-value="Array.from(ideaFilters[ideaFilterKind])"
				name="active-places-filters"
				@update:model-value="onChangeIdeaFilters"
			/>
			<SingleSelect
				class="min-w-32 flex-1"
				:items="labeledIdeaFilterKinds"
				label="Filter-Kategorie"
				:model-value="ideaFilterKind"
				name="ideas-filter-kind"
				@update:model-value="onChangeIdeaFilterKind"
			/>
			<div v-if="highlighted.matches > 0" class="flex items-center gap-2 text-xs">
				<span>{{ highlighted.matches }} Treffer.</span>
				<span v-if="highlighted.hasMultiple">
					Gemeinsame Ideen
					<span
						class="mx-1 inline-block size-2.5 rounded-full"
						:style="{ backgroundColor: highlightedNodeColors.idea.multiple }"
					/>
				</span>
				<span>
					Verknüpfte Ideen
					<span
						class="mx-1 inline-block size-2.5 rounded-full"
						:style="{ backgroundColor: highlightedNodeColors.idea.highlighted }"
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
			<DetailsPanelSection
				:items="accounts"
				:keys="selectedEntity?.entity.accounts"
				label="Verknüpfte Accounts"
				route="accounts"
			/>
			<DetailsPanelSection
				:items="places"
				:keys="selectedEntity?.entity.places"
				label="Verknüpfte Orte"
				route="places"
			/>
			<DetailsPanelSection
				:items="ideas"
				:keys="selectedEntity?.entity.ideas"
				label="Verknüpfte Ideen"
				route="ideas"
			/>
			<DetailsPanelQuotes
				v-if="selectedEntity?.kind === 'idea'"
				:items="selectedEntity?.entity.quotes"
				label="Zitate"
			/>
		</DetailsPanel>

		<InfoDialog title="Info">
			<div>Klick auf Idee/Religionsgruppe: hebt den Knoten hervor und öffnet das Kontext-Menü</div>
			<div>Suche nach Ideen: hebt die gesuchte Idee und damit assoziierte Ideen hervor</div>
			<div>
				Suche nach einer Religionsgruppen: hebt alle Accounts hervor, die mit einer Religionsgruppe
				assoziiert sind
			</div>
			<div>
				Suche nach mehreren Religionsgruppen: zeigt alle Ideen, die mit den jeweiligen Religionen
				assoziiert sind in der Farbe der Religionen; Ideen, an denen sich mehrere der ausgewählten
				Religionen "treffen", werden gesondert hervorgehoben
			</div>
		</InfoDialog>
	</MainContent>
</template>
