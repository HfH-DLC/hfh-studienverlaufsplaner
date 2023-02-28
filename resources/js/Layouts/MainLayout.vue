<template>
    <div class="lg:hidden print:hidden">
        <MobileWarning />
    </div>
    <div class="hidden lg:block print:block">
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
import MobileWarning from "../Components/MobileWarning.vue";
</script>

<style lang="scss" scoped></style>
