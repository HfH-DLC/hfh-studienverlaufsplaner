<template>
  <button
    class="
      text-left
      disabled:cursor-default
      w-full
      p-4
      mb-4
      border border-gray-300
      rounded
      bg-white
      shadow-inner
    "
    :class="{
      'slot--invalid': invalid,
      'slot--disabled': disabled & !timeSlot.module,
      'slot--filled': timeSlot.module && !invalid,
    }"
    :disabled="disabled || timeSlot.module"
  >
    <span>{{ timeSlot.id }} | {{ timeSlot.semester }}: </span>
    <span v-if="timeSlot.module">
      {{ timeSlot.module.id }} | {{ timeSlot.module.name }}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    timeSlot: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
};
</script>

<style lang="scss" scoped>
.slot--disabled {
  @apply text-gray-500;
}

.slot--invalid {
  @apply text-red-500;
}
</style>