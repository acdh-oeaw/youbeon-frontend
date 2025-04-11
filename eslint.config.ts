import baseConfig from "@acdh-oeaw/eslint-config";
import tailwindcssConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import vueConfig from "@acdh-oeaw/eslint-config-vue";
import gitignore from "eslint-config-flat-gitignore";
import { config } from "typescript-eslint";

export default config([
	gitignore({ strict: false }),
	...baseConfig,
	...vueConfig,
	...tailwindcssConfig,
	{
		rules: {
			"vue/attributes-order": ["warn", { alphabetical: true }],
		},
	},
]);
