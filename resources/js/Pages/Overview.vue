<template>
    <AppHead :planerName="planerName" title="Übersicht" />
    <header>
        <HfhHeaderBar>
            <template v-slot:right>
                <div class="px-4 py-3 leading-4">
                    <nav>
                        <ul class="flex gap-x-4">
                            <li v-if="moduleDirectoryUrl">
                                <a
                                    class="hover:text-thunderbird-red"
                                    :href="moduleDirectoryUrl"
                                    rel="noopener noreferer"
                                    target="_blank"
                                    >Modulverzeichnis</a
                                >
                            </li>
                            <li v-if="brochureUrl">
                                <a
                                    class="hover:text-thunderbird-red"
                                    :href="brochureUrl"
                                    rel="noopener noreferer"
                                    target="_blank"
                                    >Studienbroschüre</a
                                >
                            </li>
                            <li>
                                <a
                                    class="hover:text-thunderbird-red"
                                    href="https://hfh.ch"
                                    rel="noopener noreferer"
                                    target="_blank"
                                    >hfh.ch</a
                                >
                            </li>
                        </ul>
                    </nav>
                </div>
            </template>
        </HfhHeaderBar>
        <div
            class="flex justify-between px-4 pt-4 pb-4 max-w-container mx-auto"
        >
            <div class="flex gap-x-8 items-center">
                <HfhLogo />
                <div>
                    <div class="text-2xl">
                        Studienverlaufsplaner
                        <span v-if="planerName">{{ planerName }}</span>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <main class="p-4 max-w-container mx-auto hfh-content">
        <h1 class="mb-0">
            Angebot {{ currentSchoolYear }}/{{ currentSchoolYear + 1 }}
        </h1>
        <p class="mt-0">(Änderungen vorbehalten)</p>
        <HfhFilterGroup @reset="onFilterReset" orientation="vertical">
            <div>
                <HfhCheckbox
                    id="filter-semester"
                    legend="Semester"
                    :options="dateOptions.semesterOptions"
                    v-model="semesterFilter"
                    orientation="vertical"
                ></HfhCheckbox>
                <HfhCheckbox
                    id="filter-day"
                    legend="Tag"
                    :options="dateOptions.dayOptions"
                    v-model="dayFilter"
                    orientation="vertical"
                ></HfhCheckbox>
                <HfhCheckbox
                    id="filter-time"
                    legend="Halbtag"
                    :options="dateOptions.timeOptions"
                    v-model="timeFilter"
                    orientation="vertical"
                ></HfhCheckbox>
            </div>
            <div>
                <HfhCheckbox
                    id="filter-location"
                    legend="Standort"
                    :options="locationOptions"
                    orientation="vertical"
                    v-model="locationFilter"
                ></HfhCheckbox>
                <HfhCheckbox
                    id="filter-category"
                    legend="Bereich"
                    :options="categoryOptions"
                    v-model="categoryFilter"
                    orientation="vertical"
                ></HfhCheckbox>
            </div>
        </HfhFilterGroup>
        <template
            v-if="nestedDates"
            v-for="semester in nestedDates.semesters"
            :key="semester.value"
        >
            <h2>{{ getSemesterLabel(semester.value) }}</h2>

            <template v-for="day in semester.days">
                <template v-for="time in semester.times">
                    <template
                        v-if="
                            getModulesByDate(semester.value, day, time).length >
                            0
                        "
                    >
                        <h3>{{ day }} - {{ time }}</h3>
                        <ul>
                            <li
                                v-for="(module, index) in getModulesByDate(
                                    semester.value,
                                    day,
                                    time
                                )"
                                :key="index"
                            >
                                {{ module.id }} {{ module.name }}
                            </li>
                        </ul>
                    </template>
                </template>
            </template>
        </template>
        <p v-else class="text-center mt-8">
            Für Ihre aktuellen Filtereinstellungen wurden keine Module gefunden.
        </p>
    </main>
</template>

<script setup lang="ts">
import AppHead from "@/Components/AppHead.vue";
import { getNestedDates, orderDay, orderSemester, orderTime } from "@/helpers";
import { Category, Event, EventDate, Location, Module } from "@/types";
import {
    HfhFilterGroup,
    HfhHeaderBar,
    HfhLogo,
    HfhSelect,
    HfhCheckbox,
} from "@hfh-dlc/hfh-styleguide";
import type {
    CheckboxOption,
    SelectOption,
} from "@hfh-dlc/hfh-styleguide/types";
import { computed, ref, Ref } from "vue";
const props = defineProps({
    planerResource: {
        type: Object,
        required: true,
    },
    locationsResource: {
        type: Object,
        required: true,
    },
});

const planerName = props.planerResource.data.name;
const moduleDirectoryUrl = props.planerResource.data.meta.moduleDirectoryUrl;
const brochureUrl = props.planerResource.data.meta.brochureUrl;

const modules: Array<ModuleWithCategory> = [
    ...props.planerResource.data.categories.reduce(
        (acc: Array<ModuleWithCategory>, cur: Category) => {
            acc.push(
                ...cur.modules.map((module) => ({ ...module, category: cur }))
            );
            return acc;
        },
        []
    ),
];

