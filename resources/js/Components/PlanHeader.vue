<template>
    <HfhHeaderBar class="print:hidden">
        <template v-slot:right>
            <div class="px-4 py-3 leading-4">
                <nav>
                    <ul class="flex gap-x-4">
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
    <div class="flex justify-between h-full px-4 pt-4 pb-4">
        <div class="flex gap-x-8 items-center">
            <HfhLogo />
            <div>
                <h1 class="text-2xl m-0">
                    Studienverlaufsplaner
                    <span v-if="planerName">{{ planerName }}</span>
                </h1>
                <p class="text-sm m-0">(Änderungen vorbehalten)</p>
            </div>
        </div>
        <div
            class="flex justify-between items-center gap-4 text-base print:hidden"
        >
            <nav class="flex items-center">
                <ul class="flex gap-x-4" v-if="showNavigation">
                    <li>
                        <Link
                            :href="`/${planerSlug}/${planSlug}/zeitplan`"
                            class="font-normal hover:text-thunderbird-red"
                            :class="{
                                active: $page.component === 'Schedule',
                            }"
                            >Zeitplan</Link
                        >
                    </li>
                    <li>
                        <Link
                            :href="`/${planerSlug}/${planSlug}/anrechnung`"
                            class="font-normal hover:text-thunderbird-red"
                            :class="{
                                active: $page.component === 'Credit',
                            }"
                            >Anrechnung</Link
                        >
                    </li>
                </ul>
            </nav>
            <SaveStatusIndicator :saveStatus="saveStatus" />
            <button
                v-if="showTour"
                id="start-tour"
                class="flex items-center gap-1 hover:text-thunderbird-red"
                @click="startTour"
            >
                <QuestionMarkCircleIcon class="w-5 h-5" aria-hidden="true" />
                Hilfe
            </button>
            <PrintButton />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useEmitter } from "@/composables/useEmitter";
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/outline";
import { HfhLogo, HfhHeaderBar } from "@hfh-dlc/hfh-styleguide";
import { Link } from "@inertiajs/vue3";
import PrintButton from "./PrintButton.vue";
import SaveStatusIndicator from "./SaveStatusIndicator.vue";

const props = defineProps({
    planerSlug: {
        type: String,
        required: true,
    },
    planerName: {
        type: String,
        required: true,
    },
    planSlug: {
        type: String,
        required: true,
    },
    showNavigation: {
        type: Boolean,
        required: true,
    },
    showTour: {
        type: Boolean,
        required: true,
    },
    brochureUrl: {
        type: String,
        required: true,
    },
    moduleDirectoryUrl: {
        type: String,
        required: true,
    },
    saveStatus: {
        type: Number,
        required: true,
    },
});

const emitter = useEmitter();

const startTour = () => {
    emitter.emit("start-tour");
};
</script>

<style lang="scss" scoped>
a.active {
    color: var(--c-thunderbird-red);
}
</style>
