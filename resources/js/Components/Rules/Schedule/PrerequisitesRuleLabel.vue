<template>
  <div>
    <template v-if="missingPrerequisites.length === 1">
      Das Modul
      <button @click="focusModule(missingPrerequisites[0])">
        {{ missingPrerequisites[0].id }} {{ missingPrerequisites[0].name }}
      </button>
      muss vor
      <button @click="focusModule(module)">
        {{ module.id }} {{ module.name }}
      </button>
      belegt werden.
    </template>
    <template v-else>
      Die Module
      <template
        v-for="(prerequisite, index) in missingPrerequisites"
        :key="prerequisite.id"
      >
        <button @click="focusModule(prerequisite)">
          {{ prerequisite.id }} {{ prerequisite.name }}
        </button>
        <span v-if="index < missingPrerequisites.length - 3">, </span>
        <span v-if="index == missingPrerequisites.length - 2"> und </span>
      </template>
      müssen vor
      <button @click="focusModule(module)">
        {{ module.id }} {{ module.name }}
      </button>
      belegt werden.
    </template>
  </div>
</template>

<script>
export default {
  props: {
    module: {
      type: Object,
      required: true,
    },
    missingPrerequisites: {
      type: Array,
      required: true,
    },
  },
  methods: {
    focusModule(module) {
      this.$emitter.emit("focus-module", module.id);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>