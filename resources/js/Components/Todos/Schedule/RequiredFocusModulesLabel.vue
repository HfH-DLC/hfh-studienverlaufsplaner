<template>
  <div>
    Belegen Sie für den SSP "{{ focusName }}" {{ countString }}
    <template v-for="(module, index) in modules" :key="module.id">
      <span v-if="index < modules.length - 1" class="whitespace-nowrap">
        <button
          @click="focusModule(module)"
          role="button"
          tabIndex="0"
          data-action="focus-module"
          :data-module="module.id"
        >
          {{ module.id }}</button
        >,
      </span>
      <span v-else class="whitespace-nowrap">
        <button
          @click="focusModule(module)"
          role="button"
          tabIndex="0"
          data-action="focus-module"
          :data-module="module.id"
        >
          {{ module.id }}</button
        >.
      </span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    focusName: {
      type: String,
      required: true,
    },
    modules: {
      type: Array,
      required: true,
    },
  },
  computed: {
    countString() {
      if (this.modules.length == 1) {
        return "das Modul";
      } else {
        return "die Module";
      }
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