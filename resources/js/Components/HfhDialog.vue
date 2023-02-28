<template>
    <Dialog
        :open="open"
        @close="onClose"
        class="fixed inset-0 z-10 overflow-y-auto"
    >
        <DialogOverlay class="fixed inset-0 pointer-events-none bg-black/60" />
        <div
            class="max-w-2xl absolute bg-white shadow-lg p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            <DialogTitle class="mr-12">{{ title }}</DialogTitle>
            <button @click="onClose" class="absolute top-2 right-2 p-2">
                <XMarkIcon class="block w-6 h-6" aria-hidden="true" />
                <span class="sr-only">Schliessen</span>
            </button>

            <div class="mt-2">
                <slot></slot>
            </div>
        </div>
    </Dialog>
</template>

<script lang="ts">
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
export default {
    components: {
        Dialog,
        DialogOverlay,
        DialogTitle,
        XMarkIcon,
    },
    emits: ["closed"],
    props: {
        open: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
    },
    methods: {
        onClose() {
            this.$emit("closed");
        },
    },
};
</script>

<style lang="scss" scoped></style>
