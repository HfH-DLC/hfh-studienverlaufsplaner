<template>
    <button
        class="text-left mb-2 p-1 w-full rounded disabled:cursor-default"
        :class="{
            'module--selected': module.selected,
            'module--placed':
                (module.placement && !module.misplaced) || hasPriorLearning,
            'module--error': module.misplaced,
        }"
        :disabled="disabled"
        @click="onClick"
    >
        <XCircleIcon
            v-if="module.misplaced"
            class="inline-block w-5 h-5 shrink-0 text-red-600"
        />
        <CheckCircleIcon
            v-if="showCheckmark"
            class="inline-block w-5 h-5 shrink-0 text-green-700"
        />
        <span
            ><span v-if="hasPriorLearning">(Vorleistung)</span> {{ module.id }}
            {{ module.name }}</span
        >
    </button>
</template>

<script lang="ts" setup>
import { PropType, computed } from "vue";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";
import { useScheduleStore } from "../Store/schedule";
import { ScheduleModule } from "@/types";

const props = defineProps({
    module: {
        type: Object as PropType<ScheduleModule>,
        required: true,
    },
});

const store = useScheduleStore();

const onClick = () => {
    if (props.module.selected) {
        store.deselectModule();
    } else {
        store.selectModule(props.module.id);
    }
};

const hasPriorLearning = computed(() => {
    return store.priorLearnings.some(
        (priorLearning) => priorLearning.countsAsModuleId === props.module.id
    );
});

const showCheckmark = computed(() => {
    if (hasPriorLearning.value) {
        return true;
    }
    if (props.module.placement && !props.module.misplaced) {
        return true;
    }
});

const disabled = hasPriorLearning;
</script>

<style lang="scss" scoped>
.module--selected {
    @apply font-bold;
    @apply tracking-tighter;
}

.module--error {
    @apply text-red-600;
}

.module--placed {
    @apply text-green-700;
}
</style>
