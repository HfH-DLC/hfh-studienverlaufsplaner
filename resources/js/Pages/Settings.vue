<template>
    <AppHead :planerName="planerName" title="Einstellungen" />
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
            <main class="flex-1 flex flex-col px-4">
                <Flash class="fixed top-4 left-1/2 -translate-x-1/2" />
                <div>
                    <h2 class="hfh-h2">Einstellungen</h2>
                    <h3 class="hfh-h3">Zeitpunkte</h3>
                    <p class="mb-4">Wann möchtest du Module besuchen?</p>
                    <div class="grid grid-cols-4 mb-8">
                        <HfhCheckbox
                            :id="`filter-day-time`"
                            legend="Zeitpunkt"
                            :options="dayTimeOptions"
                            v-model="dayTimeFilter"
                            orientation="vertical"
                            @update:model-value="save"
                        ></HfhCheckbox>
                    </div>
                    <h3 class="hfh-h3">Standorte</h3>
                    <p class="mb-4">
                        An welchen Standorten möchtest du Module besuchen?
                    </p>
                    <HfhCheckbox
                        id="filter-location"
                        legend="Standort"
                        :options="locationOptions"
                        v-model="locationFilter"
                        orientation="vertical"
                        @update:model-value="save"
                    ></HfhCheckbox>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { DayTime, Location, SaveStatus } from "@/types";
import { ComputedRef, Ref, computed, ref } from "vue";
import { CheckboxOption } from "@hfh-dlc/hfh-styleguide/types/types";
import { HfhCheckbox } from "@hfh-dlc/hfh-styleguide";
import AppHead from "@/Components/AppHead.vue";
import PlanHeader from "@/Components/PlanHeader.vue";
import Flash from "@/Components/Flash.vue";
import DataAdapter from "@/DataAdapter";
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
    locationsResource: {
        type: Object,
        required: true,
    },
    dayTimesResource: {
        type: Object,
        required: true,
    },
});

const locationFilter: Ref<Array<string>> = ref(
    props.planResource.data.locations.map((location: Location) => location.id)
);
const dayTimeFilter: Ref<Array<string>> = ref(
    props.planResource.data.dayTimes.map((dayTime: DayTime) => dayTime.id)
);

const locationOptions: ComputedRef<Array<CheckboxOption>> = computed(() => {
    return props.locationsResource.data.map(
        (location: Location): CheckboxOption => {
            return {
                name: location.id,
                label: location.name,
                value: location.id,
            };
        }
    );
});

const dayTimeOptions: ComputedRef<Array<CheckboxOption>> = computed(() => {
    return props.dayTimesResource.data
        .sort(
            (a: { sortIndex: number }, b: { sortIndex: number }) =>
                a.sortIndex - b.sortIndex
        )
        .map(
            (dayTime: {
                id: string;
                day: string;
                time: string;
            }): CheckboxOption => {
                return {
                    name: dayTime.id,
                    label: `${dayTime.day}${dayTime.time.toLowerCase()}`,
                    value: dayTime.id,
                };
            }
        );
});

const dataAdapter = new DataAdapter(
    props.planerSlug,
    props.planResource.data.slug
);

const save = () => {
    dataAdapter.saveSettings(dayTimeFilter.value, locationFilter.value);
};
</script>

<style lang="scss">
html:root {
    --w-container: 100%;
}
</style>