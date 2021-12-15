<template>
  <button
    class="
      text-left text-sm
      mb-2
      p-1
      w-full
      rounded
      focus:outline-none focus:ring-2 focus:ring-indigo-600
      disabled:cursor-default
    "
    :class="{
      'module--selected': module.selected,
      'module--error': module.selected && hasErrors,
      'module--disabled': disabled,
    }"
    :disabled="disabled"
    @click="onClick"
  >
    <ExclamationCircleIcon
      v-if="hasErrors"
      class=" inline-block w-5 h-5 flex-shrink-0"
    />
    {{ module.number }} {{ module.name }}
  </button>
</template>

<script>
import { ExclamationCircleIcon } from "@heroicons/vue/outline";
import { mapActions } from "vuex";
export default {
  components: {
    ExclamationCircleIcon,
  },
  props: {
    module: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    hasErrors() {
      return this.module.errors.length > 0;
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
.module--error {
  @apply font-bold text-red-600;
}
.module--disabled {
  @apply text-gray-400;
}
</style>