<template>
    <AppHead :planerName="planerName" title="Angebot" />
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
        <h1>Angebot</h1>
        <HfhFilterGroup @reset="onFilterReset">
            <HfhSelect
                id="filter-year"
                label="Jahr"
                :options="dateOptions.yearOptions"
                defaultOption="Alle"
                v-model="yearFilter"
            ></HfhSelect>
            <HfhSelect
                id="filter-semester"
                label="Semester"
                :options="dateOptions.semesterOptions"
                defaultOption="Alle"
                v-model="semesterFilter"
            ></HfhSelect>
            <HfhSelect
                id="filter-day"
                label="Tag"
                :options="dateOptions.dayOptions"
                defaultOption="Alle"
                v-model="dayFilter"
            ></HfhSelect>
            <HfhSelect
                id="filter-time"
                label="Zeit"
                :options="dateOptions.timeOptions"
                defaultOption="Alle"
                v-model="timeFilter"
            ></HfhSelect>
            <HfhSelect
                id="filter-category"
                label="Bereich"
                :options="categoryOptions"
                defaultOption="Alle"
                v-model="categoryFilter"
            ></HfhSelect>
        </HfhFilterGroup>
        <div v-for="year in nestedDates.years" :key="year.value">
            <template v-for="semester in year.semesters" :key="semester.value">
                <h2>{{ semester.value }} {{ semester.calendarYear }}</h2>
                <template v-for="day in semester.days">
                    <template v-for="time in semester.times">
                        <template
                            v-if="
                                getModulesByDate(
                                    year.value,
                                    semester.value,
                                    day,
                                    time
                                ).length > 0
                            "
                        >
                            <h3>{{ day }} - {{ time }}</h3>
                            <ul>
                                <li
                                    v-for="(module, index) in getModulesByDate(
                                        year.value,
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
        </div>
    </main>
</template>

<script setup lang="ts">
import AppHead from "@/Components/AppHead.vue";
import { getNestedDates } from "@/helpers";
import { Category, EventDate, Module } from "@/types";
import {
    HfhFilterGroup,
    HfhHeaderBar,
    HfhLogo,
    HfhSelect,
} from "@hfh-dlc/hfh-styleguide";
import { SelectOption } from "@hfh-dlc/hfh-styleguide/dist/components/HfhSelect.vue";
import { computed, ref, Ref } from "vue";
const props = defineProps({
    planerResource: {
        type: Object,
        required: true,
    },
});

const planerName = props.planerResource.data.name;
const moduleDirectoryUrl = props.planerResource.data.meta.moduleDirectoryUrl;
const brochureUrl = props.planerResource.data.meta.brochureUrl;

const yearFilter: Ref<string | undefined> = ref();
const semesterFilter: Ref<string | undefined> = ref();
const dayFilter: Ref<string | undefined> = ref();
const timeFilter: Ref<string | undefined> = ref();
const categoryFilter: Ref<string | undefined> = ref();

interface ModuleWithCategory extends Module {
    category: Category;
}

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

const filteredModules = computed(() => {
    return modules.filter((module) => {
        if (
            categoryFilter.value &&
            module.category.id.toString() !== categoryFilter.value
        ) {
            return false;
        }
        return true;
    });
});

const getEventDates = (modules: Array<Module>): Array<EventDate> => {
    return modules.reduce((acc, cur) => {
        acc.push(...cur.events);
        return acc;
    }, [] as Array<EventDate>);
};

const filteredEventDates = computed(() =>
    getEventDates(filteredModules.value).filter((eventDate) => {
        if (
            yearFilter.value &&
            eventDate.year.toString() !== yearFilter.value
        ) {
            return false;
        }
        if (
            semesterFilter.value &&
            eventDate.semester.toString() !== semesterFilter.value
        ) {
            return false;
        }
        if (dayFilter.value && eventDate.day.toString() !== dayFilter.value) {
            return false;
        }
        if (
            timeFilter.value &&
            eventDate.time.toString() !== timeFilter.value
        ) {
            return false;
        }
        return true;
    })
);

const nestedDates = computed(() => getNestedDates(filteredEventDates.value));

const getModulesByDate = (
    year: number,
    semester: string,
    day: string,
    time: string
) => {
    const result = filteredModules.value.filter((module) => {
        return module.events.some(
            (event) =>
                event.year == year &&
                event.semester == semester &&
                event.day == day &&
                event.time == time
        );
    });
    return result;
};

const categoryOptions: Ref<Array<SelectOption>> = computed(() =>
    props.planerResource.data.categories.map((category: Category) => ({
        label: category.name,
        value: category.id.toString(),
    }))
);

const dateOptions = computed(() => {
    const years = new Set<number>();
    const semesters = new Set<string>();
    const days = new Set<string>();
    const times = new Set<string>();

    for (const eventDate of getEventDates(modules)) {
        years.add(eventDate.year);
        semesters.add(eventDate.semester);
        days.add(eventDate.day);
        times.add(eventDate.time);
    }

    const yearOptions: Array<SelectOption> = [...years].map((year) => ({
        label: `${year} / ${year + 1}`,
        value: year.toString(),
    }));

    const semesterOptions: Array<SelectOption> = [...semesters].map(
        (semester) => ({
            label: semester,
            value: semester,
        })
    );

    const dayOptions: Array<SelectOption> = [...days].map((day) => ({
        label: day,
        value: day,
    }));

    const timeOptions: Array<SelectOption> = [...times].map((time) => ({
        label: time,
        value: time,
    }));

    return {
        yearOptions,
        semesterOptions,
        dayOptions,
        timeOptions,
    };
});

const onFilterReset = () => {
    yearFilter.value = undefined;
    semesterFilter.value = undefined;
    dayFilter.value = undefined;
    timeFilter.value = undefined;
    categoryFilter.value = undefined;
};
</script>

<style scoped>
h1 {
    display: inline-block;
    margin-bottom: 1.5rem;
    font-size: 2.25rem;
}
h2 {
    display: inline-block;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
}
p {
    margin-bottom: 1.5rem;
}
</style>
