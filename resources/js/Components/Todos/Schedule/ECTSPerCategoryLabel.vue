<template>
  <div>
    Belegen Sie im Bereich
    <button @click="focusCategory">"{{ category.name }}"</button>
    <template v-if="hasMin && !hasMax">
      mindestens {{ category.minECTS }}
    </template>
    <template v-if="minEqualsMax"> genau {{ category.minECTS }} </template>
    <template v-if="isRange">
      zwischen {{ category.minECTS }} und {{ category.maxECTS }}
    </template>
    <template v-if="!hasMin && hasMax">
      höchstens {{ category.maxECTS }}
    </template>
    Kreditpunkte.
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  methods: {
    focusCategory() {
      this.$emitter.emit("focus-category", this.category.id);
    },
  },
  computed: {
    hasMin() {
      return this.category.minECTS != null;
    },
    hasMax() {
      return this.category.maxECTS != null;
    },
    minEqualsMax() {
      return (
        this.hasMin &&
        this.hasMax &&
        this.category.minECTS === this.category.maxECTS
      );
    },
    isRange() {
      return (
        this.hasMin &&
        this.hasMax &&
        this.category.minECTS !== this.category.maxECTS
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>