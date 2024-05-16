import { join } from "node:path";

import { assert, createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { config } from "dotenv";

import { metadata } from "./metadata.config";

const envFileNames = [".env", ".env.local"];
envFileNames.forEach((envFileName) => {
	config({ path: join(process.cwd(), envFileName) });
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
