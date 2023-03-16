<template>
    <button
        class="text-left mb-2 p-1 w-full rounded disabled:cursor-default"
        :class="{
            'module--selected': module.selected,
            'module--placed': module.placement && !module.misplaced,
            'module--disabled': disabled,
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
            v-if="module.placement && !module.misplaced"
            class="inline-block w-5 h-5 shrink-0 text-green-700"
        />
        {{ module.id }} {{ module.name }}
    </button>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";
import { useScheduleStore } from "../Store/schedule";
import { ScheduleModule } from "@/types";

const props = defineProps({
    module: {
        type: Object as PropType<ScheduleModule>,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
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

.module--disabled {
    @apply text-gray-400;
}
</style>
