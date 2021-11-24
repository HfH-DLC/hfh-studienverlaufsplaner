import { createApp, h } from 'vue';
import { createInertiaApp, Link, Head } from '@inertiajs/inertia-vue3';
import { InertiaProgress } from '@inertiajs/progress'
import Layout from "./Layout.vue"

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
            .component('Link', Link)
            .component('Head', Head)
            .mount(el);
    },
});

InertiaProgress.init()