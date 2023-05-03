<template>
    <div>
        Das Modul
        <button @click="focusModule">
            {{ placement.module.id }} {{ placement.module.name }}
        </button>
        ist am Datum {{ placement.semester }} {{ placement.year }},
        {{ placement.timeWindow }}, {{ placement.dayTime.day }}
        {{ placement.dayTime.time }} nicht verfügbar.
    </div>
</template>

<script lang="ts" setup>
import { useEmitter } from "@/composables/useEmitter";
import { SchedulePlacement } from "@/types";
import { PropType } from "vue";

const props = defineProps({
    placement: {
        type: Object as PropType<SchedulePlacement>,
        required: true,
    },
});

const focusModule = () => {
    useEmitter().emit("focus-module", props.placement.module.id);
};
</script>
