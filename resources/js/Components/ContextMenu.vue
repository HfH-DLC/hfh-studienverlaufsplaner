<template>
    <div class="flex gap-x-1">
        <ContextButton @click="onRemoveModule" label="Modul entfernen">
            <TrashIcon class="w-4 h-4" />
        </ContextButton>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { useScheduleStore } from "../Store/schedule";
import ContextButton from "./ContextButton.vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { Placement } from "@/types";

const props = defineProps({
    placement: {
        type: Object as PropType<Placement>,
        required: true,
    },
});

const store = useScheduleStore();
const onRemoveModule = () => {
    store.removeModule(props.placement);
};
</script>

<style lang="scss" scoped></style>
