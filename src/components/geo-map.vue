<script lang="ts" setup>
import "leaflet/dist/leaflet.css";

import { MapIcon } from "@heroicons/vue/24/outline";
import { entries, keys } from "@stefanprobst/object";
import { type FeatureGroup, type Map as LeafletMap } from "leaflet";
import { circleMarker, featureGroup, map as createMap, tileLayer } from "leaflet";
import { onMounted, onUnmounted, watch } from "vue";

import ZoomControls from "@/components/zoom-controls.vue";
import { config, initialViewState, marker } from "@/config/geo-map.config";
import { type Place } from "@/db/types";

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

interface GeoMapState {
	map: LeafletMap | null;
	featureGroups: { [Key in keyof PointLayers]: FeatureGroup | null };
}

//

const props = defineProps<{
	layers: PointLayers;
}>();

const emit = defineEmits<{
	(event: "click-place", place: Place): void;
	(event: "map-ready", map: LeafletMap): void;
}>();

//

function onClickPlace(place: Place) {
	emit("click-place", place);
}

const geomap: GeoMapState = {
	map: null,
	featureGroups: { base: null, highlight: null, selected: null },
};

onMounted(() => {
	/**
	 * Initialize leaflet map and attach to `#map` element..
	 */
	const map = createMap("map", config.options).setView(
		initialViewState.center,
		initialViewState.zoom,
	);

	geomap.map = map;
	emit("map-ready", map);

	/**
	 * Add base layer to map.
	 */
	tileLayer(config.tileLayer.url, {
		attribution: config.tileLayer.attribution,
		minZoom: 3,
	}).addTo(map);

	/**
	 * Initialize circle-marker layer groups.
	 */
	keys(geomap.featureGroups).forEach((key) => {
		const group = featureGroup().addTo(map);
		geomap.featureGroups[key] = group;
	});

	/**
	 * Draw points.
	 */
	updateLayers();
});

watch(() => {
	return props.layers;
}, updateLayers);

onUnmounted(() => {
	geomap.map?.remove();
});

/**
 * Clear circle-marker layer groups and redraw.
 */
function updateLayers() {
	entries(props.layers).forEach(([key, points]) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const group = geomap.featureGroups[key]!;
		group.clearLayers();
		group.bringToFront();

		points.forEach((point) => {
			group.addLayer(
				circleMarker(point.place.coordinates, {
					fillColor: point.options.fillColor,
					fillOpacity: point.options.fillOpacity,
					color: point.options.strokeColor,
					opacity: point.options.strokeOpacity,
					weight: point.options.strokeWidth,
					radius: marker.radius,
				})
					.on("click", () => {
						onClickPlace(point.place);
					})
					.bindTooltip(point.place.label),
			);
		});
	});
}

//

function onZoomIn() {
	geomap.map?.zoomIn();
}

function onZoomOut() {
	geomap.map?.zoomOut();
}

function onResetZoom() {
	geomap.map?.setView(initialViewState.center, initialViewState.zoom);
}

function onFitWorld() {
	geomap.map?.fitWorld();
}
</script>

<template>
	<div id="map" class="h-full w-full"></div>
	<zoom-controls @zoom-in="onZoomIn" @zoom-out="onZoomOut" @zoom-reset="onResetZoom">
		<button
			aria-label="Fit to world"
			class="grid h-8 w-8 place-items-center rounded-full border-2 border-brand-red bg-brand-red-tint shadow-lg transition hover:bg-brand-red"
			@click="onFitWorld"
		>
			<map-icon aria-hidden="true" class="h-4 w-4" />
		</button>
	</zoom-controls>
</template>

<style>
.leaflet-container {
	isolation: isolate;

	&:focus {
		outline: none;
	}
}
</style>
