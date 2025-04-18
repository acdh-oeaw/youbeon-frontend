<script lang="ts" setup>
import type { Map as LeafletMap } from "leaflet";
import { computed, nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import DetailsPanel from "@/components/details-panel.vue";
import DetailsPanelSection from "@/components/details-panel-section.vue";
import FiltersPanel from "@/components/filters-panel.vue";
import GeoMap, { type Point, type PointLayers } from "@/components/geo-map.vue";
import InfoDialog from "@/components/info-dialog.vue";
import MainContent from "@/components/main-content.vue";
import MultiCombobox from "@/components/multi-combobox.vue";
import SingleSelect from "@/components/single-select.vue";
import { colors, marker, strokes } from "@/config/geo-map.config";
import { accounts, ideas, interviewReligions, interviews, places } from "@/db";
import type {
	Interview,
	InterviewReligion,
	Place,
	Resource,
	ResourceKeyMap,
	ResourceKind,
	ResourceMap,
} from "@/db/types";

//

type PlaceFilters = Pick<ResourceKeyMap, "idea" | "interview-religion" | "place">;
type PlaceFilterKind = keyof PlaceFilters;
type LabeledPlaceFilterKinds = Map<PlaceFilterKind, { key: PlaceFilterKind; label: string }>;
type PlaceFilterItems = Pick<ResourceMap, "idea" | "interview-religion" | "place">;

function createPlaceFilterItems(): PlaceFilterItems {
	const ideasWithPlaces = new Map();

	ideas.forEach((idea, key) => {
		if (idea.places.size > 0) {
			ideasWithPlaces.set(key, idea);
		}
	});

	return {
		idea: ideasWithPlaces,
		"interview-religion": interviewReligions,
		place: places,
	};
}

const placeFilterItems = createPlaceFilterItems();

const labeledPlaceFilterKinds: LabeledPlaceFilterKinds = new Map([
	["idea", { key: "idea", label: "Ideen" }],
	["interview-religion", { key: "interview-religion", label: "Religionen" }],
	["place", { key: "place", label: "Orte" }],
]);

const placeFilters = ref<PlaceFilters>({
	idea: new Set(),
	"interview-religion": new Set(),
	place: new Set(),
});
const defaultPlaceFilterKind = "interview-religion";
const placeFilterKind = ref<PlaceFilterKind>(defaultPlaceFilterKind);

const selectedEntity = ref<
	| { entity: InterviewReligion; kind: "interview-religion" }
	| { entity: Place; kind: "place" }
	| null
>(null);

//

function getInterviewReligions(keys: Set<Interview["key"]> | undefined) {
	const religions = new Set<InterviewReligion["key"]>();
	if (keys == null) return religions;
	keys.forEach((key) => {
		religions.add(interviews.get(key)!.religion);
	});
	return religions;
}

function getColor(key: Resource["key"], kind: ResourceKind = placeFilterKind.value) {
	switch (kind) {
		case "place":
			return colors[kind];
		case "idea":
		case "interview-religion":
			return colors[kind][key]!;
		default:
			return colors.default;
	}
}

//

const points = computed(() => {
	function createPoint(place: Place, options?: Partial<Point["options"]>): Point {
		return {
			place,
			options: {
				fillColor: colors.default,
				fillOpacity: marker.fillOpacity,
				strokeColor: marker.strokeColor,
				strokeOpacity: marker.strokeOpacity,
				strokeWidth: marker.strokeWidth,
				...options,
			},
		};
	}

	let matches = 0;
	/** Whether to display the help text for multiple matches in the legend. */
	let hasMultipleMatches = false;

	const layers: PointLayers = { base: [], highlight: [], selected: [] };

	const selectedPointOptions = {
		strokeColor: strokes.selected.color,
		strokeWidth: strokes.selected.width,
		strokeOpacity: strokes.selected.opacity,
	};

	if (
		Object.values(placeFilters.value).every((filter) => {
			return filter.size === 0;
		})
	) {
		/**
		 * If no filters have been applied we render a single circle-marker layer.
		 * All points have the default color.
		 */
		places.forEach((place) => {
			if (selectedEntity.value?.kind === "place" && place.key === selectedEntity.value.entity.key) {
				layers.selected.push(createPoint(selectedEntity.value.entity, selectedPointOptions));
			} else {
				layers.base.push(createPoint(place));
			}
		});
	} else {
		/**
		 * If filters have been applied, render a circle-marker layer, with points for each place
		 * matching the selected filters, on top of a circle-marker layer for non-matching places.
		 * Highlight color is determined by which filter is matched. In cases where more than one
		 * filter is matched, a "multiple matches" color is applied.
		 */
		places.forEach((place) => {
			const highlights: Array<{ kind: ResourceKind; key: Resource["key"] }> = [];

			if (placeFilters.value.place.has(place.key)) {
				highlights.push({ kind: "place", key: place.key });
			}

			for (const key of placeFilters.value.idea) {
				if (place.ideas.has(key)) {
					highlights.push({ kind: "idea", key });
				}
			}

			for (const key of placeFilters.value["interview-religion"]) {
				for (const _key of place.interviews) {
					const interview = interviews.get(_key);
					if (interview?.religion === key) {
						highlights.push({ kind: "interview-religion", key });
						break;
					}
				}
			}

			function getPointOptions() {
				if (highlights.length === 0) {
					return { fillColor: colors.muted };
				} else if (highlights.length > 1) {
					return { fillColor: colors.multiple };
				} else {
					const highlight = highlights[0]!;
					const fillColor = getColor(highlight.key, highlight.kind);
					return { fillColor };
				}
			}

			if (highlights.length > 0) {
				matches++;
				if (highlights.length > 1) {
					hasMultipleMatches = true;
				}
			}

			if (selectedEntity.value?.kind === "place" && place.key === selectedEntity.value.entity.key) {
				layers.selected.push(createPoint(place, { ...getPointOptions(), ...selectedPointOptions }));
			} else if (highlights.length === 0) {
				layers.base.push(createPoint(place, getPointOptions()));
			} else {
				layers.highlight.push(createPoint(place, getPointOptions()));
			}
		});
	}

	return { layers, matches, hasMultipleMatches };
});

//

const map = ref<LeafletMap | null>(null);

function onMapReady(leaflet: LeafletMap) {
	map.value = leaflet;

	/**
	 * Center the map when an initial place filter was set via search params.
	 */
	if (placeFilterKind.value === "place" && placeFilters.value.place.size > 0) {
		const id = placeFilters.value.place.values().next().value!;
		const place = places.get(id);
		if (place?.coordinates) {
			map.value.setView(place.coordinates);
		}
	}
}

//

const route = useRoute();
const router = useRouter();

function isFilterKind(value: string): value is PlaceFilterKind {
	return Object.keys(placeFilterItems).includes(value);
}

function syncFiltersWithSearchParams() {
	const searchParams = new URLSearchParams(window.location.search);
	const detailsId = searchParams.get("details-id");
	const detailsKind = searchParams.get("details-kind");
	const ids = searchParams.getAll("id").filter(Boolean);
	const kind = searchParams.get("kind") ?? defaultPlaceFilterKind;

	const isPlaceDetailsVisible =
		detailsId != null &&
		detailsKind != null &&
		isValidDetailsKind(detailsKind) &&
		placeFilterItems[detailsKind].has(detailsId);

	if (isFilterKind(kind)) {
		const keys = new Set<Resource["key"]>();

		ids.forEach((key) => {
			if (placeFilterItems[kind].has(key)) {
				keys.add(key);
			}
		});

		placeFilters.value = {
			idea: new Set(),
			"interview-religion": new Set(),
			place: new Set(),
			[kind]: keys,
		};

		placeFilterKind.value = kind;

		if (kind === "place" && keys.size > 0 && !isPlaceDetailsVisible) {
			if (keys.size === 1) {
				/**
				 * Center the map on the first selected place.
				 */
				const id = keys.values().next().value!;
				const place = places.get(id);
				if (place?.coordinates) {
					if (map.value != null) {
						map.value.setView(place.coordinates);
					} else {
						void nextTick(() => {
							map.value?.setView(place.coordinates);
						});
					}
				}
			} else {
				/**
				 * Fit selected places in map bounds.
				 */
				const lat: Array<number> = [];
				const lng: Array<number> = [];
				keys.forEach((id) => {
					const place = places.get(id);
					if (place?.coordinates) {
						lat.push(place.coordinates.lat);
						lng.push(place.coordinates.lng);
					}
				});
				if (lat.length !== 0 && lng.length !== 0) {
					if (map.value != null) {
						map.value.fitBounds(
							[
								[Math.min(...lat), Math.min(...lng)],
								[Math.max(...lat), Math.max(...lng)],
							],
							{ paddingTopLeft: [0, 150] },
						);
					} else {
						void nextTick(() => {
							map.value?.fitBounds(
								[
									[Math.min(...lat), Math.min(...lng)],
									[Math.max(...lat), Math.max(...lng)],
								],
								{ paddingTopLeft: [0, 150] },
							);
						});
					}
				}
			}
		}
	}

	function isValidDetailsKind(value: string): value is "interview-religion" | "place" {
		return ["place", "interview-religion"].includes(value);
	}

	if (isPlaceDetailsVisible) {
		selectedEntity.value = {
			entity: placeFilterItems[detailsKind].get(detailsId)!,
			kind: detailsKind,
		} as
			| { entity: InterviewReligion; kind: "interview-religion" }
			| { entity: Place; kind: "place" };

		/**
		 * Center the map on the place selected in the details panel.
		 */
		const id = detailsId;
		const place = places.get(id);
		if (place?.coordinates) {
			if (map.value != null) {
				map.value.setView(place.coordinates);
			} else {
				void nextTick(() => {
					map.value?.setView(place.coordinates);
				});
			}
		}
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

function onClickPlace(place: Place) {
	void router.push({ query: { ...route.query, "details-id": place.key, "details-kind": "place" } });
}

function onChangePlaceFilterKind(kind: string) {
	void router.push({ query: { ...route.query, kind: kind as PlaceFilterKind } });
}

function onChangePlaceFilters(id: Array<Resource["key"]>) {
	void router.push({ query: { ...route.query, id } });
}

function onCloseDetailsPanel() {
	const { "details-id": _, "details-kind": __, ...query } = route.query;
	void router.push({ query });
}
</script>

<template>
	<MainContent class="h-full overflow-hidden">
		<h1 class="sr-only">{{ $router.currentRoute.value.meta["title"] }}</h1>

		<GeoMap :layers="points.layers" @click-place="onClickPlace" @map-ready="onMapReady" />

		<FiltersPanel
			id="places-filters"
			class="grid items-start gap-4 sm:grid-cols-[1fr_auto]"
			name="places-filters"
		>
			<MultiCombobox
				:get-tag-color="getColor"
				:items="placeFilterItems[placeFilterKind]"
				:label="labeledPlaceFilterKinds.get(placeFilterKind)!.label"
				:model-value="Array.from(placeFilters[placeFilterKind])"
				name="active-places-filters"
				@update:model-value="onChangePlaceFilters"
			/>
			<SingleSelect
				class="min-w-32 flex-1"
				:items="labeledPlaceFilterKinds"
				label="Filter-Kategorie"
				:model-value="placeFilterKind"
				name="places-filter-kind"
				@update:model-value="onChangePlaceFilterKind"
			/>
			<div v-if="points.matches > 0" class="flex items-center gap-2 text-xs">
				<span>{{ points.matches }} Treffer.</span>
				<span v-if="points.hasMultipleMatches">
					Gemeinsame Orte
					<span
						class="mx-1 inline-block size-2.5 rounded-full"
						:style="{ backgroundColor: colors.multiple }"
					/>
				</span>
			</div>
		</FiltersPanel>

		<DetailsPanel
			:key="selectedEntity?.entity.key"
			:is-open="selectedEntity != null && selectedEntity.kind === 'place'"
			:title="selectedEntity?.entity.label"
			@close-panel="onCloseDetailsPanel"
		>
			<DetailsPanelSection
				:items="ideas"
				:keys="selectedEntity?.entity.ideas"
				label="Verknüpfte Ideen"
				route="ideas"
			/>
			<DetailsPanelSection
				:items="interviewReligions"
				:keys="getInterviewReligions(selectedEntity?.entity.interviews)"
				label="Verknüpfte Religionsgruppen"
			/>
			<DetailsPanelSection
				:items="accounts"
				:keys="selectedEntity?.entity.accounts"
				label="Verknüpfte Accounts"
				route="accounts"
			/>
		</DetailsPanel>

		<InfoDialog title="Info">
			<div>Klick auf Ort: hebt den Ort hervor und öffnet das Kontext-Menü</div>
			<div>Suche nach Orten: hebt den gesuchten Ort hervor</div>
			<div>
				Suche nach Ideen: hebt alle Orte hervor, die mit einer bestimmten Idee assoziiert sind
			</div>
			<div>
				Suche nach einer Religionsgruppe: hebt alle Orte hervor, die von Interviewteilnehmer*innen
				einer Religionsgruppe genannt wurden.
			</div>
			<div>
				Suche nach mehreren Religionsgruppen: hebt alle Orte hervor, die mit den jeweiligen
				Religionen assoziiert sind in der Farbe der Religionen; Orte, an denen sich mehrere der
				ausgewählten Religionen "treffen", werden gesondert hervorgehoben
			</div>
		</InfoDialog>
	</MainContent>
</template>
