<template>
  <div
    class="
      info-message
      bg-blue-50
      text-blue-600
      border border-blue-300
      rounded-md
      p-1
      w-fit
      flex
      items-top
    "
  >
    <InformationCircleIcon class="inline-block w-5 h-5 shrink-0 mt-1.5" />
    <span class="ml-1"><slot></slot></span>
  </div>
</template>

<script>
import { InformationCircleIcon } from "@heroicons/vue/outline";
export default {
  components: {
    InformationCircleIcon,
  },
};
</script>

<style lang="scss"></style>
