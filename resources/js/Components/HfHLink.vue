<template>
    <a
        :href="href"
        target="_blank"
        rel="“noopener"
        noreferrer
        class="text-thunderbird-red hover:text-thunderbird-red-light hover:underline focus:text-thunderbird-red-light focus:underline"
        ><slot
    /></a>
</template>

<script lang="ts">
export default {
    props: {
        href: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped></style>
