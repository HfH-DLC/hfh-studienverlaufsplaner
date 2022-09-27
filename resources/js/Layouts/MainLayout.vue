<template>
  <div class="lg:hidden print:hidden">
    <MobileWarning />
  </div>
  <div class="hidden lg:block print:block">
    <slot />
  </div>
</template>
<script setup>
import MobileWarning from "../Components/MobileWarning.vue";
</script>

<style lang="scss" scoped>
</style>