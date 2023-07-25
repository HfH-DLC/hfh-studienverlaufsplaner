<template>
    <button
        class="flex items-center gap-1 hover:text-thunderbird-red"
        @click="startTour"
    >
        <QuestionMarkCircleIcon class="w-5 h-5" aria-hidden="true" />
        Hilfe
    </button>
</template>

<script setup lang="ts">
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/outline";
import { useEmitter } from "@/composables/useEmitter";

const emitter = useEmitter();

const startTour = () => {
    emitter.emit("start-tour");
};
</script>
