import { existsSync } from "node:fs";
import { join } from "node:path";
import { loadEnvFile } from "node:process";

import { assert, createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

import { metadata } from "./metadata.config";

const envFileNames = [".env", ".env.local"];
envFileNames.forEach((envFileName) => {
	const envFilePath = join(process.cwd(), envFileName);

	/** Throws when the file does not exist. Does not override variables which are already set. */
	if (existsSync(envFilePath)) {
		loadEnvFile(envFilePath);
	}
});

const redmineId = process.env.VITE_APP_REDMINE_ID;
const locale = metadata.locale;

assert(
	redmineId != null,
	"Please set the VITE_APP_REDMINE_ID environment variable to the redmine service issue id.",
);

export const url = createUrl({
	baseUrl: "https://imprint.acdh.oeaw.ac.at",
	pathname: `/${redmineId}`,
	searchParams: createUrlSearchParams({ locale }),
});
