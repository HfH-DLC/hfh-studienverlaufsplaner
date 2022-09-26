<template>
  <Head :title="computedTitle">
    <slot />
  </Head>
</template>

<script>
import { Head } from "@inertiajs/inertia-vue3";

export default {
  components: {
    Head,
  },
  props: {
    title: { type: String, default: "" },
    planerName: { type: String, default: "" },
  },
  computed: {
    computedTitle() {
      let result = "Studienverlaufsplaner";
      if (this.title) {
        result = this.title + " - " + result;
      }
      if (this.planerName) {
        result = result + " " + this.planerName;
      }
      return result;
    },
  },
};
</script>