import { defineConfig } from "oxfmt";

const config = defineConfig({
	endOfLine: "lf",
	ignorePatterns: ["pnpm-lock.yaml", "pnpm-workspace.yaml"],
	printWidth: 100,
	proseWrap: "always",
	semi: true,
	singleQuote: false,
	sortImports: {
		groups: [
			["side_effect"],
			["side_effect_style"],
			["style"],
			["builtin"],
			["external"],
			["internal", "subpath"],
			["unknown"],
		],
	},
	sortPackageJson: false,
	sortTailwindcss: {
		stylesheet: "./src/styles/index.css",
	},
	tabWidth: 2,
	trailingComma: "all",
	useTabs: true,
});

export default config;
