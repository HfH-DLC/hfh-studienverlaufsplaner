<template>
    <div>
        Belegen Sie im Bereich
        <button @click="focusCategory">"{{ category.name }}"</button>
        <template v-if="hasMin && !hasMax">
            mindestens {{ category.minECTS }}
        </template>
        <template v-if="minEqualsMax"> genau {{ category.minECTS }} </template>
        <template v-if="isRange">
            zwischen {{ category.minECTS }} und {{ category.maxECTS }}
        </template>
        <template v-if="!hasMin && hasMax">
            höchstens {{ category.maxECTS }}
        </template>
        Kreditpunkte.
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useEmitter } from "@/composables/useEmitter";

const props = defineProps({
    category: {
        type: Object,
        required: true,
    },
});

const emitter = useEmitter();

const focusCategory = () => {
    emitter.emit("focus-category", props.category.id);
};
const hasMin = computed(() => {
    return props.category.minECTS != null;
});
const hasMax = computed(() => {
    return props.category.maxECTS != null;
});
const minEqualsMax = computed(() => {
    return (
        hasMin.value &&
        hasMax.value &&
        props.category.minECTS === props.category.maxECTS
    );
});
const isRange = computed(() => {
    return (
        hasMin.value &&
        hasMax.value &&
        props.category.minECTS !== props.category.maxECTS
    );
});
</script>

<style lang="scss" scoped></style>
