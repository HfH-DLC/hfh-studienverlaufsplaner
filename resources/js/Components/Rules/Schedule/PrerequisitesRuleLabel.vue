<template>
    <div>
        <template v-if="prerequisites.length === 1">
            Das Modul
            <button @click="focusModule(prerequisites[0])">
                {{ prerequisites[0].id }}
                {{ prerequisites[0].name }}
            </button>
            muss vor
            <button @click="focusModule(module)">
                {{ module.id }} {{ module.name }}
            </button>
            belegt werden.
        </template>
        <template v-else>
            <template v-if="prerequisiteGroup.requiredCount">
                {{ prerequisiteGroup.requiredCount }} der Module
            </template>
            <template v-else>Die Module</template>
            <template
                v-for="(prerequisite, index) in prerequisites"
                :key="prerequisite.id"
            >
                <button @click="focusModule(prerequisite)">
                    {{ prerequisite.id }} {{ prerequisite.name }}
                </button>
                <span v-if="index < prerequisites.length - 2">, </span>
                <span v-if="index == prerequisites.length - 2"> und </span>
            </template>
            <template v-if="prerequisiteGroup.requiredCount === 1">
                muss vor
            </template>
            <template v-else> müssen vor </template>
            <button @click="focusModule(module)">
                {{ module.id }} {{ module.name }}
            </button>
            belegt werden.
        </template>
    </div>
</template>

<script lang="ts" setup>
import { useScheduleStore } from "@/Store/schedule";
import { useEmitter } from "@/composables/useEmitter";
import { PrerequisiteGroup, ScheduleModule } from "@/types";
import { ComputedRef, PropType, computed } from "vue";

const props = defineProps({
    module: {
        type: Object as PropType<ScheduleModule>,
        required: true,
    },
    prerequisiteGroup: {
        type: Object as PropType<PrerequisiteGroup>,
        required: true,
    },
});

const store = useScheduleStore();

const prerequisites: ComputedRef<Array<ScheduleModule>> = computed(() => {
    const result = props.prerequisiteGroup.prerequisiteIds.reduce(
        (acc, cur) => {
            const module = store.moduleById(cur);
            if (module) {
                acc.push(module);
            }
            return acc;
        },
        [] as Array<ScheduleModule>
    );
    return result;
});

const focusModule = (module: ScheduleModule) => {
    useEmitter().emit("focus-module", module.id);
};
</script>

<style lang="scss" scoped></style>
