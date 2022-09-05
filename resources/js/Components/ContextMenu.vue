<template>
  <div class="flex gap-x-1">
    <ContextButton @click="removeModule(placement)" label="Modul entfernen">
      <TrashIcon class="w-4 h-4" />
    </ContextButton>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ContextButton from "./ContextButton.vue";
import { TrashIcon } from "@heroicons/vue/outline";
export default {
  components: {
    ContextButton,
    TrashIcon,
  },
  props: {
    placement: {
      type: Object,
      requried: true,
    },
  },
  methods: {
    ...mapActions("schedule", ["removeModule"]),
  },
};
</script>

<style lang="scss" scoped>
</style>