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
      class="
        max-w-lg
        absolute
        bg-thunderbird-red
        text-white
        shadow-lg
        p-4
        top-1/2
        left-1/2
        -translate-x-1/2 -translate-y-1/2
      "
      ref="dialog"
    >
      <DialogTitle class="text-lg font-bold mr-20">{{
        currentStep.title
      }}</DialogTitle>
      <button @click="cancel" class="absolute top-2 right-2 p-2">
        <XIcon class="block w-6 h-6" aria-hidden="true" />
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

<script>
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";
import throttle from "lodash.throttle";
import { XIcon } from "@heroicons/vue/outline";
import { createPopper } from "@popperjs/core";
import TourButton from "./TourButton.vue";
export default {
  components: {
    Dialog,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
    TourButton,
    XIcon,
  },
  emits: ["started", "completed"],
  props: {
    startOnMount: {
      type: Boolean,
      required: true,
    },
    steps: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
      currentIndex: 0,
      currentElement: null,
      overlayStyle: {},
      popper: null,
    };
  },
  created() {
    this.onResize = throttle(() => this.updateOverlayStyle(), 100);
    this.$emitter.on("start-tour", this.start);
    window.addEventListener("resize", this.onResize);
  },
  mounted() {
    this.$nextTick(() => {
      if (this.startOnMount) {
        this.start();
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    this.$emitter.off("start-tour", this.start);
  },
  computed: {
    currentStep() {
      return this.getStep(this.currentIndex);
    },
    nextText() {
      return this.currentIndex + 1 === this.steps.length
        ? "Einführung abschliessen"
        : "Weiter";
    },
  },
  methods: {
    start() {
      this.$emit("started");
      this.isOpen = true;
      this.updateCurrentElement();
    },
    getStep(index) {
      return this.steps[index];
    },
    getElement(index) {
      const step = this.getStep(index);
      return step && step.ref ? document.getElementById(step.ref) : null;
    },
    createPopper() {
      const dialog = this.$refs.dialog;
      this.popper = createPopper(this.currentElement, dialog, {
        placement: this.currentStep.placement,
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
    },
    end() {
      this.isOpen = false;
      this.currentIndex = 0;
      if (this.popper) {
        this.popper.destroy();
        this.popper = null;
      }
      this.$emit("completed");
    },
    cancel() {
      this.end();
    },
    nextStep() {
      this.changeStep(this.currentIndex + 1);
    },
    previousStep() {
      this.changeStep(this.currentIndex - 1);
    },
    changeStep(newIndex) {
      if (this.currentStep.afterAction) {
        const { name, value } = this.currentStep.afterAction;
        this.$store.dispatch(name, value);
      }
      if (newIndex == this.steps.length) {
        this.complete();
      } else {
        this.currentIndex = newIndex;
      }
      if (this.currentStep.beforeAction) {
        const { name, value } = this.currentStep.beforeAction;
        this.$store.dispatch(name, value);
      }
    },
    complete() {
      this.end();
    },
    onDialogClosed() {
      this.end();
    },
    updateCurrentElement() {
      this.$nextTick(() => {
        if (this.popper) {
          this.popper.destroy();
        }
        this.currentElement = this.getElement(this.currentIndex);
        if (this.currentElement) {
          this.createPopper();
        }
        this.updateOverlayStyle();
      });
    },
    updateOverlayStyle() {
      if (!this.currentElement) {
        return "";
      }
      const rect = this.currentElement.getBoundingClientRect();
      this.overlayStyle = {
        "clip-path": `polygon(0% 0%, 0% 100%, ${rect.left}px 100%,${rect.left}px ${rect.top}px, ${rect.right}px ${rect.top}px, ${rect.right}px ${rect.bottom}px, ${rect.left}px ${rect.bottom}px,${rect.left}px 100%, 100% 100%, 100% 0%)`,
      };
    },
  },
  watch: {
    currentIndex() {
      if (this.isOpen) {
        this.updateCurrentElement();
      }
    },
  },
};
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
