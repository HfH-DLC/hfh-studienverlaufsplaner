<template>
  <button
    class="
      text-left
      mb-2
      p-1
      w-full
      rounded
      focus:outline-none focus:ring-2 focus:ring-indigo-600
      disabled:cursor-default
    "
    :class="{
      'module--selected': module.selected,
      'module--placed': module.placement && !module.misplaced,
      'module--disabled': disabled,
      'module--error': module.misplaced,
    }"
    :disabled="disabled"
    @click="onClick"
  >
    <XCircleIcon
      v-if="module.misplaced"
      class="inline-block w-5 h-5 flex-shrink-0 text-red-600"
    />
    <CheckCircleIcon
      v-if="module.placement && !module.misplaced"
      class="inline-block w-5 h-5 flex-shrink-0 text-green-700"
    />
    {{ module.id }} {{ module.name }}
  </button>
</template>

<script>
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/outline";
import { mapActions } from "vuex";
export default {
  components: {
    CheckCircleIcon,
    XCircleIcon,
  },
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
  computed: {
    hasInfos() {
      return this.module.infos.length > 0;
    },
  },
  methods: {
    ...mapActions("schedule", ["deselectModule", "selectModule"]),
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
  @apply font-bold;
  @apply tracking-tighter;
}
.module--error {
  @apply text-red-600;
}
.module--placed {
  @apply text-green-700;
}
.module--disabled {
  @apply text-gray-400;
}
</style>
