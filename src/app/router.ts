import nprogress from "nprogress";
import { createRouter, createWebHistory } from "vue-router";

import { trackPageView } from "@/app/matomo-analytics";
import { metadata } from "~/config/metadata.config";

nprogress.configure({ showSpinner: false });

const AccountsView = () => {
	return import("@/views/accounts-view.vue");
};
const HomeView = () => {
	return import("@/views/home-view.vue");
};
const IdeasView = () => {
	return import("@/views/ideas-view.vue");
};
const ImprintView = () => {
	return import("@/views/imprint-view.vue");
};
const PlacesView = () => {
	return import("@/views/places-view.vue");
};

declare module "vue-router" {
	interface RouteMeta {
		title: string;
	}
}

export const routes = {
	home: {
		path: "/",
		name: "home",
		component: HomeView,
		meta: { title: "Startseite" },
	},
	accounts: {
		path: "/accounts",
		name: "accounts",
		component: AccountsView,
		meta: { title: "Accounts" },
	},
	ideas: {
		path: "/ideas",
		name: "ideas",
		component: IdeasView,
		meta: { title: "Ideen" },
	},
	imprint: {
		path: "/imprint",
		name: "imprint",
		component: ImprintView,
		meta: { title: "Impressum" },
	},
	places: {
		path: "/places",
		name: "places",
		component: PlacesView,
		meta: { title: "Orte" },
	},
};

export const router = createRouter({
	history: createWebHistory(),
	routes: Object.values(routes),
	scrollBehavior(to) {
		if (to.hash) {
			return { el: to.hash };
		}
		return { left: 0, top: 0 };
	},
});

const delay = 150;
let timer: ReturnType<typeof setTimeout> | null = null;

const title = [metadata.shortTitle, metadata.title].join(" - ");

router.beforeEach((to, from, next) => {
	document.title = `${to.meta.title} | ${title}`;
	next();
});

router.beforeResolve((to, from, next) => {
	if (to.name != null) {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		timer = setTimeout(nprogress.start, delay);
	}
	next();
});

router.afterEach((to, from) => {
	if (timer != null) {
		clearTimeout(timer);
	}
	nprogress.done();

	/** Note that this will also track the initial page load. */
	trackPageView(to, from);
});
