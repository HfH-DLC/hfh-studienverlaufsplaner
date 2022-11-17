<template>
  <div>
    Belegen Sie alle Module des Bereiches
    <span class="whitespace-nowrap"
      ><button @click="focusCategory()">"{{ category.name }}"</button>.</span
    >
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