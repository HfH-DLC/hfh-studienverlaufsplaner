<template>
  <ul ref="list">
    <li v-for="(info, index) in infos" :key="index" ref="list" tabindex="-1">
      <Info><span v-html="info" /></Info>
    </li>
  </ul>
</template>

<script>
import Info from "./Info.vue";
export default {
  components: {
    Info,
  },
  props: {
    infos: {
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
