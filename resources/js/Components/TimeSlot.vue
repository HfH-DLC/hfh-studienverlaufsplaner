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
        <ExclamationCircleIcon
          v-if="invalid"
          class="text-red-600 inline-block mr-2 w-5 h-5"
        />
        <span>{{ timeSlot.module.id }} | {{ timeSlot.module.name }}</span>
      </span>
      <span v-else>
        <CheckCircleIcon
          v-if="timeSlot.selectable"
          class="text-green-600 w-5 h-5"
        />
        <span v-else>&nbsp;</span>
      </span>
    </button>
  </td>
</template>

<script>
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/vue/outline";
export default {
  emits: ["placeModule", "removeModule"],
  components: {
    CheckCircleIcon,
    ExclamationCircleIcon,
  },
  props: {
    timeSlot: {
      type: Object,
      default: null,
    },
  },
  methods: {
    onClick() {
      if (this.timeSlot.module) {
        this.$emit("removeModule", this.timeSlot.id);
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
  @apply bg-red-50 text-red-600;
}
.slot--selectable {
  @apply bg-green-50;
}
</style>