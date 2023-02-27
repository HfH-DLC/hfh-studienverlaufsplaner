<template>
    <div class="border-l border-gray-300">
        <div class="bg-gray-700 flex justify-end items-center">
            <button class="text-3xl p-2 text-white" @click="$emit('close')">
                <XMarkIcon class="w-6 h-6" />
            </button>
        </div>
        <div class="p-4">
            <h2 class="text-lg whitespace-nowrap">{{ title }}</h2>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";
export default {
    emits: ["close"],
    components: {
        XMarkIcon,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped></style>
