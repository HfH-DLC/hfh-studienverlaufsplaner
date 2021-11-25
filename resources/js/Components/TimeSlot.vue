<template>
  <td>
    <div v-if="timeSlot" class="min-h-16 p-1 flex items-center">
      <button
        ref="button"
        v-if="timeSlot.module || !disabled"
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
          <span>{{ timeSlot.module.id }} {{ timeSlot.module.name }}</span>
        </span>
        <span v-else>
          <CheckCircleIcon
            v-if="timeSlot.selectable"
            class="text-green-600 w-5 h-5"
          />
          <span v-else>&nbsp;</span>
        </span>
      </button>
    </div>
  </td>
</template>

<script>
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/vue/outline";
import { mapActions } from "vuex";
export default {
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
    ...mapActions(["removeModule", "placeModule"]),
    onClick() {
      if (this.timeSlot.module) {
        this.removeModule(this.timeSlot.id);
      } else {
        this.placeModule(this.timeSlot.id);
      }
    },
    focusButton() {
      this.$refs.button.focus();
    },
  },
  computed: {
    disabled() {
      return !this.timeSlot.selectable && !this.timeSlot.removable;
    },
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