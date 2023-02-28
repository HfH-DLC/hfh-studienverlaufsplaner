<template><div class="html-content" v-html="finalContent"></div></template>

<script lang="ts">
export default {
    props: {
        content: {
            type: String,
            required: true,
        },
    },
    computed: {
        finalContent(): string {
            let content = this.content;
            this.variables.forEach((variable) => {
                const regex = new RegExp(`{{\\s*${variable.key}\\s*}}`, "g");
                content = content.replaceAll(regex, variable.value);
            });
            return content;
        },

        variables() {
            return [{ key: "date", value: new Date().toLocaleDateString() }];
        },
    },
};
</script>

<style lang="scss">
.html-content {
    a {
        @apply font-bold text-thunderbird-red hover:underline focus:underline;
    }

    p:not(:first-child) {
        @apply mt-4;
    }

    h3 {
        @apply text-xl mt-3;
    }
}
</style>
