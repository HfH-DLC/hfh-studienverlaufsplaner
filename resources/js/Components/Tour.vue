<template>
    <Dialog
        :open="isOpen"
        @close="onDialogClosed"
        class="fixed inset-0 z-10 overflow-y-auto"
    >
        <DialogOverlay
            class="fixed inset-0 pointer-events-none overlay"
            :style="overlayStyle"
        />
        <div
            id="dialog"
            class="max-w-lg absolute bg-thunderbird-red text-white shadow-lg p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            ref="dialog"
        >
            <DialogTitle class="text-lg font-bold mr-20">{{
                currentStep.title
            }}</DialogTitle>
            <button @click="cancel" class="absolute top-2 right-2 p-2">
                <XMarkIcon class="block w-6 h-6" aria-hidden="true" />
                <span class="sr-only">Einführung abschliessen</span>
            </button>

            <p class="mt-2">
                {{ currentStep.content }}
            </p>
            <div class="flex gap-4 mt-8 justify-end">
                <TourButton
                    class="tour-button"
                    @click="previousStep"
                    v-if="currentIndex > 0"
                    >Zurück</TourButton
                >
                <TourButton class="tour-button" @click="nextStep">{{
                    nextText
                }}</TourButton>
            </div>
        </div>
    </Dialog>
</template>

<script lang="ts" setup>
import {
    PropType,
    ref,
    Ref,
    onMounted,
    nextTick,
    onBeforeUnmount,
    computed,
    watch,
} from "vue";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";
import throttle from "lodash.throttle";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { createPopper, Instance } from "@popperjs/core";
import TourButton from "./TourButton.vue";
import { TourStep } from "@/types";
import { useEmitter } from "@/composables/useEmitter";

const emit = defineEmits(["started", "stepChanged", "completed"]);
const props = defineProps({
    startOnMount: {
        type: Boolean,
        required: true,
    },
    currentIndex: {
        type: Number,
        required: true,
    },
    steps: {
        type: Array as PropType<Array<TourStep>>,
        required: true,
    },
});

const isOpen = ref(false);
const currentElement = ref(null) as Ref<HTMLElement | null>;
const overlayStyle = ref({});
const popper = ref(null) as Ref<Instance | null>;
const dialog = ref() as Ref<HTMLElement>;

const onResize = throttle(() => updateOverlayStyle(), 100);
const currentIndex = computed(() => {
    return props.currentIndex;
});

const start = () => {
    emit("started");
    isOpen.value = true;
    updateCurrentElement();
};

const emitter = useEmitter();
emitter.on("start-tour", start);
window.addEventListener("resize", onResize);

onMounted(() => {
    nextTick(() => {
        if (props.startOnMount) {
            start();
        }
    });
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
    emitter.off("start-tour", start);
});

const currentStep = computed(() => {
    return getStep(currentIndex.value);
});
const nextText = computed(() => {
    return currentIndex.value + 1 === props.steps.length
        ? "Einführung abschliessen"
        : "Weiter";
});

const getStep = (index: number) => {
    return props.steps[index];
};
const getElement = (index: number) => {
    const step = getStep(index);
    return step && step.ref ? document.getElementById(step.ref) : null;
};
const initPopper = () => {
    popper.value = createPopper(currentElement.value!, dialog.value, {
        placement: currentStep.value.placement,
        modifiers: [
            {
                name: "preventOverflow",
                options: {
                    altAxis: true,
                    padding: 8,
                },
            },
            {
                name: "offset",
                options: {
                    offset: [0, 20],
                },
            },
        ],
    });
};
const end = () => {
    isOpen.value = false;
    emit("stepChanged", 0);
    if (popper.value) {
        popper.value.destroy();
        popper.value = null;
    }
    emit("completed");
};
const cancel = () => {
    end();
};
const nextStep = () => {
    changeStep(currentIndex.value + 1);
};
const previousStep = () => {
    changeStep(currentIndex.value - 1);
};
const changeStep = (newIndex: number) => {
    console.log("changeStep", newIndex, props.steps.length);
    if (newIndex == props.steps.length) {
        complete();
    } else {
        emit("stepChanged", newIndex);
    }
};
const complete = () => {
    end();
};
const onDialogClosed = () => {
    end();
};
const updateCurrentElement = () => {
    nextTick(() => {
        if (popper.value) {
            popper.value.destroy();
        }
        currentElement.value = getElement(currentIndex.value);
        if (currentElement.value) {
            initPopper();
        }
        updateOverlayStyle();
    });
};
const updateOverlayStyle = () => {
    if (!currentElement.value) {
        return "";
    }
    const rect = currentElement.value.getBoundingClientRect();
    overlayStyle.value = {
        "clip-path": `polygon(0% 0%, 0% 100%, ${rect.left}px 100%,${rect.left}px ${rect.top}px, ${rect.right}px ${rect.top}px, ${rect.right}px ${rect.bottom}px, ${rect.left}px ${rect.bottom}px,${rect.left}px 100%, 100% 100%, 100% 0%)`,
    };
};

watch(currentIndex, () => {
    console.log("watch");
    if (isOpen.value) {
        updateCurrentElement();
    }
});
</script>

<style lang="scss" scoped>
.overlay {
    background-color: rgba(0, 0, 0, 0.6);
}

#dialog[data-popper-placement^="top"] > #arrow {
    bottom: -4px;
}

#dialog[data-popper-placement^="bottom"] > #arrow {
    top: -4px;
}

#dialog[data-popper-placement^="left"] > #arrow {
    right: -4px;
}

#dialog[data-popper-placement^="right"] > #arrow {
    left: -4px;
}

.tour-button {
    @apply hover:bg-white hover:text-thunderbird-red focus:bg-black focus:text-white;
}
</style>
