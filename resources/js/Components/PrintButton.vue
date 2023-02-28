<template>
  <button class="flex items-center gap-1 hover:text-thunderbird-red" @click="print">
    <PrinterIcon class="w-5 h-5" aria-hidden="true" /> Drucken
  </button>
</template>

<script lang="ts">
import { PrinterIcon } from "@heroicons/vue/24/outline";
export default {
  components: {
    PrinterIcon,
  },
  methods: {
    print() {
      window.print();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
