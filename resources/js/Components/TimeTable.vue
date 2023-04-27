<template>
    <div v-for="(year, yearIndex) in store.nestedDates.years" :key="yearIndex">
        <div
            class="mb-4"
            v-for="(semester, semesterIndex) in year.semesters"
            :key="semesterIndex"
        >
            <table
                class="w-full divide-y divide-gray-300 table-fixed text-left border border-gray-300"
            >
                <caption
                    class="text-white py-2 print:border-t print:border-l print:border-r print:text-black print:border-gray-300 print:bg-transparent"
                    :class="[
                        semesterIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-600',
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
                <thead class="bg-gray-50">
                    <tr class="divide-x divide-gray-300">
                        <th id="blank" class="w-1/5"></th>
                        <th
                            scope="col"
                            class="px-4 py-2 text-base text-gray-600 font-normal"
                            v-for="timeWindow in semester.timeWindows"
                            :key="timeWindow"
                        >
                            <div class="flex items-center">
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
                <tbody class="bg-white divide-y divide-gray-300">
                    <template v-for="day in semester.days" :key="day">
                        <template v-for="time in semester.times" :key="time">
                            <tr
                                v-if="
                                    showTimetableRow(
                                        year.value,
                                        semester.value,
                                        day,
                                        time
                                    )
                                "
                                class="divide-x divide-gray-300"
                            >
                                <th
                                    scope="row"
                                    class="px-4 py-2 text-base text-left bg-gray-50 text-gray-600 w-px font-normal"
                                >
                                    {{ day }}: {{ time }}
                                </th>
                                <td
                                    v-for="timeWindow in semester.timeWindows"
                                    :key="timeWindow"
                                >
                                    <TimeSlot
                                        :showLocation="showLocations"
                                        :events="
                                            store.selectableEventsByDate(
                                                year.value,
                                                semester.value,
                                                day,
                                                time,
                                                timeWindow
                                            )
                                        "
                                        :placement="
                                            store.placementByDate(
                                                year.value,
                                                semester.value,
                                                day,
                                                time,
                                                timeWindow
                                            )
                                        "
                                        :availableModulesGroupedByLocations="
                                            store.modulesByDateGroupedByLocations(
                                                year.value,
                                                semester.value,
                                                day,
                                                time,
                                                timeWindow
                                            )
                                        "
                                    />
                                </td>
                            </tr>
                        </template>
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
    const checkedLocations = new Set(
        store.locations
            .filter((location) => location.checked)
            .map((location) => location.id)
    );
    if (checkedLocations.size > 1) {
        return true;
    }
    const placedLocations = store.placements.reduce((acc, cur) => {
        acc.add(cur.location);
        return acc;
    }, new Set<string>());
    if (placedLocations.size > 1) {
        return true;
    }
    if (
        [...placedLocations].filter((location) =>
            checkedLocations.has(location)
        ).length < placedLocations.size
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
const getSemesterString = (count: number, semester: string, year: number) => {
    if (semester == "HS") {
        semester = "Herbst";
    } else if (semester == "FS") {
        semester = "Frühling";
    }
    return `${count}. Semester (${semester} ${year})`;
};

const showTimetableRow = (
    year: number,
    semester: string,
    day: string,
    time: string
): boolean => {
    const placement = store.placementByDate(year, semester, day, time);
    if (placement) {
        return true;
    }
    return (
        store.modulesByDateGroupedByLocations(year, semester, day, time).size >
        0
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
