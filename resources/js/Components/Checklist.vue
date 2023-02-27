<template>
  <div>
    <ul class="space-y-2">
      <li v-for="(entry, index) in uncheckedEntries" :key="index">
        <ChecklistEntry :entry="entry" />
      </li>
      <li v-for="(entry, index) in checkedEntries" :key="index">
        <ChecklistEntry :entry="entry" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ChecklistEntryData } from "@/types";
import { PropType } from "@vue/runtime-core";
import ChecklistEntry from "./ChecklistEntry.vue";
export default {
  components: {
    ChecklistEntry,
  },
  props: {
    entries: {
      type: Array as PropType<Array<ChecklistEntryData>>,
      required: true,
    },
  },
  computed: {
    checkedEntries() {
      return this.entries.filter((entry) => entry.checked);
    },
    uncheckedEntries() {
      return this.entries.filter((entry) => !entry.checked);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>