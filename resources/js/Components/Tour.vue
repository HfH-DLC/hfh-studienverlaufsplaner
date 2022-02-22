<template>
  <Dialog
    :open="isOpen"
    @close="setIsOpen"
    class="fixed inset-0 z-10 overflow-y-auto"
  >
    <DialogOverlay
      class="fixed inset-0 pointer-events-none"
      :class="{
        overlay: !this.currentElement,
      }"
    />
    <div
      id="dialog"
      class="
        max-w-md
        absolute
        bg-white
        border-gray-300 border
        rounded
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
        <Button @click="previousStep" v-if="currentIndex > 0">Zurück</Button>
        <Button @click="nextStep">{{ nextText }}</Button>
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
import { XIcon } from "@heroicons/vue/outline";
import { createPopper } from "@popperjs/core";
import Button from "./Button.vue";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    Dialog,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
    Button,
    XIcon,
  },
  emits: ["completed"],
  props: {
    startOnMount: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
      currentIndex: 0,
      steps: [
        {
          title: "Willkommen im Studienverlaufsplaner",
          content: "Some content...",
        },
        {
          title: "Plan-Nummer",
          content:
            "Um zu einem späteren Zeitpunkt wieder auf diesen Plan zugreifen zu können, notieren Sie sich bitte Ihre Plan-Nummer oder setzen Sie ein Lesezeichen in ihrem Browser.",
          ref: "plan-number",
          placement: "right-start",
        },
        {
          title: "Modul-Liste",
          content: "In der Liste links können Sie Ihre Module auswählen.",
          ref: "module-list",
          placement: "right",
        },
        {
          title: "Stundenplan",
          content:
            "Sobald sie ein Modul ausgewählt haben, können Sie es in der Mitte auf dem Stundenplan platzieren.",
          ref: "time-table",
          placement: "left-start",
        },
        {
          title: "Kreditpunkte",
          content:
            "Rechts sehen Sie das Total der Kreditpunkte der Module, die sie bereits platziert haben.",
          ref: "total-credits",
          placement: "left",
        },
        {
          title: "Modul-Details",
          content:
            "Darunter finden Sie genauere Informationen zum ausgewählten Modul.",
          ref: "module-information",
          placement: "left",
        },
        {
          title: "Einführung",
          content:
            "Um diese Einführung später erneut anzuschauen, klicken Sie auf das Fragezeichen.",
          ref: "start-tour",
          placement: "left",
        },
      ],
      popper: null,
    };
  },
  created() {
    this.emitter.on("start-tour", this.start);
  },
  mounted() {
    this.$nextTick(() => {
      if (this.startOnMount) {
        this.start();
      }
    });
  },
  beforeDestroy() {
    this.emitter.off("start-tour", this.start);
  },
  computed: {
    currentStep() {
      return this.steps[this.currentIndex];
    },
    currentElement() {
      return this.currentStep.ref
        ? document.getElementById(this.currentStep.ref)
        : null;
    },
    nextText() {
      return this.currentIndex + 1 === this.steps.length
        ? "Einführung abschliessen"
        : "Weiter";
    },
  },
  methods: {
    start() {
      this.isOpen = true;
      if (this.currentElement) {
        this.currentElement.classList.add("tour-focus");
        this.createPopper();
      }
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
      this.setIsOpen(false);
      if (this.currentElement) {
        this.currentElement.classList.remove("tour-focus");
      }
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
      if (this.currentIndex + 1 == this.steps.length) {
        this.complete();
      } else {
        this.changeStep(this.currentIndex + 1);
      }
    },
    previousStep() {
      this.changeStep(this.currentIndex - 1);
    },
    changeStep(newIndex) {
      if (this.popper) {
        this.popper.destroy();
      }
      const oldElement = this.currentElement;
      this.currentIndex = newIndex;
      if (oldElement) {
        oldElement.classList.remove("tour-focus");
      }
      if (this.currentElement) {
        this.currentElement.classList.add("tour-focus");
        this.createPopper();
      }
    },
    complete() {
      this.end();
    },
    setIsOpen(value) {
      this.isOpen = value;
    },
    ...mapActions(["setShowTour"]),
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
</style>