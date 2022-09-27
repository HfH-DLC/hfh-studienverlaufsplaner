<template>
  <div class="lg:hidden">
    <MobileWarning />
  </div>
  <div class="hidden lg:block">
    <slot />
  </div>
</template>
<script setup>
import MobileWarning from "../Components/MobileWarning.vue";
</script>

<style lang="scss" scoped>
</style>