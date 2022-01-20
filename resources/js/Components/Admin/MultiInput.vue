<template>
  <div>
    <div class="flex">
      <input
        type="text"
        v-model="input"
        class="w-full block border border-gray-600 rounded shadow-inner p-1"
      />
      <button type="button" @click="addValue" :disabled="!input">
        <PlusIcon class="w-4 h-4" />
      </button>
    </div>
    <ul>
      <li
        v-for="(value, index) in modelValue"
        :key="index"
        class="flex justify-between"
      >
        <div>{{ value }}</div>
        <button type="button" @click="removeValue(index)">
          <XIcon class="w-4 h-4" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { XIcon, PlusIcon } from "@heroicons/vue/outline";
export default {
  components: {
    XIcon,
    PlusIcon,
  },
  props: {
    modelValue: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      input: "",
    };
  },
  methods: {
    addValue() {
      this.$emit("update:modelValue", [...this.modelValue, this.input]);
      this.input = "";
    },
    removeValue(index) {
      const values = [...this.modelValue];
      values.splice(index, 1);
      this.$emit("update:modelValue", values);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>