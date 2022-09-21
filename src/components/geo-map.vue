<script lang="ts" setup>
import 'leaflet/dist/leaflet.css'

import { entries, keys } from '@stefanprobst/object'
import type { FeatureGroup, Map as LeafletMap } from 'leaflet'
import { circleMarker, featureGroup, map as createMap, tileLayer } from 'leaflet'
import { onMounted, onUnmounted, watch } from 'vue'

import ZoomControls from '@/components/zoom-controls.vue'
import { config, initialViewState, marker } from '@/config/geo-map.config'
import type { Place } from '@/db/types'

//

export interface Point {
  place: Place
  options: {
    fillColor: string
    fillOpacity: number
    strokeColor: string
    strokeOpacity: number
  }
}

export interface PointLayers {
  base: Array<Point>
  highlight: Array<Point>
}

interface GeoMapState {
  map: LeafletMap | null
  featureGroups: { [Key in keyof PointLayers]: FeatureGroup | null }
}

//

const props = defineProps<{
  layers: PointLayers
}>()

const emit = defineEmits<{
  (event: 'click-place', place: Place): void
}>()

//

function onClickPlace(place: Place) {
  emit('click-place', place)
}

const geomap: GeoMapState = { map: null, featureGroups: { base: null, highlight: null } }

onMounted(() => {
  /**
   * Initialize leaflet map and attach to `#map` element..
   */
  const map = createMap('map', config.options).setView(
    initialViewState.center,
    initialViewState.zoom,
  )

  geomap.map = map

  /**
   * Add base layer to map.
   */
  tileLayer(config.tileLayer.url, {
    attribution: config.tileLayer.attribution,
    minZoom: 3,
  }).addTo(map)

  /**
   * Initialize circle-marker layer groups.
   */
  keys(geomap.featureGroups).forEach((key) => {
    const group = featureGroup().addTo(map)
    geomap.featureGroups[key] = group
  })

  /**
   * Draw points.
   */
  updateLayers()
})

watch(() => {
  return props.layers
}, updateLayers)

onUnmounted(() => {
  geomap.map?.remove()
})

/**
 * Clear circle-marker layer groups and redraw.
 */
function updateLayers() {
  entries(props.layers).forEach(([key, points]) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const group = geomap.featureGroups[key]!
    group.clearLayers()
    group.bringToFront()

    points.forEach((point) => {
      group.addLayer(
        circleMarker(point.place.coordinates, {
          fillColor: point.options.fillColor,
          fillOpacity: point.options.fillOpacity,
          color: point.options.strokeColor,
          opacity: point.options.strokeOpacity,
          weight: marker.strokeWidth,
          radius: marker.radius,
        })
          .on('click', () => {
            onClickPlace(point.place)
          })
          .bindTooltip(point.place.label),
      )
    })
  })
}

//

function onZoomIn() {
  geomap.map?.zoomIn()
}

function onZoomOut() {
  geomap.map?.zoomOut()
}

function onResetZoom() {
  geomap.map?.setZoom(initialViewState.zoom)
}
</script>

<template>
  <div id="map" class="h-full w-full"></div>
  <zoom-controls @zoom-in="onZoomIn" @zoom-out="onZoomOut" @zoom-reset="onResetZoom" />
</template>

<style>
.leaflet-container {
  isolation: isolate;

  &:focus {
    outline: none;
  }
}
</style>
