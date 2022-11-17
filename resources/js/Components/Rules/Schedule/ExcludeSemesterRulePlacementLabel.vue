<template>
  <div>
    <button @click="focusModule">
      {{ placement.module.id }} {{ placement.module.name }}
    </button>
    kann nicht im {{ positionText }} Semester belegt werden.`
  </div>
</template>

<script>
export default {
  props: {
    placement: {
      type: Object,
      required: true,
    },
  },
  computed: {
    positionText() {
      return this.excludePositions.reduce((acc, cur, i, array) => {
        return (
          acc +
          (cur + 1) +
          "." +
          (i < array.length - 2 ? ", " : i < array.length - 1 ? " oder " : "")
        );
      }, "");
    },
  },
  methods: {
    focusModule() {
      this.$emitter.emit("focus-module", this.placement.module.id);
    },
  },
};
</script>