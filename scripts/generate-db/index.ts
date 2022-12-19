import { log } from "@stefanprobst/log";

import { readXlsxFiles } from "./read-xlsx-files";
import { saveData } from "./save-data";
import { transformData } from "./transform-data";

async function generate() {
	await saveData(transformData(readXlsxFiles()));
}

generate()
	.then(() => {
		log.success("Successfully generated database.");
	})
	.catch((error) => {
		log.error("Failed to generate database.\n", error);
	});
