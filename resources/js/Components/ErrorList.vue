<template>
  <ul ref="list">
    <li v-for="(error, index) in errors" :key="index" ref="list" tabindex="-1">
      <Error><span v-html="error" /></Error>
    </li>
  </ul>
</template>

<script>
import Error from "./Error.vue";
export default {
  components: {
    Error,
  },
  props: {
    errors: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.$refs.list.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const button = event.currentTarget;
        const action = button.dataset.action;
        if (action == "focus-category") {
          const categoryId = button.dataset.category;
          this.$emitter.emit(action, categoryId);
        } else if (action == "focus-module") {
          const moduleId = button.dataset.module;
          this.$emitter.emit(action, moduleId);
        }
      });
    });
  },
};
</script>

<style lang="scss" scoped></style>
