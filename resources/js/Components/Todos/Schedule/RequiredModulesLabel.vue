<template>
    <div>
        Belegen Sie alle Module des Bereiches
        <span class="whitespace-nowrap"
            ><button @click="focusCategory()">"{{ category.name }}"</button
            >.</span
        >
    </div>
</template>

<script lang="ts" setup>
import { useEmitter } from "@/composables/useEmitter";
import { ScheduleCategory } from "@/types";
import { PropType } from "vue";

const props = defineProps({
    category: {
        type: Object as PropType<ScheduleCategory>,
        required: true,
    },
});

const focusCategory = () => {
    useEmitter().emit("focus-category", props.category.id);
};
</script>

<style lang="scss" scoped></style>
