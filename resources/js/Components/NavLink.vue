<template>
    <Link
        :href="href"
        class="text-blue-600 hover:underline"
        :class="{ 'font-bold': active }"
        ><slot
    /></Link>
</template>

<script>
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
};
</script>

<style lang="scss" scoped></style>
