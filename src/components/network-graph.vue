<script lang="ts" setup>
import { forceCollide } from 'd3'
import type { LinkObject, NodeObject } from 'force-graph'
import ForceGraph from 'force-graph'
import { onMounted, onUnmounted, ref, watch } from 'vue'

import ZoomControls from '@/components/zoom-controls.vue'
import { edgeStrokeColor, nodeColors, nodeSizes } from '@/config/network-graph.config'

//

export interface Graph {
  nodes: { fixed: Array<NodeObject>; dynamic: Array<NodeObject> }
  edges: Array<LinkObject>
}

//

const props = defineProps<{
  width: number
  height: number
  graph: Graph
  highlighted: Set<NodeObject['key']>
  selected: Set<NodeObject['key']>
}>()

const emit = defineEmits<{
  (event: 'click-node', node: NodeObject['key'], kind: NodeObject['kind']): void
}>()

//

/**
 * Fixed nodes are positioned equally spaced on a circle.
 */
const _angle = 360 / props.graph.nodes.fixed.length
props.graph.nodes.fixed.forEach((node, index) => {
  const radius = Math.min(props.width, props.height) * 0.75
  const angle = _angle * index
  const x = radius * Math.sin((Math.PI * 2 * angle) / 360)
  const y = radius * Math.cos((Math.PI * 2 * angle) / 360)
  node.fx = node.x = x
  node.fy = node.y = y
})

//

const transitionDuration = 500

const nodeRelativeSize = 6

function nodeValue(node: NodeObject) {
  return nodeSizes[node.kind]
}

function nodeColor(node: NodeObject) {
  if (props.selected.has(node.key)) return nodeColors.selected
  if (props.highlighted.has(node.key)) return nodeColors.highlighted
  return nodeColors[node.kind]
}

function edgeColor(edge: LinkObject) {
  if (props.selected.has(edge.source?.key) || props.selected.has(edge.target?.key)) {
    return nodeColors.selected
  }
  return edgeStrokeColor
}

const element = ref<HTMLElement | null>(null)
const graph = ForceGraph()

// @ts-expect-error upstream types don't allow `null`.
graph.d3Force('center', null)
// graph.d3Force('charge').strength(-100)
graph.d3Force('link')?.['distance'](50)
graph.d3Force(
  'collision',
  forceCollide<NodeObject>().radius((node) => {
    return nodeValue(node) * nodeRelativeSize + 2 /** padding */
  }),
)

graph.width(props.width)
graph.height(props.height)
graph.maxZoom(5)
graph.minZoom(0.25)

graph.nodeRelSize(nodeRelativeSize)
graph.nodeVal(nodeValue)
graph.nodeColor(nodeColor)
graph.nodeLabel((node) => {
  if (node.kind === 'interview-religion') return ''
  return node.label
})
graph.nodeCanvasObjectMode((node) => {
  if (node.kind === 'interview-religion') return 'after'
  return undefined
})
graph.nodeCanvasObject((node, ctx, globalScale) => {
  const label = node.label
  const fontSize = Math.max(12 / globalScale, 3)
  ctx.font = `500 ${fontSize}px InterVariable, ui-sans-serif, system-ui, sans-serif`
  const textWidth = ctx.measureText(label).width
  const bckgDimensions = [textWidth, fontSize].map((n) => {
    return n + fontSize * 0.25 /** padding */
  }) as [number, number]

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const x = node.x!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const y = node.y!

  ctx.fillStyle = '#ffffff7f' // nodeColor(node)
  ctx.fillRect(x - bckgDimensions[0] / 2, y - bckgDimensions[1] / 2, ...bckgDimensions)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'hsl(175.9deg 38.6% 38.8%)'
  ctx.fillText(label, x, y)
})
graph.enableNodeDrag(false)

graph.linkColor(edgeColor)

graph.nodeId('key')
graph.graphData({
  nodes: [...props.graph.nodes.dynamic, ...props.graph.nodes.fixed],
  links: props.graph.edges,
})

graph.onNodeClick((node) => {
  emit('click-node', node.key, node.kind)
})

function onZoomIn() {
  graph.zoom(graph.zoom() * 1.25, transitionDuration)
}

function onZoomOut() {
  graph.zoom(graph.zoom() * 0.75, transitionDuration)
}

function onZoomToFit() {
  graph.zoomToFit(transitionDuration)
}

//

watch(
  [
    () => {
      return props.highlighted
    },
    () => {
      return props.selected
    },
  ],
  () => {
    /**
     * Trigger redraw, to avoid keeping the simulation running permanently with `graph.autoPauseRedraw(false)`.
     */
    graph.nodeRelSize(nodeRelativeSize)
  },
)

watch(
  [
    () => {
      return props.width
    },
    () => {
      return props.height
    },
  ],
  () => {
    graph.width(props.width)
    graph.height(props.height)
  },
)

//

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  graph(element.value!)
})

onUnmounted(() => {
  graph._destructor()
})
</script>

<template>
  <div ref="element" data-graph="" class="grid h-full w-full" />
  <zoom-controls @zoom-in="onZoomIn" @zoom-out="onZoomOut" @zoom-reset="onZoomToFit" />
</template>

<style>
[data-graph] .force-graph-container .graph-tooltip {
  font-size: 12px;
  font-family: InterVariable, ui-sans-serif, system-ui, sans-serif;
  text-align: center;
}
</style>