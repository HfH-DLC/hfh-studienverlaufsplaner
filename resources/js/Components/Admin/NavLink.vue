<template>
    <Link
        :href="href"
        class="text-blue-600 hover:underline"
        :class="{ 'font-bold': active }"
    >
        <slot />
    </Link>
</template>

<script lang="ts" setup>
import { Link } from "@inertiajs/vue3";

const props = defineProps({
    href: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
});
</script>

<style lang="scss" scoped></style>
