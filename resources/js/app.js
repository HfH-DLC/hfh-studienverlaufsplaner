import { createApp, h } from 'vue';
import { createInertiaApp, Link, Head } from '@inertiajs/inertia-vue3';
import { InertiaProgress } from '@inertiajs/progress'
import store from "./Store/index";
import Layout from "./Layouts/Layout.vue"


createInertiaApp({
    resolve: async name => {
        let page = (await
            import (`./Pages/${name}`)).default;
        if (!page.layout) {
            page.layout = Layout;
        }
        return page;
    },
    setup({ el, app, props, plugin }) {
        createApp({ render: () => h(app, props) })
            .use(plugin)
            .use(store)
            .component('Link', Link)
            .component('Head', Head)

        .mount(el);
    },
    title: (title) => {
        const staticTitle = 'Studienverlaufsplaner';
        if (title) {
            return `${title} | ${staticTitle}`;
        }
        return staticTitle;
    }
});

InertiaProgress.init()