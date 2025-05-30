<script lang="ts" setup>
import { forceCollide } from "d3";
import ForceGraph, { type LinkObject, type NodeObject } from "force-graph";
import { onMounted, onUnmounted, ref, watch } from "vue";

import ZoomControls from "@/components/zoom-controls.vue";
import { highlightedNodeColors, nodeColors, nodeSizes } from "@/config/network-graph.config";

//

export interface Graph {
	nodes: { fixed: Array<NodeObject>; dynamic: Array<NodeObject> };
	edges: Array<LinkObject>;
}

//

const props = defineProps<{
	width: number;
	height: number;
	graph: Graph;
	highlighted: Map<NodeObject["key"], number>;
	matched: Set<NodeObject["key"]>;
	selected: NodeObject | null | undefined;
	edgeStrokeColor: string;
	highlightedEdgeStrokeColor: string;
}>();

const emit =
	defineEmits<(event: "click-node", node: NodeObject["key"], kind: NodeObject["kind"]) => void>();

//

/**
 * Fixed nodes are positioned equally spaced on a circle.
 */
const _angle = 360 / props.graph.nodes.fixed.length;
const rad = (Math.PI * 2) / 360;
props.graph.nodes.fixed.forEach((node, index) => {
	const radius = Math.min(props.width, props.height) * 0.75;
	const angle = _angle * index;
	const x = radius * Math.sin(angle * rad);
	const y = radius * Math.cos(angle * rad);
	node.fx = node.x = x;
	node.fy = node.y = y;
});

//

const transitionDuration = 500;

const nodeRelativeSize = 6;

function nodeValue(node: NodeObject) {
	return nodeSizes[node.kind];
}

function nodeColor(node: NodeObject) {
	if (props.matched.has(node.key)) return highlightedNodeColors[node.kind].selected;
	if (props.highlighted.has(node.key)) {
		if (props.highlighted.get(node.key)! > 1) {
			return highlightedNodeColors[node.kind].multiple;
		}
		return highlightedNodeColors[node.kind].highlighted;
	}
	return nodeColors[node.kind];
}

function edgeColor(edge: LinkObject) {
	// @ts-expect-error Source and target should already be resolved to objects here.
	if (props.matched.has(edge.source?.key) || props.matched.has(edge.target?.key)) {
		return props.highlightedEdgeStrokeColor;
	}
	return props.edgeStrokeColor;
}

function edgeWidth(edge: LinkObject) {
	// @ts-expect-error Source and target should already be resolved to objects here.
	if (props.matched.has(edge.source?.key) || props.matched.has(edge.target?.key)) {
		return 3;
	}
	return 1;
}

const element = ref<HTMLElement | null>(null);
// eslint-disable-next-line vue/no-dupe-keys
const graph = ForceGraph();

graph.d3Force("center", null);
// graph.d3Force('charge').strength(-100)
graph.d3Force("link")?.distance(50);
graph.d3Force(
	"collision",
	forceCollide<NodeObject>().radius((node) => {
		return nodeValue(node) * nodeRelativeSize + 2; /** padding */
	}),
);

graph.width(props.width);
graph.height(props.height);
graph.maxZoom(5);
graph.minZoom(0.25);

