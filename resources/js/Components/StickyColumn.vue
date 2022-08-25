<template>
  <div class="p-4 sticky top-0 overflow-y-auto" ref="column" :style="style">
    <slot></slot>
  </div>
</template>

<script>
import throttle from "lodash.throttle";
export default {
  data() {
    return {
      maxHeight: "auto",
    };
  },
  created() {
    this.throttledSetHeight = throttle(() => this.setHeight(), 500);
  },
  mounted() {
    window.addEventListener("resize", this.throttledSetHeight);
    this.setHeight();
  },
  beforeMount() {
    this.throttledSetHeight.cancel();
    window.removeEventListener("resize", this.throttledSetHeight);
  },

  methods: {
    setHeight() {
      const { top } = this.$refs.column.getBoundingClientRect();
      this.maxHeight = `calc(100vh - ${top}px)`;
    },
  },
  computed: {
    style() {
      return {
        maxHeight: this.maxHeight,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>