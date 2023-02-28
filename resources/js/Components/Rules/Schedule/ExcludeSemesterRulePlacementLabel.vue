<template>
    <div>
        Das Modul
        <button @click="focusModule">
            {{ placement.module!.id }} {{ placement.module!.name }}
        </button>
        kann nicht im {{ positionText }} Semester belegt werden.`
    </div>
</template>

<script lang="ts" setup>
import { useEmitter } from "@/composables/useEmitter";
import { SchedulePlacement } from "@/types";
import { PropType, computed } from "vue";

const props = defineProps({
    placement: {
        type: Object as PropType<SchedulePlacement>,
        required: true,
    },
    excludePositions: {
        type: Array as PropType<Array<number>>,
        required: true,
    },
});

const emitter = useEmitter();

const positionText = computed(() => {
    return props.excludePositions.reduce((acc, cur, i, array) => {
        return (
            acc +
            (cur + 1) +
            "." +
            (i < array.length - 2 ? ", " : i < array.length - 1 ? " oder " : "")
        );
    }, "");
});
const focusModule = () => {
    emitter.emit("focus-module", props.placement.module!.id);
};
</script>
