<template>
    <div>
        <ul class="space-y-2">
            <li v-for="(entry, index) in uncheckedEntries" :key="index">
                <ChecklistEntry :entry="entry" />
            </li>
            <li v-for="(entry, index) in checkedEntries" :key="index">
                <ChecklistEntry :entry="entry" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { ChecklistEntryData } from "@/types";
import { PropType } from "@vue/runtime-core";
import { computed } from "vue";
import ChecklistEntry from "./ChecklistEntry.vue";

const props = defineProps({
    entries: {
        type: Array as PropType<Array<ChecklistEntryData>>,
        required: true,
    },
});
const checkedEntries = computed(() => {
    return props.entries.filter((entry) => entry.checked);
});
const uncheckedEntries = computed(() => {
    return props.entries.filter((entry) => !entry.checked);
});
</script>

<style lang="scss" scoped></style>
