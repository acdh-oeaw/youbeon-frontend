<script lang="ts" setup>
import "maplibre-gl/dist/maplibre-gl.css";

import { MapIcon } from "@heroicons/vue/24/outline";
import { entries } from "@stefanprobst/object";
import { type GeoJSONSource, Map as MapLibreMap, Popup, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { onMounted, onUnmounted, ref, watch } from "vue";

import ZoomControls from "@/components/zoom-controls.vue";
import { config, initialViewState, marker } from "@/config/geo-map.config";
import type { Place } from "@/db/types";

//

export interface Point {
	place: Place;
	options: {
		fillColor: string;
		fillOpacity: number;
		strokeColor: string;
		strokeOpacity: number;
		strokeWidth: number;
	};
}

export interface PointLayers {
	base: Array<Point>;
	highlight: Array<Point>;
	selected: Array<Point>;
}

//

const props = defineProps<{
	layers: PointLayers;
}>();

const emit = defineEmits<{
	(event: "click-place", place: Place): void;
	(event: "map-ready", map: MapLibreMap): void;
}>();

//

const sourceId = "places";
const layerIds = {
	base: "places-base",
	highlight: "places-highlight",
	selected: "places-selected",
} satisfies Record<keyof PointLayers, string>;

const mapContainer = ref<HTMLElement | null>(null);
const mapError = ref(false);

let map: MapLibreMap | null = null;
let popup: Popup | null = null;
let isStyleLoaded = false;
let placesByKey = new Map<Place["key"], Place>();

setWorkerUrl(workerUrl);

onMounted(() => {
	if (mapContainer.value == null) return;

	try {
		map = new MapLibreMap({
			container: mapContainer.value,
			style: config.styleUrl,
			center: [initialViewState.center[1], initialViewState.center[0]],
			zoom: initialViewState.zoom,
			attributionControl: { compact: true },
		});
	} catch {
		mapError.value = true;
		return;
	}

	emit("map-ready", map);

	map.on("load", () => {
		if (map == null) return;

		isStyleLoaded = true;
		map.addSource(sourceId, { type: "geojson", data: createFeatureCollection() });

		entries(layerIds).forEach(([key, layerId]) => {
			map?.addLayer({
				id: layerId,
				type: "circle",
				source: sourceId,
				filter: ["==", ["get", "layer"], key],
				paint: {
					"circle-radius": marker.radius,
					"circle-color": ["get", "fillColor"],
					"circle-opacity": ["get", "fillOpacity"],
					"circle-stroke-color": ["get", "strokeColor"],
					"circle-stroke-opacity": ["get", "strokeOpacity"],
					"circle-stroke-width": ["get", "strokeWidth"],
				},
			});
		});

		const interactiveLayerIds = Object.values(layerIds);
		popup = new Popup({ closeButton: false, closeOnClick: false });

		map.on("mouseenter", interactiveLayerIds, (event) => {
			if (map == null) return;
			const label = event.features?.[0]?.properties["label"];
			if (typeof label !== "string") return;

			map.getCanvas().style.cursor = "pointer";
			popup?.setText(label).trackPointer().addTo(map);
		});

		map.on("mouseleave", interactiveLayerIds, () => {
			if (map == null) return;
			map.getCanvas().style.cursor = "";
			popup?.remove();
		});

		map.on("click", interactiveLayerIds, (event) => {
			const key = event.features?.[0]?.properties["key"];
			if (typeof key !== "string") return;
			const place = placesByKey.get(key);
			if (place != null) emit("click-place", place);
		});
	});
});

watch(
	() => {
		return props.layers;
	},
	() => {
		if (!isStyleLoaded) return;
		const source = map?.getSource(sourceId) as GeoJSONSource | undefined;
		void source?.setData(createFeatureCollection());
	},
);

onUnmounted(() => {
	popup?.remove();
	map?.remove();
	map = null;
});

function createFeatureCollection() {
	placesByKey = new Map();

	return {
		type: "FeatureCollection" as const,
		features: entries(props.layers).flatMap(([layer, points]) => {
			return points.map((point) => {
				placesByKey.set(point.place.key, point.place);

				return {
					type: "Feature" as const,
					id: point.place.key,
					geometry: {
						type: "Point" as const,
						coordinates: [point.place.coordinates.lng, point.place.coordinates.lat],
					},
					properties: {
						key: point.place.key,
						label: point.place.label,
						layer,
						...point.options,
					},
				};
			});
		}),
	};
}

//

function onZoomIn() {
	map?.zoomIn();
}

function onZoomOut() {
	map?.zoomOut();
}

function onResetZoom() {
	map?.jumpTo({
		center: [initialViewState.center[1], initialViewState.center[0]],
		zoom: initialViewState.zoom,
	});
}

function onFitWorld() {
	map?.fitBounds(
		[
			[-180, -85],
			[180, 85],
		],
		{ duration: 0 },
	);
}
</script>

<template>
	<div ref="mapContainer" class="size-full"></div>
	<div
		v-if="mapError"
		class="absolute inset-0 grid place-items-center bg-neutral-100 p-6 text-center"
		role="alert"
	>
		<p>Die Karte kann auf diesem Gerät nicht angezeigt werden.</p>
	</div>
	<ZoomControls @zoom-in="onZoomIn" @zoom-out="onZoomOut" @zoom-reset="onResetZoom">
		<button
			aria-label="Fit to world"
			class="grid size-8 place-items-center rounded-full border-2 border-brand-red bg-brand-red-tint shadow-lg transition hover:bg-brand-red"
			@click="onFitWorld"
		>
			<MapIcon aria-hidden="true" class="size-4" />
		</button>
	</ZoomControls>
</template>

<style>
.maplibregl-map {
	isolation: isolate;

	&:focus {
		outline: none;
	}
}
</style>
