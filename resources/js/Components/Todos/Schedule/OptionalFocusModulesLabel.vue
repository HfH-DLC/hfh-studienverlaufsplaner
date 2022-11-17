<template>
  <div>
    Belegen Sie für den SSP "{{ focusName }}" {{ countString }}
    <template v-for="(module, index) in modules" :key="module.id">
      <template v-if="index < modules.length - 1">
        <span class="whitespace-nowrap">
          <button
            @click="focusModule(module)"
            role="button"
            tabIndex="0"
            data-action="focus-module"
            :data-module="module.id"
          >
            {{ module.id }}</button
          >,</span
        >
      </template>
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
import { numToWord } from "num-words-de";
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
    requiredNumber: {
      type: Number,
      required: true,
    },
  },
  computed: {
    countString() {
      if (this.modules.length == 1) {
        return "das Modul";
      } else {
        return (
          numToWord(this.requiredNumber, {
            uppercase: false,
            indefinite_eines: true,
          }) + " der Module"
        );
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