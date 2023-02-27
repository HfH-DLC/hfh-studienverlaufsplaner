<template>
    <Link
        :href="href"
        class="text-blue-600 hover:underline"
        :class="{ 'font-bold': active }"
    >
        <slot />
    </Link>
</template>

<script lang="ts">
import { Link } from "@inertiajs/vue3";

export default {
    props: {
        href: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
    components: { Link },
};
</script>

<style lang="scss" scoped></style>
