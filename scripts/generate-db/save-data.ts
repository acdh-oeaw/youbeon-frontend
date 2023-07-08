import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { format } from "prettier";
import serialize from "serialize-javascript";

import { type TransformedData } from "./transform-data";

export async function saveData(data: TransformedData): Promise<void> {
	for (const [key, value] of Object.entries(data)) {
		const filePath = join(process.cwd(), "src", "db", key + ".ts");

		const sorted = new Map(
			[...value].sort(([, a], [, z]) => {
				return a.label.localeCompare(z.label);
			}),
		);

		/**
		 * We cannot use a `reviver` for `Map` and `Set` when importing json client-side,
		 * so we dump to javascript, not json.
		 */
		await writeFile(
			filePath,
			await format(`export const ${key} = ${serialize(sorted)}`, { parser: "typescript" }),
		);
	}
}
