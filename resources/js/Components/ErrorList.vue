<template>
  <ul>
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
};
</script>

<style lang="scss" scoped>
</style>