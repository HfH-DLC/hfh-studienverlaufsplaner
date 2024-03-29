<template>
    <AppHead :planerName="planerName" title="Anrechnung" />
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
                :showTour="!!tour && planResource.data.scheduleValid"
                :brochureUrl="brochureUrl"
                :moduleDirectoryUrl="moduleDirectoryUrl"
                :saveStatus="saveStatus"
            />
        </header>
        <main class="flex-1 flex flex-col px-4 pb-4">
            <Flash class="fixed top-4 left-1/2 -translate-x-1/2" />
            <div class="flex mt-4 gap-x-8 print:block">
                <template v-if="planResource.data.scheduleValid">
                    <h2 class="hfh-sr-only">
                        Anrechnung an die Studienschwerpunkte
                    </h2>
                    <table
                        class="w-9/12 print:w-full divide-y divide-fantasy-plain border border-fantasy-plain text-left layout-fixed"
                        id="modules"
                    >
                        <caption
                            class="text-white py-2 bg-thunderbird-red print:bg-transparent print:text-black print:border-t print:border-r print:border-l print:border-fantasy-plain"
                        >
                            Anrechnung an die Studienschwerpunkte
                        </caption>
                        <thead class="bg-fantasy-pastel">
                            <tr
                                class="divide-x divide-fantasy-plain text-base text-hfh-gray-darkest"
                            >
                                <th class="px-4 py-2 font-normal">Modul</th>
                                <th class="px-4 py-2 font-normal">
                                    Anrechnung
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-fantasy-plain">
                            <template
                                v-for="module in modules"
                                :key="module.id"
                            >
                                <tr class="divide-x divide-fantasy-plain">
                                    <td class="p-4">
                                        <label :for="`credit-${module.id}`">
                                            <span
                                                v-if="
                                                    isPriorLearning(module.id)
                                                "
                                                >(Vorleistung) </span
                                            ><span
                                                >{{ module.id }}
                                                {{ module.name }}</span
                                            ></label
                                        >
                                    </td>
                                    <td class="p-4">
                                        <div v-if="module.requiredCredit">
                                            SSP
                                            {{
                                                getFocusName(
                                                    module.creditedAgainst
                                                )
                                            }}
                                        </div>
                                        <HfhSelect
                                            v-else
                                            :id="`credit-${module.id}`"
                                            :options="
                                                getFocusOptions(module.id)
                                            "
                                            :modelValue="
                                                module.creditedAgainst
                                                    ? `${module.creditedAgainst}`
                                                    : ''
                                            "
                                            @update:modelValue="
                                                store.creditModuleAgainstFocusSelection(
                                                    module.id,
                                                    $event
                                                )
                                            "
                                            defaultOption="Nicht anrechnen"
                                            :disabled="readOnly"
                                            :class="{
                                                'hfh-selected-focus-option':
                                                    !!module.creditedAgainst,
                                            }"
                                        />
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    <div
                        class="w-3/12 print:w-full print:mt-8"
                        aria-live="polite"
                    >
                        <h2 class="hfh-sr-only">Checkliste</h2>
                        <p
                            class="mb-8"
                            v-if="!todoEntries.some((entry) => !entry.checked)"
                        >
                            Ihre Planung erfüllt alle Anforderungen.
                        </p>
                        <Checklist :entries="todoEntries" id="todos" />
                    </div>
                </template>
                <p v-else>
                    Bitte erfüllen sie zuerst alle Anforderungen an Ihren
                    <HfhLink :component="Link" href="zeitplan">Zeitplan</HfhLink
                    >, bevor Sie mit der Anrechnung an die Studienschwerpunkte
                    beginnen.
                </p>
            </div>
        </main>
        <Tour
            v-if="tour"
            :steps="tour.steps"
            :current-index="tourCurrentStepIndex"
            :startOnMount="!tourCompleted"
            @started="store.startTour"
            @completed="store.completeTour"
            @step-changed="onTourStepChanged"
        />
    </div>
</template>

