<template>
  <div>
    <ul class="space-y-2">
      <li v-for="(entry, index) in entries" :key="index">
        <div class="flex gap-x-1 items-top">
          <CheckCircleIcon
            class="w-5 h-5 flex-shrink-0 mt-0.5 text-green-700"
            v-if="entry.checked"
          />
          <CircleIcon
            class="inline-block w-5 h-5 flex-shrink-0 mt-0.5"
            v-else
          />
          <span :class="{ 'text-green-700': entry.checked }">{{
            entry.label
          }}</span>
        </div>
      </li>
    </ul>
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
    entries: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>