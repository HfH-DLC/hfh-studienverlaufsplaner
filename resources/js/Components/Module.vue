<template>
  <button
    class="text-left text-sm disabled:cursor-default mb-2"
    :disabled="disabled"
    :class="{
      'module--selected': selected,
      'module--disabled': disabled,
    }"
  >
    {{ module.id }} | {{ module.name }}
  </button>
</template>

<script>
export default {
  props: {
    module: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>