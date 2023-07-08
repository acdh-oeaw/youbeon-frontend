/// <reference types="vite/client" />

import { type Resource } from "@/db/types";

interface ImportMetaEnv {
	readonly VITE_APP_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

type DistributiveOmit<T, K extends PropertyType> = T extends unknown ? Omit<T, K> : never;

type DistributivePick<T, K extends PropertyType> = T extends unknown ? Pick<T, K> : never;

type OptionalKeys<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type RequiredKeys<T extends object, K extends keyof T = keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;

declare module "force-graph" {
	interface NodeObject {
		key: Resource["key"];
		label: Resource["label"];
		kind: Resource["kind"];
	}
}
