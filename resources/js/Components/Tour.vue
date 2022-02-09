<template>
  <Dialog
    :open="isOpen"
    @close="setIsOpen"
    class="fixed inset-0 z-10 overflow-y-auto"
  >
    <DialogOverlay
      class="fixed inset-0 bg-black opacity-30 pointer-events-none"
    />

    <div class="relative max-w-sm bg-white rounded shadow-lg p-4" ref="dialog">
      <div data-popper-arrow></div>
      <DialogTitle class="text-lg font-bold">{{
        currentStep.title
      }}</DialogTitle>

      <p class="mt-2">
        {{ currentStep.content }}
      </p>
      <div class="flex gap-4 mt-8">
        <Button @click="cancel">Abbrechen</Button>
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
import { createPopper } from "@popperjs/core";
import Button from "./Button.vue";
export default {
  components: {
    Dialog,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
    Button,
  },
  data() {
    return {
      isOpen: true,
      currentIndex: 0,
      steps: [
        {
          title: "Step 1",
          content: "Some content...",
          ref: "module-list",
        },
        {
          title: "Step 2",
          content: "Some content...",
          ref: "time-table",
        },
        {
          title: "Step 3",
          content: "Some content...",
          ref: "module-information",
        },
      ],
      popper: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.start();
    });
  },
  computed: {
    currentStep() {
      return this.steps[this.currentIndex];
    },
    nextText() {
      return this.currentIndex + 1 === this.steps.length ? "Fertig" : "Weiter";
    },
  },
  methods: {
    start() {
      const dialog = this.$refs.dialog;
      const ref = document.getElementById(this.currentStep.ref);
      this.popper = createPopper(ref, dialog, {
        placement: "auto",
        modifiers: [
          {
            name: "preventOverflow",
            options: {
              altAxis: true,
              padding: 8,
            },
          },
        ],
      });
    },
    end() {
      this.setIsOpen(false);
      this.currentIndex = 0;
      this.popper.destroy();
      this.popper = null;
    },
    cancel() {
      this.end();
    },
    nextStep() {
      if (this.currentIndex + 1 == this.steps.length) {
        this.complete();
      } else {
        this.currentIndex++;
        this.popper.state.elements.reference = document.getElementById(
          this.currentStep.ref
        );
        this.popper.update();
      }
    },
    complete() {
      this.end();
    },
    setIsOpen(value) {
      this.isOpen = value;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>