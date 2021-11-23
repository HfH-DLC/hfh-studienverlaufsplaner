<template>
  <td class="p-1">
    <button
      ref="button"
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
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
      :class="{
        'shadow-inner': !timeSlot.module,
        'bg-gray-50': timeSlot.module,
        'slot--invalid': invalid,
        'slot--selectable': timeSlot.selectable,
      }"
      :disabled="!timeSlot.selectable && !timeSlot.removable"
      @click="onClick"
    >
      <span v-if="timeSlot.module">
        {{ timeSlot.module.id }} | {{ timeSlot.module.name }}
      </span>
      <span v-else>&nbsp;</span>
    </button>
  </td>
</template>

<script>
export default {
  emits: ["placeModule", "selectModule"],
  props: {
    timeSlot: {
      type: Object,
      default: null,
    },
  },
  methods: {
    onClick() {
      if (this.timeSlot.module) {
        this.$emit("selectModule", this.timeSlot.id);
      } else {
        this.$emit("placeModule", this.timeSlot.id);
      }
    },
    focusButton() {
      this.$refs.button.focus();
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
  @apply bg-green-50;
}
</style>