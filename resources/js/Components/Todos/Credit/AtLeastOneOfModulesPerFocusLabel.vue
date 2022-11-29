<template>
  <div>
    Rechnen Sie mindestens eines der Module
    <template v-for="(moduleId, index) in moduleIds" :key="moduleId">
      <span class="whitespace-nowrap"
        ><button @click="focusModule(moduleId)">
          {{ moduleId }}</button
        ><template v-if="index < moduleIds.length - 2">, </template></span
      >
      <template v-if="index == moduleIds.length - 2"> oder </template>
    </template>
    an den SSP "{{ focusName }}" an.
  </div>
</template>

<script>
export default {
  props: {
    moduleIds: {
      type: Array,
      required: true,
    },
    focusName: {
      type: String,
      required: true,
    },
  },
  methods: {
    focusModule(id) {
      this.$emitter.emit("focus-module", id);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>