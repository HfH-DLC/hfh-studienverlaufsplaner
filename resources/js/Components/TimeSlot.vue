<template>
  <button
    v-if="timeSlot"
    class="
      text-sm text-left
      disabled:cursor-default
      w-full
      p-4
      border border-gray-300
      rounded
      bg-white
      transition-all
      truncate
    "
    :class="{
      'shadow-inner': !timeSlot.module,
      'bg-gray-50': timeSlot.module,
      'slot--invalid': invalid,
      'slot--selectable': timeSlot.selectable,
    }"
    :disabled="timeSlot.module || !timeSlot.selectable"
    @click="$emit('placeModule', timeSlot)"
  >
    <span v-if="timeSlot.module">
      {{ timeSlot.module.id }} | {{ timeSlot.module.name }}
    </span>
    <span v-else>&nbsp;</span>
  </button>
</template>

<script>
export default {
  emits: ["placeModule"],
  props: {
    timeSlot: {
      type: Object,
      default: null,
    },
  },
  computed: {
    invalid() {
      return this.timeSlot.errors && this.timeSlot.errors.length > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.slot--invalid {
  @apply text-red-500;
}
.slot--selectable {
  @apply bg-green-50 ring-2 ring-green-500;
}
</style>