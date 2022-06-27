<template>
  <Dialog
    :open="isOpen"
    @close="onDialogClosed"
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
        <Button
          class="tour-button"
          @click="previousStep"
          v-if="currentIndex > 0"
          >Zurück</Button
        >
        <Button class="tour-button" @click="nextStep">{{ nextText }}</Button>
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
import { mapActions } from "vuex";
import { SET_TOUR_ACTIVE } from "../Store/index";
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
          title: "Willkommen zum Studienverlaufsplaner MA HFE",
          content:
            "Hier können Sie Ihren gewünschten Studienverlauf über alle Semester Ihres Studiums provisorisch planen. So geht's...",
        },
        {
          title: "Nicht alles in einem Schwung!",
          content:
            "Um zu einem späteren Zeitpunkt wieder auf Ihren Plan zuzugreifen, haben wir Ihnen eine E-Mail geschickt mit dem Link zu Ihrem HfH Studienverlaufsplan. Noch schneller auffindbar: Setzen Sie ein Lesezeichen in ihrem Browser für diese Seite. So müssen Sie nie von Vorne anfangen und können in Ruhe planen.",
          ref: "plan-number",
          placement: "right-start",
        },
        {
          title: "Die Modul-Liste",
          content:
            "In der Liste können Sie die gewünschten Module per Klick auswählen. Am besten fangen Sie damit an, die Pflichtmodule zu platzieren.",
          ref: "module-list",
          placement: "right",
        },
        {
          title: "Semester-Stundenpläne",
          content:
            "Sobald Sie ein Modul ausgewählt haben, können Sie es platzieren. Klicken Sie dafür auf ein aktiviertes Feld!",
          ref: "time-table",
          placement: "left-start",
        },
        {
          title: "Check Kreditpunkte",
          content:
            "Sie sehen das Total der Kreditpunkte der bereits platzierten Module.",
          ref: "total-credits",
          placement: "left",
        },
        {
          title: "Modul-Details",
          content:
            "Wenn Sie ein Modul angewählt haben, sehen Sie genauere Informationen, zum Beispiel Kreditpunkte und Voraussetzungen des Moduls.",
          ref: "module-information",
          placement: "left",
        },
        {
          title: "Tour «Einführung»",
          content:
            "Um diese Einführung später erneut anzuschauen, klicken Sie auf das Fragezeichen. Viel Erfolg beim Planen!",
          ref: "start-tour",
          placement: "left",
        },
      ],
      popper: null,
    };
  },
  created() {
    this.$emitter.on("start-tour", this.start);
  },
  mounted() {
    this.$nextTick(() => {
      if (this.startOnMount) {
        this.start();
      }
    });
  },
  beforeDestroy() {
    this.$emitter.off("start-tour", this.start);
  },
  computed: {
    currentStep() {
      return this.getStep(this.currentIndex);
    },
    currentElement() {
      return this.getElement(this.currentIndex);
    },
    nextText() {
      return this.currentIndex + 1 === this.steps.length
        ? "Einführung abschliessen"
        : "Weiter";
    },
  },
  methods: {
    start() {
      this.$store.commit(SET_TOUR_ACTIVE, true);
      this.isOpen = true;
      if (this.currentElement) {
        this.currentElement.classList.add("tour-focus");
        this.createPopper();
      }
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
      if (this.currentElement) {
        this.currentElement.classList.remove("tour-focus");
      }
      this.currentIndex = 0;
      if (this.popper) {
        this.popper.destroy();
        this.popper = null;
      }
      this.$store.commit(SET_TOUR_ACTIVE, false);
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
    onDialogClosed() {
      this.end();
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

.tour-button {
  @apply hover:bg-white hover:text-thunderbird-red focus:bg-black focus:text-white;
}
</style>