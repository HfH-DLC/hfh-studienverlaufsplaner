<template>
  <select
    :required="required"
    class="block border border-gray-600 rounded shadow-inner p-2 w-full"
    @change="$emit('update:modelValue', $event.target.value)"
    v-model="modelValue"
  >
    <option value="" :disabled="required">{{ emptyOptionLabel }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script>
export default {
  emits: ["update:modelValue"],
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    modelValue: "",
    displayEmptyOption: {
      type: Boolean,
      default: true,
    },
    emptyOptionLabel: {
      type: String,
      default: "Bitte wählen...",
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
</style>