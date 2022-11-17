<template>
  <div
    class="
      error-message
      bg-red-50
      text-red-600
      border border-red-300
      rounded-md
      p-1
      w-fit
      flex
      items-top
    "
  >
    <XCircleIcon class="inline-block w-5 h-5 shrink-0 mt-1.5" />
    <span class="ml-1"><slot></slot></span>
  </div>
</template>

<script>
import { XCircleIcon } from "@heroicons/vue/outline";
export default {
  components: {
    XCircleIcon,
  },
};
</script>

<style lang="scss"></style>
