<template>
    <div>
        Belegen Sie genau eines der Module
        <template v-for="(moduleId, index) in moduleIds" :key="moduleId">
            <span
                v-if="index < moduleIds.length - 1"
                class="whitespace-nowrap inline-block"
            >
                <button
                    @click="focusModule(moduleId)"
                    role="button"
                    tabIndex="0"
                    data-action="focus-module"
                    :data-module="moduleId"
                >
                    {{ moduleId }}</button
                >,
            </span>
            <span v-else class="whitespace-nowrap inline-block">
                <button
                    @click="focusModule(moduleId)"
                    role="button"
                    tabIndex="0"
                    data-action="focus-module"
                    :data-module="moduleId"
                >
                    {{ moduleId }}</button
                >.</span
            >
        </template>
    </div>
</template>

<script lang="ts" setup>
import { useEmitter } from "@/composables/useEmitter";
import { PropType } from "vue";

const props = defineProps({
    moduleIds: {
        type: Array as PropType<Array<string>>,
        required: true,
    },
});

const focusModule = (moduleId: string) => {
    useEmitter().emit("focus-module", moduleId);
};
</script>

<style lang="scss" scoped></style>
