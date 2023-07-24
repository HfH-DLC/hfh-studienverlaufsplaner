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
                :showFocusSelection="focusSelectionEnabled"
                :showTour="false"
                :saveStatus="SaveStatus.Saved"
            />
        </header>
        <div>
            <main class="flex-1 flex flex-col p-4 hfh-content">
                <h2>Einstellungen</h2>
                <div class="hfh-label">Wann möchten Sie Module besuchen?</div>
                <Flash class="fixed top-4 left-1/2 -translate-x-1/2" />
                <div>
                    <div class="grid grid-cols-4 mb-8">
                        <HfhCheckbox
                            v-for="day in dayNames"
                            :key="day"
                            :id="`filter-day-time`"
                            :legend="day"
                            :options="dayTimeOptionsPerDay[day]"
                            v-model="dayTimeFilterPerDay[day]"
                            orientation="vertical"
                            @update:model-value="save"
                        ></HfhCheckbox>
                    </div>
                    <HfhCheckbox
                        id="filter-location"
                        legend="Wo möchten Sie Module besuchen?"
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
import { HfhCheckbox } from "@hfh-dlc/hfh-styleguide";
import AppHead from "@/Components/AppHead.vue";
import PlanHeader from "@/Components/PlanHeader.vue";
import Flash from "@/Components/Flash.vue";
import DataAdapter from "@/DataAdapter";
import type { CheckboxOption } from "@hfh-dlc/hfh-styleguide/types";
import MainLayout from "@/Layouts/MainLayout.vue";

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
    locationsResource: {
        type: Object,
        required: true,
    },
    dayTimesResource: {
        type: Object,
        required: true,
    },
    focusSelectionEnabled: {
        type: Boolean,
        required: true,
    },
});

const locationFilter: Ref<Array<string>> = ref(
    props.planResource.data.locations.map((location: Location) => location.id)
);
const dayTimeFilterPerDay: Ref<Record<string, Array<string>>> = ref(
    props.planResource.data.dayTimes.reduce(
        (acc: Record<string, Array<string>>, cur: DayTime) => {
            if (!acc[cur.day]) {
                acc[cur.day] = [];
            }
            acc[cur.day].push(cur.id);
            return acc;
        },
        {}
    )
);

const dayTimeFilter: ComputedRef<Array<string>> = computed(() => {
    const result: Array<string> = [];
    Object.values(dayTimeFilterPerDay.value).forEach((value) => {
        result.push(...value);
    });
    return result;
});

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

const dayNames: ComputedRef<Array<string>> = computed(() => {
    return Array.from(
        props.dayTimesResource.data
            .sort(
                (a: { sortIndex: number }, b: { sortIndex: number }) =>
                    a.sortIndex - b.sortIndex
            )
            .reduce((acc: Set<string>, cur: DayTime) => {
                acc.add(cur.day);
                return acc;
            }, new Set<string>())
    );
});

const dayTimeOptionsPerDay: ComputedRef<Record<string, Array<CheckboxOption>>> =
    computed(() => {
        return props.dayTimesResource.data
            .sort(
                (a: { sortIndex: number }, b: { sortIndex: number }) =>
                    a.sortIndex - b.sortIndex
            )
            .reduce(
                (acc: Record<string, Array<CheckboxOption>>, cur: DayTime) => {
                    const option: CheckboxOption = {
                        name: cur.id,
                        label: cur.time,
                        value: cur.id,
                    };
                    if (!acc[cur.day]) {
                        acc[cur.day] = [];
                    }
                    acc[cur.day].push(option);
                    return acc;
                },
                []
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
