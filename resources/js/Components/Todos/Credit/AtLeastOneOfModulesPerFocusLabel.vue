<template>
    <div>
        Rechnen Sie mindestens eines der Module
        <template v-for="(moduleId, index) in moduleIds" :key="moduleId">
            <span class="whitespace-nowrap inline-block"
                ><button @click="focusModule(moduleId)">
                    {{ moduleId }}</button
                ><template v-if="index < moduleIds.length - 2"
                    >,
                </template></span
            >
            <template v-if="index == moduleIds.length - 2"> oder </template>
        </template>
        an den SSP "{{ focusName }}" an.
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
    focusName: {
        type: String,
        required: true,
    },
});

const focusModule = (id: string) => {
    useEmitter().emit("focus-module", id);
};
</script>

<style lang="scss" scoped></style>
