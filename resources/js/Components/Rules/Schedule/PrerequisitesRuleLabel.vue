<template>
    <div>
        <template v-if="missingPrerequisites.length === 1">
            Das Modul
            <button @click="focusModule(missingPrerequisites[0])">
                {{ missingPrerequisites[0].id }}
                {{ missingPrerequisites[0].name }}
            </button>
            muss vor
            <button @click="focusModule(module)">
                {{ module.id }} {{ module.name }}
            </button>
            belegt werden.
        </template>
        <template v-else>
            Die Module
            <template
                v-for="(prerequisite, index) in missingPrerequisites"
                :key="prerequisite.id"
            >
                <button @click="focusModule(prerequisite)">
                    {{ prerequisite.id }} {{ prerequisite.name }}
                </button>
                <span v-if="index < missingPrerequisites.length - 3">, </span>
                <span v-if="index == missingPrerequisites.length - 2">
                    und
                </span>
            </template>
            müssen vor
            <button @click="focusModule(module)">
                {{ module.id }} {{ module.name }}
            </button>
            belegt werden.
        </template>
    </div>
</template>

<script lang="ts" setup>
import { useEmitter } from "@/composables/useEmitter";
import { ScheduleModule } from "@/types";
import { PropType } from "vue";

const props = defineProps({
    module: {
        type: Object as PropType<ScheduleModule>,
        required: true,
    },
    missingPrerequisites: {
        type: Array as PropType<Array<ScheduleModule>>,
        required: true,
    },
});

const focusModule = (module: ScheduleModule) => {
    useEmitter().emit("focus-module", module.id);
};
</script>

<style lang="scss" scoped></style>
