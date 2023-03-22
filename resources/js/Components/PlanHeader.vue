<template>
    <PageHeader
        :planer-name="planerName"
        :planer-slug="planerSlug"
        :brochure-url="brochureUrl"
        :module-directory-url="moduleDirectoryUrl"
    >
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
    </PageHeader>
</template>

<script lang="ts" setup>
import { useEmitter } from "@/composables/useEmitter";
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/outline";
import { HfhLogo, HfhHeaderBar } from "@hfh-dlc/hfh-styleguide";
import { Link } from "@inertiajs/vue3";
import PageHeader from "./PageHeader.vue";
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
