/// <reference types="vitest" />

import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";

import DefineOptions from "unplugin-vue-define-options/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.ts", "resources/css/app.css"],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        DefineOptions(),
    ],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["resources/js/tests/setup.ts"],
    },
});
