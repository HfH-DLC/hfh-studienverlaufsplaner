<template>
    <AppHead :planerName="planerName" title="Vorleistungen" />
    <div class="min-h-screen flex flex-col">
        <header>
            <PlanHeader
                :planerSlug="planerSlug"
                :planerName="planerName"
                :planSlug="planResource.data.slug"
                :brochureUrl="brochureUrl"
                :moduleDirectoryUrl="moduleDirectoryUrl"
                :showFocusSelection="focusSelectionEnabled"
                :showTour="false"
                :saveStatus="SaveStatus.Saved"
            />
        </header>
        <div>
            <main class="flex-1 flex flex-col p-4 hfh-content">
                <Flash class="fixed top-4 left-1/2 -translate-x-1/2" />
                <h1>Vorleistungen</h1>
                <form @submit.prevent="createPriorLearning">
                    <HfhInput
                        v-model="priorLearningName"
                        id="prior-learning-name"
                        label="Name"
                        :required="true"
                        type="text"
                    ></HfhInput>
                    <HfhRadioButton
                        id="prior-learning-replaces-module"
                        name="prior-learning-replaces-module"
                        legend="Ersetzt Modul"
                        :options="[
                            { label: 'Ja', value: 'yes' },
                            { label: 'Nein', value: 'no' },
                        ]"
                        v-model="priorLearningReplacesModule"
                    ></HfhRadioButton>
                    <HfhInput
                        v-if="priorLearningReplacesModule === 'no'"
                        v-model="priorLearningECTS"
                        id="prior-learning-ects"
                        label="ECTS"
                        type="number"
                        min="1"
                        :required="true"
                    ></HfhInput>
                    <HfhSelect
                        v-if="priorLearningReplacesModule === 'no'"
                        v-model="priorLearningCategoryId"
                        id="prior-learning-category"
                        :options="categoryOptions"
                        label="Zählt zum Bereich"
                        defaultOption="Auswählen..."
                    >
                    </HfhSelect>
                    <HfhSelect
                        v-if="priorLearningReplacesModule === 'yes'"
                        v-model="priorLearningModuleId"
                        id="prior-learning-module"
                        :options="moduleOptions"
                        label="Welches Modul wird ersetzt?"
                        defaultOption="Auswählen..."
                        :required="true"
                    >
                    </HfhSelect>
                    <HfhButton class="mt-4" type="submit"
                        >Vorleistung erstellen</HfhButton
                    >
                </form>
                <div class="mt-8" v-if="tableData.length > 0">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>ECTS</th>
                                <th>Kategorie</th>
                                <th>Modul</th>
                                <th>Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in tableData">
                                <th>
                                    {{ row.name }}
                                </th>
                                <td>
                                    {{ row.ects }}
                                </td>
                                <td>
                                    {{ row.countsAsCategory || "-" }}
                                </td>
                                <td>
                                    {{ row.countsAsModuleId || "-" }}
                                </td>
                                <td>
                                    <button
                                        @click="deletePriorLearning(row.id)"
                                    >
                                        Vorleistung löschen
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    PriorLearning,
    SaveStatus,
    Module,
    Category,
    PriorLearningParams,
    Rule,
    Todo,
    TourData,
    ScheduleModule,
} from "@/types";
import AppHead from "@/Components/AppHead.vue";
import PlanHeader from "@/Components/PlanHeader.vue";
import Flash from "@/Components/Flash.vue";
import DataAdapter from "@/DataAdapter";
import MainLayout from "@/Layouts/MainLayout.vue";
import { PropType, Ref, computed, ref } from "vue";
import {
    HfhButton,
    HfhInput,
    HfhRadioButton,
    HfhSelect,
} from "@hfh-dlc/hfh-styleguide";
import type { SelectOption } from "@hfh-dlc/hfh-styleguide/types";
import { getInitializedScheduleStore } from "@/Store/schedule";

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

const dataAdapter = new DataAdapter(
    props.planerSlug,
    props.planResource.data.slug
);

const priorLearnings: Ref<Array<PriorLearning>> = ref(
    props.planResource.data.priorLearnings
);

