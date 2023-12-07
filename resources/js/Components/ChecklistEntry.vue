<template>
    <div class="checklist-entry">
        <span class="hfh-sr-only">{{ entryCheckedText }}</span>
        <div class="flex gap-x-1 items-top">
            <CheckCircleIcon
                class="w-5 h-5 shrink-0 mt-0.5 text-hfh-green"
                v-if="entry.checked"
            />
            <CircleIcon class="inline-block w-5 h-5 shrink-0 mt-0.5" v-else />
            <div :class="{ 'text-hfh-green': entry.checked }">
                <component
                    v-if="entry.component && entry.labelProps"
                    :is="entry.component"
                    ref="label"
                    v-bind="entry.labelProps"
                />
                <div v-else-if="entry.label" v-html="entry.label"></div>
                <div v-if="entry.progressLabel">
                    (Aktuell: {{ entry.progressLabel }})
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
import CircleIcon from "./CircleIcon.vue";
import { computed, PropType } from "vue";
import { ChecklistEntryData } from "@/types";
const props = defineProps({
    entry: {
        type: Object as PropType<ChecklistEntryData>,
        required: true,
    },
});
const entryCheckedText = computed((): string => {
    return props.entry.checked ? "Erfüllt:" : "Offen:";
});
</script>

<style lang="scss" scoped>
.checklist-entry {
    page-break-inside: avoid;
}
</style>
