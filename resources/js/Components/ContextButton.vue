<template>
  <button
    class="
      flex
      justify-center
      items-center
      p-2
      rounded-full
      z-10
      bg-gray-700
      text-white
      hover:bg-gray-900
      focus:bg-gray-900
      shadow
    "
  >
    <div class="sr-only">{{ label }}</div>
    <slot></slot>
  </button>
</template>

<script lang="ts">
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>