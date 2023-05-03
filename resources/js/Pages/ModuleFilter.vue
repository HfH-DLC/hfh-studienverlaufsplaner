<template>
    <AppHead :planerName="planerName" title="Modulfilter" />
    <header>
        <PageHeader
            :planer-name="planerName"
            :planer-slug="planerSlug"
            :brochure-url="brochureUrl"
            :module-directory-url="moduleDirectoryUrl"
        ></PageHeader>
    </header>
    <main class="p-4 pb-16 max-w-container mx-auto">
        <div class="hfh-content">
            <h1 class="mb-0">Modulfilter</h1>
            <p class="mt-0">
                (Stand {{ props.year }}/{{ currentSchoolYear + 1 }})
            </p>
        </div>

        <div class="lg:flex lg:gap-x-16">
            <HfhFilterGroup @reset="onFilterReset">
                <HfhCheckbox
                    v-if="locationOptions.length > 1"
                    id="filter-location"
                    legend="Standort"
                    :options="locationOptions"
                    orientation="vertical"
                    v-model="locationFilter"
                ></HfhCheckbox>
                <HfhCheckbox
                    id="filter-semester"
                    legend="Semester"
                    :options="dateOptions.semesterOptions"
                    v-model="semesterFilter"
                    orientation="vertical"
                ></HfhCheckbox>
                <HfhCheckbox
                    id="filter-day"
                    legend="Zeitpunkt"
                    :options="dateOptions.dayTimeOptions"
                    v-model="dayTimeFilter"
                    orientation="vertical"
                ></HfhCheckbox>
                <HfhCheckbox
                    id="filter-category"
                    legend="Bereich"
                    :options="categoryOptions"
                    v-model="categoryFilter"
                    orientation="vertical"
                ></HfhCheckbox>
            </HfhFilterGroup>
            <div class="flex-1">
                <h2 class="mb-2 hfh-sr-only">Resultate</h2>
                <div aria-live="polite">
                    <p v-if="filteredEvents.length === 0">
                        Mit ihren aktuellen Filtereinstellungen wurden keine
                        Veranstaltungen gefunden.
                    </p>
                    <p v-if="filteredEvents.length > 0">
                        <span class="font-bold"
                            >{{ filteredEvents.length }}
                        </span>
                        Veranstaltungen
                    </p>
                </div>
                <template
                    v-if="nestedDates"
                    v-for="semester in nestedDates.semesters"
                    :key="semester.value"
                >
                    <div class="mt-4 grid gap-y-4">
                        <template v-for="dayTime in semester.dayTimes">
                            <ModuleFilterItem
                                :modules="
                                    getModulesByDate(
                                        semester.value,
                                        dayTime
                                    ).map(
                                        (module) =>
                                            `${module.id} ${module.name}`
                                    )
                                "
                                :semester="getSemesterLabel(semester.value)"
                                :dayTime="dayTime"
                            ></ModuleFilterItem>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import AppHead from "@/Components/AppHead.vue";
import ModuleFilterItem from "@/Components/ModuleFilterItem.vue";
import PageHeader from "@/Components/PageHeader.vue";
import { getNestedDates, orderSemester } from "@/helpers";
import { Category, DayTime, Event, EventDate, Location, Module } from "@/types";
import { HfhFilterGroup, HfhCheckbox } from "@hfh-dlc/hfh-styleguide";
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
    dayTimeResource: {
        type: Object,
        required: true,
    },
    eventsResource: {
        type: Object,
        required: true,
    },
    locationsResource: {
        type: Object,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
});

const planerName = props.planerResource.data.name;
const planerSlug = props.planerResource.data.slug;
const moduleDirectoryUrl = props.planerResource.data.meta.moduleDirectoryUrl;
const brochureUrl = props.planerResource.data.meta.brochureUrl;
const currentSchoolYear = parseInt(props.year);

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
            getEvents(modules).some(
                (event) => event.location.id === location.id
            )
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
    const semesters = new Set<string>(
        props.eventsResource.data.map((event: Event) => event.semester)
    );

    const semesterOptions: Array<SelectOption> = [...semesters]
        .sort(orderSemester)
        .map((semester) => ({
            label: getSemesterLabel(semester),
            value: semester,
            name: semester,
        }));
    const dayTimeOptions: Array<CheckboxOption> = [
        ...props.dayTimeResource.data,
    ]
        .sort((a, b) => a.sortIndex - b.sortIndex)
        .map((dayTime) => ({
            name: dayTime.id,
            label: dayTime.day + dayTime.time.toLocaleLowerCase(),
            value: dayTime.id,
        }));

    return {
        semesterOptions,
        dayTimeOptions,
    };
});

const semesterFilter: Ref<string[]> = ref([]);
const dayTimeFilter: Ref<string[]> = ref([]);
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

const isInCurrentSchoolYear = (date: EventDate): boolean => {
    return date.year == currentSchoolYear;
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
            dayTimeFilter.value.length > 0 &&
            !dayTimeFilter.value.includes(event.dayTime.id)
        ) {
            return false;
        }
        if (
            locationFilter.value.length > 0 &&
            !locationFilter.value.includes(event.location.id)
        ) {
            return false;
        }
        return true;
    })
);

const nestedDates = computed(() =>
    getNestedDates(filteredEvents.value).years.find(
        (year) => year.value === currentSchoolYear
    )
);

const getModulesByDate = (semester: string, dayTime: DayTime) => {
    const result = filteredModules.value.filter((module) => {
        return module.events.some(
            (event) =>
                event.year == currentSchoolYear &&
                event.semester == semester &&
                event.dayTime.id == dayTime.id &&
                (locationFilter.value.length == 0 ||
                    locationFilter.value.includes(event.location.id))
        );
    });
    return result;
};

const onFilterReset = () => {
    semesterFilter.value = [];
    dayTimeFilter.value = [];
    categoryFilter.value = [];
    locationFilter.value = defaultLocation.value
        ? [defaultLocation.value.id]
        : [];
};
</script>

<style scoped lang="scss">
h1 {
    font-size: 2.25rem;
}
h2 {
    font-size: 1.5rem;
}
:deep() .hfh-filter-group .hfh-filter-group__inner {
    display: block;
    > .hfh-label {
        margin-bottom: 1rem;
    }
    .hfh-checkbox-label {
        white-space: nowrap;
    }
}
</style>
