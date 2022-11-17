<template>
  <div>
    Das Modul
    <button @click="focusModule">
      {{ placement.module.id }} {{ placement.module.name }}
    </button>
    ist am Datum {{ placement.semester }} {{ placement.year }},
    {{ placement.timeWindow }}, {{ placement.day }} {{ placement.time }} nicht
    verfügbar.
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
  methods: {
    focusModule() {
      console.log("focusModule");
      this.$emitter.emit("focus-module", this.placement.module.id);
    },
  },
};
</script>