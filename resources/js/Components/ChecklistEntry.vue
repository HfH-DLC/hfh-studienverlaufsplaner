<template>
  <div class="checklist-entry">
    <div class="flex gap-x-1 items-top">
      <CheckCircleIcon
        class="w-5 h-5 flex-shrink-0 mt-0.5 text-green-700"
        v-if="entry.checked"
      />
      <CircleIcon class="inline-block w-5 h-5 flex-shrink-0 mt-0.5" v-else />
      <div :class="{ 'text-green-700': entry.checked }">
        <component
          v-if="entry.labelProps"
          :is="entry.labelProps.component"
          ref="label"
          v-bind="entry.labelProps"
        />
        <div v-if="entry.label" v-html="entry.label"></div>
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
import OptionalFocusModulesLabel from "./Todos/Schedule/OptionalFocusModulesLabel.vue";
import RequiredFocusModulesLabel from "./Todos/Schedule/RequiredFocusModulesLabel.vue";
import ECTSPerCategoryLabel from "./Todos/Schedule/ECTSPerCategoryLabel.vue";
import RequiredModulesLabel from "./Todos/Schedule/RequiredModulesLabel.vue";
export default {
  components: {
    CheckCircleIcon,
    CircleIcon,
    OptionalFocusModulesLabel,
    RequiredFocusModulesLabel,
    ECTSPerCategoryLabel,
    RequiredModulesLabel,
  },
  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.checklist-entry {
  page-break-inside: avoid;
}
</style>