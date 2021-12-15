<template></template>

<script>
import AdminLayout from "../Layouts/AdminLayout.vue";
export default {
  layout: AdminLayout,
  props: {
    planer: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>