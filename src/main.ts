import "@fontsource-variable/noto-sans-display/wght.css";
import "@fontsource-variable/noto-sans-display/wght-italic.css";
import "tailwindcss/tailwind.css";
import "@/styles/index.css";
import "@/styles/nprogress.css";

import { createApp } from "vue";

import App from "@/app/app.vue";
import { router } from "@/app/router";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
createApp(App).use(router).mount("#app");