const tableData = computed(() => {
    return priorLearnings.value.map((priorLearning) => {
        return {
            id: priorLearning.id,
            name: priorLearning.name,
            ects: priorLearning.ects,
            countsAsCategory: props.categoriesResource.data.find(
                (category: Category) =>
                    category.id === priorLearning.countsAsCategoryId
            )?.name,
            countsAsModuleId: priorLearning.countsAsModuleId,
        };
    });
});

const priorLearningName = ref("");
const priorLearningECTS = ref();
const priorLearningCategoryId = ref();
const priorLearningReplacesModule = ref("yes");
const priorLearningModuleId = ref();

const createPriorLearning = async () => {
    let ects = parseInt(priorLearningECTS.value) as number | undefined;
    if (Number.isNaN(ects)) {
        ects = undefined;
    }
    let categoryId = parseInt(priorLearningCategoryId.value) as
        | number
        | undefined;
    if (Number.isNaN(ects)) {
        categoryId = undefined;
    }
    const newPiorLearning = {} as PriorLearning;
    newPiorLearning.name = priorLearningName.value;
    newPiorLearning.ectsRaw = ects;
    newPiorLearning.countsAsCategoryIdRaw = categoryId;
    newPiorLearning.countsAsModuleId = priorLearningModuleId.value;
    const priorLearningsToBeSaved: Array<PriorLearning> = [
        ...priorLearnings.value,
        newPiorLearning,
    ];
    priorLearnings.value = await save(priorLearningsToBeSaved);

    resetForm();
};

const resetForm = () => {
    priorLearningName.value = "";
    priorLearningECTS.value = undefined;
    priorLearningCategoryId.value = undefined;
    priorLearningModuleId.value = undefined;
};

const deletePriorLearning = async (id: number) => {
    const priorLearningsToBeSaved: Array<PriorLearning> =
        priorLearnings.value.filter((priorLearning) => {
            return priorLearning.id !== id;
        });
    priorLearnings.value = await save(priorLearningsToBeSaved);
};

const propsClone = JSON.parse(JSON.stringify(props));
const scheduleStore = getInitializedScheduleStore({
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

const save = (priorLearningsToBeSaved: Array<PriorLearning>) => {
    scheduleStore.priorLearnings = priorLearningsToBeSaved.map(
        (priorLearning) => {
            let ects = priorLearning.ectsRaw || 0;
            let countsAsCategoryId = priorLearning.countsAsCategoryIdRaw;
            if (priorLearning.countsAsModuleId) {
                const module = scheduleStore.moduleById(
                    priorLearning!.countsAsModuleId
                );
                if (module) {
                    ects = module.ects;
                    const category = scheduleStore.categories.find((category) =>
                        category.modules.some((m) => m.id === module.id)
                    );
                    if (category) {
                        countsAsCategoryId = category.id;
                    }
                }
            }

            return {
                ...priorLearning,
                ects,
                countsAsCategoryId,
            };
        }
    );
    scheduleStore.validate();
    return dataAdapter.savePriorLearnings(
        priorLearningsToBeSaved.map((priorLearning: PriorLearning) => {
            const params: PriorLearningParams = {
                name: priorLearning.name,
            };
            if (priorLearning.id) {
                params.id = priorLearning.id;
            }
            if (priorLearning.ectsRaw) {
                params.ects = priorLearning.ectsRaw;
            }

            if (priorLearning.countsAsCategoryIdRaw) {
                params.countsAsCategoryId = priorLearning.countsAsCategoryIdRaw;
            }

            if (priorLearning.countsAsModuleId) {
                params.countsAsModuleId = priorLearning.countsAsModuleId;
            }
            return params;
        }),
        scheduleStore.valid
    );
};

const categoryOptions = computed((): Array<SelectOption> => {
    return scheduleStore.categories.map((category: Category): SelectOption => {
        return {
            label: `${category.name}`,
            value: `${category.id}`,
        };
    });
});

const moduleOptions = computed((): Array<SelectOption> => {
    return scheduleStore.modules
        .filter((moduel) => !moduel.placement)
        .map((module: ScheduleModule): SelectOption => {
            return {
                label: `${module.id} ${module.name}`,
                value: module.id,
            };
        });
});
</script>

<style lang="scss">
html:root {
    --w-container: 100%;
}
</style>
