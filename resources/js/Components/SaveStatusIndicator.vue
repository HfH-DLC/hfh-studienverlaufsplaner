<template>
    <div class="flex gap-1 items-center" :class="messageClass">
        <CheckCircleIcon
            class="inline-block w-5 h-5 shrink-0 text-hfh-green"
            v-if="saved"
        />
        <XCircleIcon
            class="inline-block w-5 h-5 shrink-0 text-thunderbird-red"
            v-if="error"
        />
        <div
            v-if="saving"
            class="w-5 h-5 border-2 border-transparent border-t-thunderbird-red rounded-full animate-spin"
        ></div>
        {{ message }}
    </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from "vue";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import { SaveStatus } from "@/types";

const props = defineProps({
    saveStatus: {
        type: Number as PropType<SaveStatus>,
        required: true,
    },
});

const saved = computed(() => {
    return props.saveStatus == SaveStatus.Saved;
});
const saving = computed(() => {
    return props.saveStatus == SaveStatus.Saving;
});
const error = computed(() => {
    return props.saveStatus == SaveStatus.Error;
});

const message = computed(() => {
    if (saving.value) {
        return "Wird gespeichert...";
    }
    if (saved.value) {
        return "Gespeichert";
    }
    if (error.value) {
        return "Nicht gespeichert";
    }
    return "";
});
const messageClass = computed(() => {
    if (saving.value) {
        return "";
    }
    if (saved.value) {
        return "text-hfh-green";
    }
    if (error.value) {
        return "text-thunderbird-red";
    }
    return "";
});
</script>

<style lang="scss" scoped></style>