const categoryOptions: Ref<Array<CheckboxOption>> = computed(() =>
    props.planerResource.data.categories.map((category: Category) => ({
        name: category.id.toString(),
        label: category.name,
        value: category.id.toString(),
    }))
);

const locationOptions: Ref<Array<CheckboxOption>> = computed(() => {
    const locations = props.locationsResource.data as Array<Location>;
    return locations
        .filter((location) =>
            getEvents(modules).some((event) => event.location === location.id)
        )
        .map(
            (location): CheckboxOption => ({
                name: location.id,
                label: location.name,
                value: location.id,
            })
        );
});

const defaultLocation: Ref<Location | undefined> = computed(() => {
    return (props.locationsResource.data as Array<Location>).find(
        (location) => location.default
    );
});

const getEvents = (modules: Array<Module>): Array<Event> => {
    return modules.reduce((acc, cur) => {
        acc.push(...cur.events);
        return acc;
    }, [] as Array<Event>);
};

const getSemesterLabel = (semesterAbbreviation: string): string => {
    if (semesterAbbreviation === "HS") {
        return "Herbstsemester";
    }
    if (semesterAbbreviation === "FS") {
        return "Frühlingssemester";
    }
    console.log("Unknown semesterAbbreviation " + semesterAbbreviation);
    return semesterAbbreviation;
};

const dateOptions = computed(() => {
    const semesters = new Set<string>();
    const days = new Set<string>();
    const times = new Set<string>();
    for (const event of getEvents(modules)) {
        semesters.add(event.semester);
        days.add(event.day);
        times.add(event.time);
    }
    const semesterOptions: Array<SelectOption> = [...semesters]
        .sort(orderSemester)
        .map((semester) => ({
            label: getSemesterLabel(semester),
            value: semester,
            name: semester,
        }));
    const dayOptions: Array<CheckboxOption> = [...days]
        .sort(orderDay)
        .map((day) => ({
            name: day,
            label: day,
            value: day,
        }));
    const timeOptions: Array<SelectOption> = [...times]
        .sort(orderTime)
        .map((time) => ({
            name: time,
            label: time,
            value: time,
        }));

    return {
        semesterOptions,
        dayOptions,
        timeOptions,
    };
});

const semesterFilter: Ref<string[]> = ref([]);
const dayFilter: Ref<string[]> = ref([]);
const timeFilter: Ref<string[]> = ref([]);
const categoryFilter: Ref<string[]> = ref([]);
const locationFilter: Ref<string[]> = ref(
    locationOptions.value
        .map((o) => o.value)
        .filter((value) => value === defaultLocation.value?.id)
);

interface ModuleWithCategory extends Module {
    category: Category;
}

const filteredModules = computed(() => {
    return modules.filter((module) => {
        if (
            categoryFilter.value.length > 0 &&
            !categoryFilter.value.includes(module.category.id.toString())
        ) {
            return false;
        }

        return true;
    });
});

const currentSchoolYear = computed(() => {
    const now = new Date();
    const schoolYearEndMonth = 4;
    if (now.getMonth() > schoolYearEndMonth) {
        return now.getFullYear();
    }
    return now.getFullYear() - 1;
});

const isInCurrentSchoolYear = (date: EventDate): boolean => {
    return date.year == currentSchoolYear.value;
};

const filteredEvents = computed(() =>
    getEvents(filteredModules.value).filter((event) => {
        if (!isInCurrentSchoolYear(event)) {
            return false;
        }
        if (
            semesterFilter.value.length > 0 &&
            !semesterFilter.value.includes(event.semester)
        ) {
            return false;
        }
        if (
            dayFilter.value.length > 0 &&
            !dayFilter.value.includes(event.day)
        ) {
            return false;
        }
        if (
            timeFilter.value.length > 0 &&
            !timeFilter.value.includes(event.time)
        ) {
            return false;
        }
        if (
            locationFilter.value.length > 0 &&
            !locationFilter.value.includes(event.location)
        ) {
            return false;
        }
        return true;
    })
);

const nestedDates = computed(() =>
    getNestedDates(filteredEvents.value).years.find(
        (year) => year.value === currentSchoolYear.value
    )
);

const getModulesByDate = (semester: string, day: string, time: string) => {
    const result = filteredModules.value.filter((module) => {
        return module.events.some(
            (event) =>
                event.year == currentSchoolYear.value &&
                event.semester == semester &&
                event.day == day &&
                event.time == time &&
                (locationFilter.value.length == 0 ||
                    locationFilter.value.includes(event.location))
        );
    });
    return result;
};

const onFilterReset = () => {
    semesterFilter.value = [];
    dayFilter.value = [];
    timeFilter.value = [];
    categoryFilter.value = [];
    locationFilter.value = defaultLocation.value
        ? [defaultLocation.value.id]
        : [];
};
</script>

<style scoped>
h1 {
    font-size: 2.25rem;
}
h2 {
    font-size: 1.5rem;
}
</style>