<script lang="ts" setup>
import AppHead from "@/Components/AppHead.vue";
import { HfhSelect, HfhLink } from "@hfh-dlc/hfh-styleguide";
import { Link } from "@inertiajs/vue3";
import { storeToRefs } from "pinia";
import { ComputedRef, PropType, computed, onBeforeUnmount } from "vue";
import { useEmitter } from "@/composables/useEmitter";

import { useCreditStore } from "../Store/credit";
import Checklist from "../Components/Checklist.vue";
import Flash from "../Components/Flash.vue";
import PlanHeader from "../Components/PlanHeader.vue";
import Tour from "../Components/Tour.vue";
import MainLayout from "../Layouts/MainLayout.vue";
import { FlashType, PriorLearning, TourData } from "@/types";
import DataAdapter from "@/DataAdapter";
import Validator from "@/Validator";
import { getTodos } from "@/Models/Todos/Credit/TodoFactory";
import type { SelectOption } from "@hfh-dlc/hfh-styleguide/types";
import { showCreditPage } from "@/helpers";

defineOptions({
    layout: MainLayout,
});

const props = defineProps({
    creditableModulesResource: {
        type: Object,
        required: true,
    },
    planResource: {
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
    focusSelectionEnabled: {
        type: Boolean,
        required: true,
    },
    priorLearningsResource: {
        type: Object,
        required: true,
    },
});

const retrySave = async () => {
    if (await store.save()) {
        emitter.emit("flash", {
            type: FlashType.Success,
            message: "Ihr Plan wurde erfolgreich gespeichert.",
        });
    }
};

const focusModule = (moduleId: string) => {
    const selectElement = document.getElementById(`credit-${moduleId}`);
    if (selectElement) {
        selectElement.focus();
    }
};

const emitter = useEmitter();
emitter.on("retry-save", retrySave);
emitter.on("focus-module", focusModule);
onBeforeUnmount(() => {
    emitter.off("retry-save", retrySave);
    emitter.off("focus-module", focusModule);
});

const store = useCreditStore();

store.init({
    dataAdapter: new DataAdapter(
        props.planerSlug,
        props.planResource.data.slug
    ),
    validator: new Validator(getTodos(props.todosResource.data), []),
    focusSelections: props.planResource.data.focusSelections,
    modules: props.creditableModulesResource.data,
    tour: props.tourData,
    tourCompleted: props.planResource.data.creditTourCompleted,
    readOnly: props.planResource.data.readOnly,
});

const {
    modules,
    focusSelections,
    todoEntries,
    tour,
    tourCompleted,
    tourCurrentStepIndex,
    readOnly,
    saveStatus,
} = storeToRefs(store);

const priorLearnings: ComputedRef<Array<PriorLearning>> = computed(
    () => props.planResource.data.priorLearnings
);

const isPriorLearning = (moduleId: string) => {
    return priorLearnings.value.some(
        (priorLearning: PriorLearning) =>
            priorLearning.countsAsModuleId === moduleId
    );
};

const getFocusOptions = (moduleId: string): Array<SelectOption> => {
    if (!isPriorLearning(moduleId)) {
        return focusSelections.value.map((focusSelection) => ({
            label: "SSP " + focusSelection.focus.name,
            value: focusSelection.id.toString(),
        }));
    }

    return focusSelections.value
        .filter((focusSelection) => {
            return (
                focusSelection.focus.requiredModules
                    .map((module) => module.id)
                    .includes(moduleId) ||
                focusSelection.focus.optionalModules
                    .map((module) => module.id)
                    .includes(moduleId)
            );
        })
        .map((focusSelection) => {
            return {
                label: "SSP " + focusSelection.focus.name,
                value: focusSelection.id.toString(),
            };
        });
};

const getFocusName = (focusSelectionId: number | null) => {
    return focusSelections.value.find(
        (focusSelection) => focusSelection.id == focusSelectionId
    )?.focus.name;
};

const onTourStepChanged = (index: number) => {
    store.tourCurrentStepIndex = index;
};
</script>

<style>
html:root {
    --w-container: 100%;
}
</style>

<style scoped>
table {
    page-break-inside: avoid !important;
}

:deep() .hfh-selected-focus-option select {
    font-weight: 700;
}
</style>
