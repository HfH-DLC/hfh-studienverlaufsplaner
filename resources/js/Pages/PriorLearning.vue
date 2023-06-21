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
                :showNavigation="true"
                :showTour="false"
                :saveStatus="SaveStatus.Saved"
            />
        </header>
        <div>
            <main class="flex-1 flex flex-col p-4">
                <Flash class="fixed top-4 left-1/2 -translate-x-1/2" />
                <h1>Vorleistungen</h1>
                <form @submit.prevent="createPriorLearning">
                    <HfhInput
                        v-model="priorLearningName"
                        id="prior-learning-name"
                        label="Name"
                        :required="true"
                    ></HfhInput>
                    <HfhInput
                        v-model="priorLearningECTS"
                        id="prior-learning-ects"
                        label="ECTS"
                        type="number"
                        min="0"
                        :required="true"
                    ></HfhInput>
                    <HfhSelect
                        v-model="priorLearningModuleId"
                        id="prior-learning-module"
                        :options="[]"
                        label="Zählt als Modul"
                    >
                    </HfhSelect>
                    <HfhButton class="mt-4" type="submit"
                        >Vorleistung erstellen</HfhButton
                    >
                </form>
                <ul>
                    <li v-for="priorLearning in priorLearings">
                        {{ priorLearning }}
                    </li>
                </ul>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PriorLearning, SaveStatus } from "@/types";
import AppHead from "@/Components/AppHead.vue";
import PlanHeader from "@/Components/PlanHeader.vue";
import Flash from "@/Components/Flash.vue";
import DataAdapter from "@/DataAdapter";
import MainLayout from "@/Layouts/MainLayout.vue";
import { Ref, ref } from "vue";
import { HfhButton, HfhInput, HfhSelect } from "@hfh-dlc/hfh-styleguide";

defineOptions({ layout: MainLayout });

const props = defineProps({
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

const priorLearings: Ref<Array<PriorLearning>> = ref(
    props.planResource.data.priorLearnings
);

const priorLearningName = ref("");
const priorLearningECTS = ref("0");
const priorLearningModuleId = ref();

const createPriorLearning = () => {
    let ects = parseInt(priorLearningECTS.value);
    if (Number.isNaN(ects)) {
        ects = 0;
    }
    const priorLearning: PriorLearning = {
        name: priorLearningName.value,
        ects,
        countsAsModuleId: priorLearningModuleId.value,
    };
    priorLearings.value.push(priorLearning);
    save();
};

const save = () => {
    dataAdapter.savePriorLearnings(priorLearings.value);
};
</script>

<style lang="scss">
html:root {
    --w-container: 100%;
}
</style>
