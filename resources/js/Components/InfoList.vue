<template>
  <ul>
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
};
</script>

<style lang="scss" scoped></style>
