<template>
    <div class="flex gap-x-1">
        <ContextButton @click="onRemoveModule" label="Modul entfernen">
            <TrashIcon class="w-4 h-4" />
        </ContextButton>
    </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { mapActions } from "pinia";
import { useScheduleStore } from "../Store/schedule";
import ContextButton from "./ContextButton.vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { Placement } from "@/types";
export default {
    components: {
        ContextButton,
        TrashIcon,
    },
    props: {
        placement: {
            type: Object as PropType<Placement>,
            required: true,
        },
    },
    methods: {
        ...mapActions(useScheduleStore, ["removeModule"]),
        onRemoveModule() {
            this.removeModule(this.placement);
        },
    },
};
</script>

<style lang="scss" scoped></style>
