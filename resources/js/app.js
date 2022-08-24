import { createApp, h } from "vue";
import { createInertiaApp, Link, Head } from "@inertiajs/inertia-vue3";
import { InertiaProgress } from "@inertiajs/progress";
import store from "./Store/index";
import emitter from "./emitter";

createInertiaApp({
    resolve: async (name) => {
        let page = (await import(`./Pages/${name}`)).default;
        return page;
    },
    setup({ el, app, props, plugin }) {
        const vueApp = createApp({ render: () => h(app, props) });
        vueApp.config.globalProperties.$emitter = emitter;
        vueApp
            .use(plugin)
            .use(store)
            .component("Link", Link)
            .component("Head", Head)
            .mount(el);
    },
    title: (title) => {
        const staticTitle = "Studienverlaufsplaner";
        if (title) {
            return `${title} | ${staticTitle}`;
        }
        return staticTitle;
    },
});

InertiaProgress.init();
