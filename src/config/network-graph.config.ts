import { type ResourceKind } from "@/db/types";

export const nodeColors: Record<ResourceKind, string> = {
	account: "hsl(175.9deg 38.6% 77.6%)" /** brand-cyan */,
	idea: "hsl(47deg 77.8% 59.4%)" /** brand-yellow */,
	interview: "hsl(175.9deg 38.6% 77.6%)" /** brand-cyan */,
	place: "hsl(1.8deg 71.3% 63.1%)" /** brand-red */,
	religion: "hsl(175.9deg 38.6% 77.6%)" /** brand-cyan */,
	"interview-religion": "#ddd",
};

export const highlightedNodeColors: Record<
	ResourceKind,
	{ highlighted: string; selected: string; multiple: string }
> = {
	account: {
		highlighted: "hsl(47deg 77.8% 59.4%)" /** brand-yellow */,
		selected: "hsl(1.8deg 71.3% 63.1%)" /** brand-red */,
		multiple: "#425c66",
	},
	idea: {
		highlighted: "hsl(175.9deg 38.6% 77.6%)" /** brand-cyan */,
		selected: "hsl(1.8deg 71.3% 63.1%)" /** brand-red */,
		multiple: "#425c66",
	},
	interview: {
		highlighted: "hsl(47deg 77.8% 59.4%)" /** brand-yellow */,
		selected: "hsl(1.8deg 71.3% 63.1%)" /** brand-red */,
		multiple: "#425c66",
	},
	"interview-religion": {
		highlighted: "hsl(47deg 77.8% 59.4%)" /** brand-yellow */,
		selected: "hsl(1.8deg 71.3% 63.1%)" /** brand-red */,
		multiple: "#425c66",
	},
	place: {
		highlighted: "hsl(47deg 77.8% 59.4%)" /** brand-yellow */,
		selected: "hsl(1.8deg 71.3% 63.1%)" /** brand-red */,
		multiple: "#425c66",
	},
	religion: {
		highlighted: "hsl(47deg 77.8% 59.4%)" /** brand-yellow */,
		selected: "hsl(1.8deg 71.3% 63.1%)" /** brand-red */,
		multiple: "#425c66",
	},
};

export const nodeSizes: Record<ResourceKind, number> = {
	account: 1,
	idea: 1,
	interview: 1,
	place: 1,
	religion: 1,
	"interview-religion": 3,
};

export const edgeStrokeColor: Record<"account" | "idea", string> = {
	account: "hsl(175.9deg 38.6% 92%)" /** brand-cyan-tint */,
	idea: "hsl(47deg 77.8% 92%)" /** brand-yellow-tint */,
};

export const highlightedEdgeStrokeColor: Record<"account" | "idea", string> = {
	account: "hsl(47deg 77.8% 92%)" /** brand-yellow-tint */,
	idea: "hsl(175.9deg 38.6% 92%)" /** brand-cyan-tint */,
};
