import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { HttpError, log, request } from "@acdh-oeaw/lib";
import config from "@acdh-oeaw/prettier-config";
import { format } from "prettier";

import { url } from "../config/imprint.config";

async function generate() {
	const html = (await request(url, { responseType: "text" })) as string;

	const view = await format(
		`
    <script lang="ts" setup>
    import '@/styles/prose.css'

    import MainContent from '@/components/main-content.vue'
    </script>

    <template>
    <main-content>
      <div class="prose mx-auto grid max-w-3xl gap-4 px-8 py-16">
        <div class="relative mb-8">
          <img alt="" class="absolute -top-8 -left-10 h-28 w-28" src="@/assets/images/bubble.svg" />
          <h1
            class="relative flex items-center gap-2 bg-neutral-50 pb-1 font-display text-3xl font-bold"
          >
            Impressum
          </h1>
          <div class="relative h-1 bg-brand-cyan" />
        </div>
        ${html}
      </div>
    </main-content>
    </template>
  `,
		{ ...config, parser: "vue" },
	);

	const outputFilePath = join(process.cwd(), "src", "views", "imprint-view.vue");

	await writeFile(outputFilePath, view, { encoding: "utf-8" });
}

generate()
	.then(() => {
		log.success("Successfully generated imprint.");
	})
	.catch((error) => {
		const message = error instanceof HttpError ? error.response.statusText : String(error);
		log.error("Failed to generate imprint.\n", message);
	});
