<template>
    <Head :title="computedTitle">
        <slot />
    </Head>
</template>

<script lang="ts">
import { Head } from "@inertiajs/vue3";
import { PropType } from "@vue/runtime-core";

export default {
    components: {
        Head,
    },
    props: {
        title: { type: String as PropType<string>, default: "" },
        planerName: { type: String as PropType<string>, default: "" },
    },
    computed: {
        computedTitle(): string {
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
