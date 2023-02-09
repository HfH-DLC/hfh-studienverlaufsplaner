import { createApp, h } from "vue";
import { createInertiaApp, Link } from "@inertiajs/inertia-vue3";
import { createPinia } from "pinia";
import { InertiaProgress } from "@inertiajs/progress";

import AppHead from "./Components/AppHead.vue";
import emitter from "./emitter";

createInertiaApp({
    resolve: async (name) => {
        let page = (await import(`./Pages/${name}`)).default;
        return page;
    },
    setup({ el, app, props, plugin }) {
        const vueApp = createApp({ render: () => h(app, props) });
        const store = createPinia();
        vueApp.config.globalProperties.$emitter = emitter;
        vueApp
            .use(plugin)
            .use(store)
            .component("Link", Link)
            .component("AppHead", AppHead)
            .mount(el);
    },
});

InertiaProgress.init();
