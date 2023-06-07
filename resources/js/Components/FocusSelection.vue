<template>
    <div class="flex items-center gap-x-8">
        <div class="max-w-64">
            <HfhSelect
                id="first-focus"
                name="first-focus"
                label="Erster Studienschwerpunkt"
                :required="true"
                :options="firstOptions"
                v-model="firstFocusId"
                defaultOption="Bitte auswählen..."
                :disabled="store.readOnly"
            />
        </div>
        <div class="max-w-64">
            <HfhSelect
                id="second-focus"
                name="second-focus"
                label="Zweiter Studienschwerpunkt (Optional)"
                defaultOption="Bitte auswählen..."
                :options="secondOptions"
                v-model="secondFocusId"
                :disabled="store.readOnly"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useScheduleStore } from "../Store/schedule";
import { HfhSelect } from "@hfh-dlc/hfh-styleguide";
import { computed } from "vue";

const store = useScheduleStore();

const firstFocusId = computed({
    get() {
        const focusSelection = store.focusSelections.find(
            (focusSelection) => focusSelection.position == 0
        );
        if (focusSelection && focusSelection.focus) {
            return focusSelection.focus.id;
        }
        return "";
    },
    set(focusId: string) {
        store.selectFocus(0, focusId);
    },
});
const secondFocusId = computed({
    get() {
        const focusSelection = store.focusSelections.find(
            (focusSelection) => focusSelection.position == 1
        );
        if (focusSelection && focusSelection.focus) {
            return focusSelection.focus.id;
        }
        return "";
    },
    set(focusId: string) {
        store.selectFocus(1, focusId);
    },
});
const options = computed(() => {
    return store.foci.map((focus) => {
        return { label: focus.name, value: focus.id };
    });
});
const firstOptions = computed(() => {
    return options.value.filter(
        (option) => option.value !== secondFocusId.value
    );
});
const secondOptions = computed(() => {
    return options.value.filter(
        (option) => option.value !== firstFocusId.value
    );
});
</script>

<style lang="scss" scoped></style>
