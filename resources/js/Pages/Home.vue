<template>
  <button @click="createPlan">Plan erstellen</button>
</template>

<script>
import DataAdapter from "../DataAdapter";
export default {
  methods: {
    createPlan() {
      //todo make singleton
      try {
        new DataAdapter().createPlan();
      } catch (error) {
        //todo error state
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>