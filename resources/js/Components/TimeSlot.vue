<template>
    <div
        class="min-h-16 h-full relative p-1 flex flex-col gap-y-2 justify-center"
    >
        <template v-if="placement">
            <button
                ref="placementElement"
                class="placement text-sm text-left disabled:cursor-default w-full p-4 border border-gray-300 rounded 'bg-gray-50' transition-all"
                :class="{
                    'slot--invalid': invalidPlacement,
                }"
                @click="onModuleClick"
            >
                <div class="flex items-start">
                    <XCircleIcon
                        v-if="invalidPlacement"
                        class="text-red-600 mr-2 w-5 h-5 shrink-0"
                    />
                    <div class="overflow-hidden">
                        <div class="truncate">
                            {{ placement.module.id }}
                            {{ placement.module.name }}
                        </div>
                        <div v-if="showLocation">
                            Standort:
                            {{ placement.location.name }}
                        </div>
                    </div>
                </div>
            </button>
            <ContextMenu
                class="absolute -bottom-8 right-2"
                v-if="!store.readOnly && placement.module.selected"
                :placement="placement"
            />
        </template>
        <div
            v-else-if="!store.readOnly && filteredEvents.length > 0"
            class="flex flex-wrap gap-2"
        >
            <template v-for="event in filteredEvents" :key="event.id">
                <button
                    :data-valid-slot="event.valid"
                    class="slot text-sm text-left disabled:cursor-default w-full p-4 border border-gray-300 rounded bg-white transition-all shadow-inner grow-1 shrink-1 min-w-content"
                    :class="event.valid ? 'slot--valid' : 'slot--invalid'"
                    @click="onPlaceModule(event)"
                >
                    <span class="hfh-sr-only">Modul platzieren</span>
                    <span class="flex items-center gap-x-2">
                        <CheckCircleIcon
                            v-if="event.valid"
                            class="text-green-700 w-5 h-5 shrink-0"
                        />
                        <XCircleIcon
                            v-else
                            class="text-red-600 w-5 h-5 shrink-0"
                        />
                        <span v-if="showLocation"
                            >Standort: {{ event.location.name }}</span
                        >
                    </span>
                </button>
            </template>
        </div>
        <div
            v-else-if="
                !store.selectedModule &&
                availableModulesGroupedByLocations.size > 0
            "
            class="flex justify-center items-center h-full"
        >
            <button
                class="p-2 grid place-items-center gap-1 hover:text-thunderbird-red"
                @click="openDialog"
            >
                <InformationCircleIcon
                    class="w-5 h-5 text-gray-600"
                    aria-hidden="true"
                />
                <span class="sr-only">Verfügbare Module anzeigen</span>
            </button>
            <HfhDialog
                v-if="isDialogVisible"
                :open="isDialogVisible"
                title="Verfügbare Module"
                @closed="onDialogClosed"
                class="hfh-content"
            >
                <div
                    v-for="entry in availableModulesGroupedByLocations"
                    :key="entry[0]"
                    class="mb-4"
                >
                    <h3 class="mb-2">
                        Standort {{ getLocationName(entry[0]) }}
                    </h3>
                    <ul>
                        <li v-for="module in entry[1]" :key="module.id">
                            {{ module.id }} {{ module.name }}
                        </li>
                    </ul>
                </div>
            </HfhDialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import { useScheduleStore } from "../Store/schedule";
import { isSameDate } from "../helpers";
import HfhDialog from "./HfhDialog.vue";

import ContextMenu from "./ContextMenu.vue";
import { PropType, ref, Ref, computed, watch } from "vue";
import {
    Event,
    Location,
    ScheduleModule,
    SchedulePlacement,
    SelectableEvent,
} from "@/types";

const props = defineProps({
    events: {
        type: Array as PropType<Array<SelectableEvent>>,
        default: [],
    },
    placement: {
        type: Object as PropType<SchedulePlacement | undefined>,
        default: null,
    },
    showLocation: {
        type: Boolean,
        required: true,
    },
    availableModulesGroupedByLocations: {
        type: Object as PropType<Map<string, Array<ScheduleModule>>>,
        required: true,
    },
});

const isDialogVisible = ref(false);

const store = useScheduleStore();

const placementElement = ref() as Ref<HTMLElement | undefined>;

const onModuleClick = () => {
    if (props.placement!.module.selected) {
        store.deselectModule();
    } else {
        store.selectModule(props.placement!.module.id);
    }
};
const onPlaceModule = (event: Event) => {
    store.placeModule(event);
};
const focusPlacement = () => {
    placementElement.value?.focus();
};

watch(
    () => store.selectedModule,
    () => {
        if (
            store.selectedModule &&
            store.selectedModule.placement &&
            props.placement &&
            store.selectedModule.placement.id === props.placement.id
        ) {
            focusPlacement();
        }
    }
);

const placementMatchesEvent = (placement: SchedulePlacement, event: Event) => {
    return (
        isSameDate(placement, event) &&
        placement.location.id == event.location.id
    );
};
const openDialog = () => {
    isDialogVisible.value = true;
};
const onDialogClosed = () => {
    isDialogVisible.value = false;
};

const invalidPlacement = computed(() => {
    return (
        props.placement &&
        props.placement.errors &&
        props.placement.errors.length > 0
    );
});
const filteredEvents = computed(() => {
    return props.events.filter((event) => {
        const isActiveLocation = store.locationIds.some(
            (id) => id === event.location.id
        );

        const isCurrent = props.placement
            ? placementMatchesEvent(props.placement, event)
            : false;
        return isActiveLocation && !isCurrent;
    });
});

const getLocationName = (id: string) => {
    const location = store.locations.find((location) => location.id === id);
    return location ? location.name : "";
};
</script>

<style lang="scss" scoped>
.slot--invalid {
    @apply bg-red-50 text-red-600;
}

.slot--valid {
    @apply bg-green-50;
}

.placement:focus,
.slot:focus {
    outline: 2px solid var(--c-blue);
    outline-offset: 0;
}
</style>
