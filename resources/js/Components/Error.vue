<template>
  <div
    class="
      bg-red-50
      text-red-600
      border border-red-300
      rounded-md
      p-1
      flex
      items-center
    "
  >
    <ExclamationCircleIcon class="inline-block mr-2 w-5 h-5 flex-shrink-0" />
    {{ error.text }}
  </div>
</template>

<script>
import { ExclamationCircleIcon } from "@heroicons/vue/outline";
export default {
  components: {
    ExclamationCircleIcon,
  },
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>