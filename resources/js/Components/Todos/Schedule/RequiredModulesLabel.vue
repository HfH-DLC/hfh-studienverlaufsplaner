<template>
  <div>
    Belegen Sie alle Module des Bereiches
    <button @click="focusCategory()">"{{ category.name }}"</button>.
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
};
</script>

<style lang="scss" scoped>
</style>