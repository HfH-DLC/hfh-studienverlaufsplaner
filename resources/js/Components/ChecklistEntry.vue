<template>
  <div class="checklist-entry">
    <div class="flex gap-x-1 items-top">
      <CheckCircleIcon
        class="w-5 h-5 flex-shrink-0 mt-0.5 text-green-700"
        v-if="entry.checked"
      />
      <CircleIcon class="inline-block w-5 h-5 flex-shrink-0 mt-0.5" v-else />
      <div :class="{ 'text-green-700': entry.checked }">
        <div v-html="entry.label" ref="label"></div>
        <div v-if="entry.progressLabel">
          (Aktuell: {{ entry.progressLabel }})
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckCircleIcon } from "@heroicons/vue/outline";
import CircleIcon from "../Icons/CirleIcon";
export default {
  components: {
    CheckCircleIcon,
    CircleIcon,
  },
  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.$refs.label.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const button = event.currentTarget;
        const action = button.dataset.action;
        if (action == "focus-category") {
          const categoryId = button.dataset.category;
          this.$emitter.emit(action, categoryId);
        } else if (action == "focus-module") {
          const moduleId = button.dataset.module;
          this.$emitter.emit(action, moduleId);
        }
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.checklist-entry {
  page-break-inside: avoid;
}
</style>