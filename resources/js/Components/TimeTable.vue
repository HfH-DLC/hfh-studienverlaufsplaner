<template>
    <div v-for="(year, yearIndex) in store.nestedDates.years" :key="yearIndex">
        <div
            class="mb-4"
            v-for="(semester, semesterIndex) in year.semesters"
            :key="semesterIndex"
        >
            <table
                class="w-full divide-y divide-fantasy-plain table-fixed text-left border border-fantasy-plain"
            >
                <caption
                    class="text-white py-2 print:border-t print:border-l print:border-r print:text-black print:border-fantasy-plain print:bg-transparent"
                    :class="[
                        semesterIndex % 2 === 0
                            ? 'bg-thunderbird-red'
                            : 'bg-thunderbird-red-light',
                    ]"
                >
                    {{
                        getSemesterString(
                            yearIndex * 2 + semesterIndex + 1,
                            semester.value,
                            semester.calendarYear
                        )
                    }}
                </caption>
                <thead class="bg-fantasy-light">
                    <tr class="divide-x divide-fantasy-plain">
                        <th id="blank" class="w-1/5"></th>
                        <th
                            scope="col"
                            class="px-4 py-2 text-base text-hfh-gray-darkest font-normal"
                            v-for="timeWindow in semester.timeWindows"
                            :key="timeWindow"
                        >
                            <div class="flex items-center justify-center">
                                <span>{{ timeWindow }}</span>
                                <button
                                    class="p-2 flex items-center gap-1 hover:text-thunderbird-red"
                                    @click="setTimeWindowInfo(timeWindow)"
                                >
                                    <InformationCircleIcon
                                        class="w-5 h-5"
                                        aria-hidden="true"
                                    />
                                    <span class="sr-only"
                                        >Informationen zu diesem
                                        Zeitfenster</span
                                    >
                                </button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-fantasy-plain">
                    <template
                        v-for="dayTime in semester.dayTimes"
                        :key="dayTime"
                    >
                        <tr
                            v-if="
                                showTimetableRow(
                                    year.value,
                                    semester.value,
                                    dayTime
                                )
                            "
                            class="divide-x divide-fantasy-plain"
                        >
                            <th
                                scope="row"
                                class="px-4 py-2 text-base text-left bg-fantasy-light text-hfh-gray-darkest w-px font-normal"
                            >
                                <div>{{ dayTime.day }}:</div>
                                <div>{{ dayTime.time }}</div>
                            </th>
                            <td
                                v-for="timeWindow in semester.timeWindows"
                                :key="timeWindow"
                            >
                                <TimeSlot
                                    :showLocation="showLocations"
                                    :events="
                                        store.selectableEventsByDate({
                                            year: year.value,
                                            semester: semester.value,
                                            dayTime,
                                            timeWindow,
                                        })
                                    "
                                    :placement="
                                        store.placementByDate({
                                            year: year.value,
                                            semester: semester.value,
                                            dayTime,
                                            timeWindow,
                                        })
                                    "
                                    :availableModulesGroupedByLocations="
                                        store.modulesByDateGroupedByLocations({
                                            year: year.value,
                                            semester: semester.value,
                                            dayTime,
                                            timeWindow,
                                        })
                                    "
                                />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    <HfhDialog
        v-if="dialogInfo"
        :open="isDialogVisible"
        :title="dialogInfo.title"
        @closed="onDialogClosed"
        class="hfh-content"
    >
        <div v-html="dialogInfo.content"></div>
    </HfhDialog>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, nextTick } from "vue";
import TimeSlot from "./TimeSlot.vue";
import { useScheduleStore } from "../Store/schedule";
import { InformationCircleIcon } from "@heroicons/vue/24/outline";
import HfhDialog from "./HfhDialog.vue";
import { DayTime, Semester } from "@/types";

const isDialogVisible = ref(false);
const timeWindowContentList = [
    {
        title: "Pflichtmodule & Wahlpflichtmodule",
        content: "Semesterwochen 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
    },
    {
        title: "Berufspraxis, Portfolio & Masterarbeit",
        content: `<p>
              Berufspraxis/Portfolio Semesterwochen: 1, 6, 10, 14
            </p>
            <p>
              Masterarbeit: Kalenderwochen 34, 36, 38 (im Herbst), 5, 7, 8 (im Frühling)
            </p>`,
    },
];
const dialogInfo = ref() as Ref<{ title: string; content: string } | undefined>;
const store = useScheduleStore();

const showLocations = computed(() => {
    if (store.locationIds.length > 1) {
        return true;
    }

    const placedLocationIds = new Set(
        store.placements.map((placement) => placement.location.id)
    );
    if (
        [...placedLocationIds].filter((locationId) =>
            store.locationIds.includes(locationId)
        ).length < placedLocationIds.size
    ) {
        return true;
    }
    return false;
});

const setTimeWindowInfo = (timeWindow: string) => {
    dialogInfo.value = timeWindowContentList.find(
        (info) => info.title === timeWindow
    );
    isDialogVisible.value = true;
};
const onDialogClosed = () => {
    isDialogVisible.value = false;
};
const getSemesterString = (count: number, semester: Semester, year: number) => {
    let semesterName;
    if (semester == "HS") {
        semesterName = "Herbst";
    } else if (semester == "FS") {
        semesterName = "Frühling";
    }
    return `${count}. Semester (${semesterName} ${year})`;
};

const showTimetableRow = (
    year: number,
    semester: Semester,
    dayTime: DayTime
): boolean => {
    const placement = store.placementByDate({ year, semester, dayTime });
    if (placement) {
        return true;
    }
    return (
        store.modulesByDateGroupedByLocations({ year, semester, dayTime })
            .size > 0
    );
};

watch(
    () => store.selectedModule,
    () => {
        if (store.selectedModule && !store.selectedModule.placement)
            nextTick(() => {
                document
                    .querySelector<HTMLButtonElement>("[data-valid-slot=true]")
                    ?.focus();
            });
    }
);
</script>

<style lang="scss" scoped>
table {
    page-break-inside: avoid !important;
}
</style>