graph.nodeRelSize(nodeRelativeSize);
graph.nodeVal(nodeValue);
graph.nodeColor(nodeColor);
graph.nodeLabel((node) => {
	if (node.kind === "interview-religion") return "";
	return node.label;
});
graph.nodeCanvasObjectMode(() => {
	return "after";
});
graph.nodeCanvasObject((node, ctx, globalScale) => {
	/**
	 * Draw outline around selected node.
	 */
	if (node.key === props.selected?.key) {
		ctx.beginPath();

		ctx.arc(node.x!, node.y!, nodeValue(node) * nodeRelativeSize + 2, 0, 360);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke();
		return;
	}

	/**
	 * Draw permanent label on top of `interview-religion` nodes, labels for other
	 * nodes are only visible when zoomed in.
	 */
	if (node.kind !== "interview-religion" && globalScale < 1.5) return;

	const label = node.label;
	const fontSize = Math.max(12 / globalScale, 3);
	ctx.font = `500 ${fontSize}px InterVariable, ui-sans-serif, system-ui, sans-serif`;
	const textWidth = ctx.measureText(label).width;
	const dimensions = [textWidth, fontSize].map((n) => {
		return n + fontSize * 0.25; /** padding */
	}) as [number, number];

	const x = node.x!;

	const y = node.y!;

	ctx.fillStyle = "#ffffff7f"; // nodeColor(node)
	ctx.fillRect(x - dimensions[0] / 2, y - dimensions[1] / 2, ...dimensions);

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#333";
	ctx.fillText(label, x, y);

	// @ts-expect-error It's fine.
	node.__dimensions = dimensions;
});
graph.nodePointerAreaPaint((node, color, ctx) => {
	ctx.fillStyle = color;

	ctx.beginPath();

	ctx.arc(node.x!, node.y!, nodeValue(node) * nodeRelativeSize + 2, 0, 360);
	ctx.fill();

	if (!("__dimensions" in node)) return;

	/**
	 * Increase clickable area for `interview-religion` nodes to include the text label.
	 */
	const dimensions = node.__dimensions as [number, number];

	ctx.fillRect(node.x! - dimensions[0] / 2, node.y! - dimensions[1] / 2, ...dimensions);
});
graph.enableNodeDrag(false);

graph.linkColor(edgeColor);
graph.linkWidth(edgeWidth);

graph.nodeId("key");
graph.graphData({
	nodes: [...props.graph.nodes.dynamic, ...props.graph.nodes.fixed],
	links: props.graph.edges,
});

graph.onNodeClick((node) => {
	emit("click-node", node.key, node.kind);
});

function onZoomIn() {
	graph.zoom(graph.zoom() * 1.25, transitionDuration);
}

function onZoomOut() {
	graph.zoom(graph.zoom() * 0.75, transitionDuration);
}

function onZoomToFit() {
	graph.zoomToFit(transitionDuration);
}

//

watch(
	[
		() => {
			return props.highlighted;
		},
		() => {
			return props.matched;
		},
	],
	() => {
		/**
		 * Trigger redraw, to avoid keeping the simulation running permanently with `graph.autoPauseRedraw(false)`.
		 */
		graph.nodeRelSize(nodeRelativeSize);
	},
);

watch(
	[
		() => {
			return props.width;
		},
		() => {
			return props.height;
		},
	],
	() => {
		graph.width(props.width);
		graph.height(props.height);
	},
);

//

watch(
	() => {
		return props.highlighted;
	},
	() => {
		/**
		 * Ensure highlighted nodes and edges end up on top. Canvas has no z-index so we need to control
		 * paint order via array index, i.e. sorting highlighted nodes to the end of the array.
		 *
		 * Note that we rely on a patched `force-graph` to *not* reheat the simulation when we provide
		 * a new sorted nodes array - this is ok here since we only change the order, but the nodes
		 * themselves are constant.
		 */
		const edges = props.graph.edges.slice().sort((a) => {
			const source = typeof a.source === "string" ? a.source : (a.source as NodeObject).key;
			const target = typeof a.target === "string" ? a.target : (a.target as NodeObject).key;

			return props.highlighted.has(source) || props.highlighted.has(target) ? 1 : -1;
		});
		const dynamic = props.graph.nodes.dynamic.slice().sort((a) => {
			const key = typeof a === "string" ? a : a.key;

			return props.highlighted.has(key) ? 1 : -1;
		});
		graph.graphData({ nodes: [...dynamic, ...props.graph.nodes.fixed], links: edges });
	},
);

//

onMounted(() => {
	graph(element.value!);
});

onUnmounted(() => {
	graph._destructor();
});
</script>

<template>
	<div ref="element" class="grid size-full" data-graph="" />
	<ZoomControls @zoom-in="onZoomIn" @zoom-out="onZoomOut" @zoom-reset="onZoomToFit" />
</template>

<style>
[data-graph] .force-graph-container .graph-tooltip {
	font-size: 12px;
	font-family: InterVariable, ui-sans-serif, system-ui, sans-serif;
	text-align: center;
}
</style>
