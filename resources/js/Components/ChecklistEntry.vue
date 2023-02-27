<template>
  <div class="checklist-entry">
    <span class="hfh-sr-only">{{ entryCheckedText }}</span>
    <div class="flex gap-x-1 items-top">
      <CheckCircleIcon class="w-5 h-5 shrink-0 mt-0.5 text-green-700" v-if="entry.checked" />
      <CircleIcon class="inline-block w-5 h-5 shrink-0 mt-0.5" v-else />
      <div :class="{ 'text-green-700': entry.checked }">
        <component v-if="entry.component && entry.labelProps" :is="entry.component" ref="label"
          v-bind="entry.labelProps" />
        <div v-else-if="entry.label" v-html="entry.label"></div>
        <div v-if="entry.progressLabel">
          (Aktuell: {{ entry.progressLabel }})
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
import CircleIcon from "./CircleIcon.vue";
import OptionalFocusModulesLabel from "./Todos/Schedule/OptionalFocusModulesLabel.vue";
import RequiredFocusModulesLabel from "./Todos/Schedule/RequiredFocusModulesLabel.vue";
import ECTSPerCategoryLabel from "./Todos/Schedule/ECTSPerCategoryLabel.vue";
import RequiredModulesLabel from "./Todos/Schedule/RequiredModulesLabel.vue";
import AtLeastOneOfModulesPerFocusLabel from "./Todos/Credit/AtLeastOneOfModulesPerFocusLabel.vue";
import { PropType } from "vue";
import { ChecklistEntryData } from "@/types";
export default {
  components: {
    CheckCircleIcon,
    CircleIcon,
    OptionalFocusModulesLabel,
    RequiredFocusModulesLabel,
    ECTSPerCategoryLabel,
    RequiredModulesLabel,
    AtLeastOneOfModulesPerFocusLabel,
  },
  props: {
    entry: {
      type: Object as PropType<ChecklistEntryData>,
      required: true,
    },
  },
  computed: {
    entryCheckedText(): string {
      return this.entry.checked ? "Erfüllt:" : "Offen:";
    },
  },
};
</script>

<style lang="scss" scoped>
.checklist-entry {
  page-break-inside: avoid;
}
</style>