import "@fontsource-variable/noto-sans-display/wght.css";
import "@fontsource-variable/noto-sans-display/wght-italic.css";
import "@/styles/index.css";

import { createApp } from "vue";

import App from "@/app/app.vue";
import { router } from "@/app/router";

// oxlint-disable-next-line typescript/no-unsafe-argument
createApp(App).use(router).mount("#app");
