<template>
  <button
    class="
      text-left text-sm
      disabled:cursor-default
      mb-2
      p-1
      w-full
      rounded
      focus:outline-none focus:ring-2 focus:ring-indigo-600
    "
    :disabled="disabled"
    :class="{
      'module--selected': module.selected,
      'module--disabled': disabled,
    }"
    @click="onClick"
  >
    {{ module.id }} {{ module.name }}
  </button>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    module: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions(["deselectModule", "selectModule"]),
    onClick() {
      if (this.module.selected) {
        this.deselectModule();
      } else {
        this.selectModule(this.module.id);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.module--selected {
  @apply font-bold text-green-600;
}

.module--disabled {
  @apply text-gray-400;
}
</style>