import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { assert } from "@acdh-oeaw/lib";
import { format } from "oxfmt";
import serialize from "serialize-javascript";

import type { ResourceBase } from "../../src/db/types";
import type { TransformedData } from "./transform-data";

export async function saveData(data: TransformedData): Promise<void> {
	for (const [key, value] of Object.entries(data)) {
		const filePath = join(process.cwd(), "src", "db", `${key}.ts`);

		const sorted = new Map(
			[...(value as Map<string, ResourceBase>)].sort(([, a], [, z]) => {
				return a.label.localeCompare(z.label);
			}),
		);

		/**
		 * We cannot use a `reviver` for `Map` and `Set` when importing json client-side,
		 * so we dump to javascript, not json.
		 */
		const { code, errors } = await format(filePath, `export const ${key} = ${serialize(sorted)}`);
		assert(errors.length === 0, `Failed to format ${filePath}.`);

		await writeFile(filePath, code);
	}
}
