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
                <ul class="flex gap-x-4">
                    <li>
                        <Link
                            :href="`/${planerSlug}/${planSlug}/einstellungen`"
                            class="font-normal hover:text-thunderbird-red"
                            :class="{
                                active: $page.component === 'Settings',
                            }"
                            id="settings"
                            >Einstellungen</Link
                        >
                    </li>
                    <li>
                        <Link
                            :href="`/${planerSlug}/${planSlug}/vorleistungen`"
                            class="font-normal hover:text-thunderbird-red"
                            :class="{
                                active: $page.component === 'PriorLearning',
                            }"
                            id="prior-learning"
                            >Vorleistungen</Link
                        >
                    </li>
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
                    <li v-if="showFocusSelection">
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
            <StartTourButton v-if="showTour" />
            <PrintButton />
        </div>
    </PageHeader>
</template>

<script lang="ts" setup>
import { Link } from "@inertiajs/vue3";
import PageHeader from "./PageHeader.vue";
import PrintButton from "./PrintButton.vue";
import SaveStatusIndicator from "./SaveStatusIndicator.vue";
import StartTourButton from "./StartTourButton.vue";

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
    showFocusSelection: {
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
</script>

<style lang="scss" scoped>
a.active {
    color: var(--c-thunderbird-red);
}
</style>
