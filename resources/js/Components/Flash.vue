<template>
    <div
        v-if="message"
        class="z-20 rounded-md py-1 px-2 gap-2 w-fit flex justify-between items-center shadow-lg"
        :class="typeClasses"
        :role="typeRole"
        data-testid="flash"
    >
        <span>{{ message }}</span>
        <button
            ref="action"
            v-if="actionMessage && actionEvent"
            @click="onCallback"
            class="underline"
            data-testid="flash.action"
        >
            {{ actionMessage }}
        </button>
        <button ref="close" @click="onClose" aria-label="Nachricht schliessen">
            <XMarkIcon class="w-5 h-5" aria-hidden="true" />
        </button>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref, Ref, nextTick, computed } from "vue";
import { FlashData, FlashType } from "@/types";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { EmitterEvents, useEmitter } from "@/composables/useEmitter";

const type: Ref<FlashType | null> = ref(null);
const message = ref("");
const actionMessage = ref("") as Ref<string | undefined>;
const actionEvent = ref() as Ref<keyof EmitterEvents | null | undefined>;
const actionButton = ref();
const closeButton = ref();

const flash = (event: FlashData) => {
    type.value = event.type;
    message.value = event.message;
    actionMessage.value = event.actionMessage;
    actionEvent.value = event.actionEvent;
    nextTick(() => {
        if (actionButton.value) {
            actionButton.value.focus();
        } else if (closeButton.value) {
            closeButton.value.focus();
        }
    });
};

const emitter = useEmitter();
emitter.on("flash", flash);

onBeforeUnmount(() => {
    emitter.off("flash", flash);
});

const onClose = () => {
    type.value = null;
    message.value = "";
    actionMessage.value = "";
    actionEvent.value = null;
};
const onCallback = () => {
    if (actionEvent.value) {
        emitter.emit(actionEvent.value);
        onClose();
    }
};

const typeClasses = computed(() => {
    switch (type.value) {
        case FlashType.Error: {
            return "bg-red-50 text-red-600 border border-red-300";
        }
        case FlashType.Success: {
            return "bg-green-50 text-green-600 border border-green-300";
        }
        default:
            return "";
    }
});

const typeRole = computed(() => {
    switch (type.value) {
        case FlashType.Error: {
            return "alert";
        }
        default:
            return "status";
    }
});
</script>

<style lang="scss" scoped></style>
