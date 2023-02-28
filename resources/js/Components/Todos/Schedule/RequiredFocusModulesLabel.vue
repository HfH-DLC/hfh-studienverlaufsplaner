<template>
    <div>
        Belegen Sie für den SSP "{{ focusName }}" {{ countString }}
        <template v-for="(module, index) in modules" :key="module.id">
            <span v-if="index < modules.length - 1" class="whitespace-nowrap">
                <button
                    @click="focusModule(module)"
                    role="button"
                    tabIndex="0"
                    data-action="focus-module"
                    :data-module="module.id"
                >
                    {{ module.id }}</button
                >,
            </span>
            <span v-else class="whitespace-nowrap">
                <button
                    @click="focusModule(module)"
                    role="button"
                    tabIndex="0"
                    data-action="focus-module"
                    :data-module="module.id"
                >
                    {{ module.id }}</button
                >.
            </span>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { useEmitter } from "@/composables/useEmitter";
import { ScheduleModule } from "@/types";
import { PropType, computed } from "vue";

const props = defineProps({
    focusName: {
        type: String,
        required: true,
    },
    modules: {
        type: Array as PropType<Array<ScheduleModule>>,
        required: true,
    },
});

const countString = computed(() => {
    if (props.modules.length == 1) {
        return "das Modul";
    } else {
        return "die Module";
    }
});

const focusModule = (module: ScheduleModule) => {
    useEmitter().emit("focus-module", module.id);
};
</script>

<style lang="scss" scoped></style>
