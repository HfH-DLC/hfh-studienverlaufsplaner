<template>
    <HfhHeaderBar class="print:hidden">
        <template v-slot:right>
            <div class="px-4 py-3 leading-4">
                <nav>
                    <ul class="flex gap-x-4">
                        <li v-if="planerSlug">
                            <a
                                class="hover:text-thunderbird-red"
                                :href="moduleFilterUrl"
                                rel="noopener noreferer"
                                target="_blank"
                                >Modulefilter</a
                            >
                        </li>
                        <li v-if="moduleDirectoryUrl">
                            <a
                                class="hover:text-thunderbird-red"
                                :href="moduleDirectoryUrl"
                                rel="noopener noreferer"
                                target="_blank"
                                >Modulverzeichnis</a
                            >
                        </li>
                        <li v-if="brochureUrl">
                            <a
                                class="hover:text-thunderbird-red"
                                :href="brochureUrl"
                                rel="noopener noreferer"
                                target="_blank"
                                >Studienbroschüre</a
                            >
                        </li>
                        <li>
                            <a
                                class="hover:text-thunderbird-red"
                                href="https://hfh.ch"
                                rel="noopener noreferer"
                                target="_blank"
                                >hfh.ch</a
                            >
                        </li>
                    </ul>
                </nav>
            </div>
        </template>
    </HfhHeaderBar>
    <div
        class="flex justify-between h-full px-4 pt-4 pb-4 max-w-container mx-auto gap-x-8"
    >
        <div class="flex gap-x-8 items-center">
            <Link :href="`/${planerSlug}`"><HfhLogo /></Link>
            <div>
                <h1 class="text-2xl m-0">
                    Studienverlaufsplaner
                    <span v-if="planerName">{{ planerName }}</span>
                </h1>
                <p class="text-sm m-0">(Änderungen vorbehalten)</p>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { HfhLogo, HfhHeaderBar } from "@hfh-dlc/hfh-styleguide";
import { Link } from "@inertiajs/vue3";
import { computed, PropType } from "vue";

const props = defineProps({
    planerSlug: {
        type: String as PropType<string | undefined>,
    },
    planerName: {
        type: String as PropType<string | undefined>,
    },
    brochureUrl: {
        type: String as PropType<string | undefined>,
    },
    moduleDirectoryUrl: {
        type: String as PropType<string | undefined>,
    },
});

const moduleFilterUrl = computed(() => {
    if (props.planerSlug) {
        return `/${props.planerSlug}/angebot`;
    }
    return;
});
</script>

<style lang="scss" scoped>
a.active {
    color: var(--c-thunderbird-red);
}
</style>
