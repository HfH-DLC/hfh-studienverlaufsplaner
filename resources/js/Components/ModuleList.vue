<template>
    <div class="pb-4">
        <HfhAccordion
            v-for="(category, index) in filteredCategories"
            :key="category.id"
            :open="currentOpen === index"
            @opened="currentOpen = index"
            @closed="currentOpen == index && (currentOpen = -1)"
            ref="categoryRefs"
        >
            <template v-slot:title>
                {{ category.name }}
            </template>
            <template v-slot:content>
                <ul>
                    <li v-for="module in category.modules" :key="module.id">
                        <Module :module="module" />
                    </li>
                </ul>
            </template>
        </HfhAccordion>
    </div>
</template>

<script lang="ts" setup>
import { HfhAccordion } from "@hfh-dlc/hfh-styleguide";
import Module from "../Components/Module.vue";
import { useScheduleStore } from "../Store/schedule";
import {
    ComponentPublicInstance,
    ref,
    Ref,
    onBeforeUnmount,
    nextTick,
    computed,
} from "vue";
import { useEmitter } from "@/composables/useEmitter";
import { Event, ScheduleModule } from "@/types";

const store = useScheduleStore();

const currentOpen = ref(0);
const categoryRefs = ref([]) as Ref<Array<ComponentPublicInstance>>;

const focusCategory = (categoryId: number) => {
    const index = filteredCategories.value.findIndex(
        (category) => category.id == categoryId
    );
    if (index >= 0) {
        store.deselectModule();
        openActiveAccordion(index);
        nextTick(() => {
            const ref = categoryRefs.value[index];
            const summary = ref.$el.querySelector("summary");
            if (summary) {
                summary.focus();
            }
        });
    }
};

const openCategoryByModule = (moduleId: string) => {
    const index = filteredCategories.value.findIndex((category) =>
        category.modules.some((module) => module.id == moduleId)
    );
    if (index >= 0) {
        openActiveAccordion(index);
    }
};

const emitter = useEmitter();
emitter.on("focus-category", focusCategory);
emitter.on("focus-module", openCategoryByModule);

onBeforeUnmount(() => {
    emitter.off("focus-category", focusCategory);
    emitter.on("focus-module", openCategoryByModule);
});

const filteredCategories = computed(() => {
    return store.categories
        .map((category) => ({
            ...category,
            modules: category.modules.reduce(
                (acc: Array<ScheduleModule>, cur: ScheduleModule) => {
                    const events = cur.events.filter(
                        (event) =>
                            store.locationIds.includes(event.location.id) &&
                            store.dayTimes.some(
                                (dayTime) => dayTime.id === event.dayTime.id
                            )
                    );
                    if (events.length > 0) {
                        acc.push({
                            ...cur,
                            events,
                        });
                    }
                    return acc;
                },
                []
            ),
        }))
        .filter((category) => category.modules.length > 0);
});

const openActiveAccordion = (index: number) => {
    if (index > -1) {
        currentOpen.value = index;
    }
};
</script>

<style lang="scss" scoped></style>
