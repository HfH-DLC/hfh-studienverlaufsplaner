<template>
  <ul ref="list">
    <li v-for="(error, index) in errors" :key="index" tabindex="-1">
      <Error>
        <component
          v-if="error.component && error.labelProps"
          :is="error.component"
          ref="label"
          v-bind="error.labelProps"
        />
        <div v-else-if="error.label" v-html="error.label"></div>
      </Error>
    </li>
  </ul>
</template>

<script>
import Error from "./Error.vue";
import DateRulePlacementLabel from "./Rules/Schedule/DateRulePlacementLabel.vue";
import ExcludeSemesterRulePlacementLabel from "./Rules/Schedule/ExcludeSemesterRulePlacementLabel.vue";
import PrerequisitesRuleLabel from "./Rules/Schedule/PrerequisitesRuleLabel.vue";
export default {
  components: {
    Error,
    DateRulePlacementLabel,
    ExcludeSemesterRulePlacementLabel,
    PrerequisitesRuleLabel,
  },
  props: {
    errors: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
