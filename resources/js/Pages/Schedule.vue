<template>
    <AppHead :planerName="planerName" title="Zeitplan" />
    <div class="min-h-screen flex flex-col">
        <header>
            <PlanHeader
                :planerSlug="planerSlug"
                :planerName="planerName"
                :planSlug="planResource.data.slug"
                :showCreditPage="
                    showCreditPage(
                        focusSelectionEnabled,
                        planResource.data.startYear
                    )
                "
                :showTour="!!store.tour"
                :brochureUrl="brochureUrl"
                :moduleDirectoryUrl="moduleDirectoryUrl"
                :save-status="store.saveStatus"
            />
        </header>
        <main class="flex-1 flex flex-col">
            <Flash class="fixed top-4 left-1/2 -translate-x-1/2" />
            <template v-if="store.initialized">
                <div>
                    <div
                        class="p-4 space-y-4"
                        role="alert"
                        v-if="
                            store.placementErrorMessages.length > 0 ||
                            store.infos.length > 0
                        "
                    >
                        <MessageList
                            class="space-y-2"
                            v-if="store.infos.length > 0"
                            :messages="store.infos"
                            aria-live="polite"
                        />
                        <MessageList
                            class="space-y-2"
                            v-if="store.placementErrorMessages.length > 0"
                            :messages="store.placementErrorMessages"
                            aria-live="polite"
                        />
                    </div>
                    <h2 class="hfh-sr-only">Schwerpunkt-Auswahl</h2>
                    <FocusSelection
                        v-if="focusSelectionEnabled"
                        id="focus-selection"
                        class="px-4 py-8"
                    />
                    <div class="flex flex-1 items-start print:block">
                        <StickyColumn
                            id="modules"
                            class="w-3/12 print:hidden pb-24"
                        >
                            <ModuleInformation
                                v-show="selectedOrTourModule"
                                :selectedModule="selectedOrTourModule"
                            />
                            <div v-show="!selectedOrTourModule">
                                <h2 class="hfh-sr-only">Modul-Liste</h2>
                                <ModuleList />
                            </div>
                        </StickyColumn>
                        <StickyColumn
                            id="time-table"
                            class="w-6/12 print:w-full lg:mx-0 xl:mx-8 pb-24 print:pb-4"
                        >
                            <h2 class="hfh-sr-only">Semester-Stundenpläne</h2>
                            <TimeTable ref="timeTable" />
                        </StickyColumn>
                        <StickyColumn
                            id="todos"
                            class="w-3/12 print:w-full pb-24 print:pb-4"
                            aria-live="polite"
                        >
                            <h2 class="hfh-sr-only">Checkliste</h2>
                            <p
                                v-if="
                                    store.placementErrorMessages.length == 0 &&
                                    !store.todoEntries.some(
                                        (entry) => !entry.checked
                                    )
                                "
                                class="mb-8"
                            >
                                Ihre Planung erfüllt alle Anforderungen.
                                <HfhLink
                                    v-if="
                                        focusSelectionEnabled &&
                                        planResource.data.startYear < 2024
                                    "
                                    href="anrechnung"
                                    :component="Link"
                                    >Weiter zur Anrechnung.
                                </HfhLink>
                            </p>
                            <Info
                                v-if="store.priorLearnings.length > 0"
                                class="mb-4"
                            >
                                Sie haben
                                <HfhLink
                                    :component="Link"
                                    href="vorleistungen"
                                    class="text-hfh-turqoise"
                                >
                                    Vorleistungen
                                </HfhLink>
                                im Umfang von
                                {{
                                    store.priorLearnings.reduce(
                                        (acc, cur) => acc + cur.ects,
                                        0
                                    )
                                }}
                                ECTS erfasst.
                            </Info>
                            <Checklist :entries="store.todoEntries" />
                        </StickyColumn>
                    </div>
                </div>
                <Tour
                    v-if="store.tour"
                    :steps="store.tour.steps"
                    :current-index="store.tourCurrentStepIndex"
                    :startOnMount="!store.tourCompleted"
                    @started="store.startTour"
                    @completed="store.completeTour"
                    @step-changed="onTourStepChanged"
                />
            </template>
        </main>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, computed } from "vue";
import { getInitializedScheduleStore } from "../Store/schedule";
// Components
import Info from "@/Components/Info.vue";
import MessageList from "@/Components/MessageList.vue";
import FocusSelection from "../Components/FocusSelection.vue";
import ModuleInformation from "../Components/ModuleInformation.vue";
import ModuleList from "../Components/ModuleList.vue";
import TimeTable from "../Components/TimeTable.vue";
import Tour from "../Components/Tour.vue";
import PlanHeader from "../Components/PlanHeader.vue";
import Flash from "../Components/Flash.vue";
import StickyColumn from "../Components/StickyColumn.vue";
import Checklist from "../Components/Checklist.vue";
import MainLayout from "../Layouts/MainLayout.vue";
import { HfhLink } from "@hfh-dlc/hfh-styleguide";
import { Link } from "@inertiajs/vue3";
import { FlashType, TourData } from "@/types";
import AppHead from "@/Components/AppHead.vue";
import { PropType } from "vue";
import { useEmitter } from "@/composables/useEmitter";
import { showCreditPage } from "@/helpers";

defineOptions({ layout: MainLayout });

const props = defineProps({
    categoriesResource: {
        type: Object,
        required: true,
    },
    focusSelectionEnabled: {
        type: Boolean,
        required: true,
    },
    fociResource: {
        type: Object,
        required: true,
    },
    planerSlug: {
        type: String,
        required: true,
    },
    planerName: {
        type: String,
        required: true,
    },
    planResource: {
        type: Object,
        required: true,
    },
    requiredECTS: {
        type: Number,
        required: true,
    },
    rulesResource: {
        type: Object,
        required: true,
    },
    todosResource: {
        type: Object,
        required: true,
    },
    tourData: {
        type: Object as PropType<TourData>,
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
});

const propsClone = JSON.parse(JSON.stringify(props));

const store = getInitializedScheduleStore({
    planerSlug: propsClone.planerSlug,
    planSlug: propsClone.planResource.data.slug,
    todosData: propsClone.todosResource.data,
    rulesData: propsClone.rulesResource.data,
    categories: propsClone.categoriesResource.data,
    plan: propsClone.planResource.data,
    foci: propsClone.fociResource.data,
    requiredECTS: propsClone.requiredECTS,
    tourData: propsClone.tourData,
});

const emitter = useEmitter();
const retrySave = async () => {
    if (await store.save()) {
        emitter.emit("flash", {
            type: FlashType.Success,
            message: "Ihr Plan wurde erfolgreich gespeichert.",
        });
    }
};
emitter.on("retry-save", retrySave);
emitter.on("focus-module", store.selectModule);

onBeforeUnmount(() => {
    emitter.off("retry-save", retrySave);
    emitter.off("focus-module", store.selectModule);
});

const selectedOrTourModule = computed(() => {
    return store.tourActive ? store.tourSelectedModule : store.selectedModule;
});

const onTourStepChanged = (index: number) => {
    store.tourCurrentStepIndex = index;
};
</script>

<style>
html:root {
    --w-container: 100%;
}
</style>
