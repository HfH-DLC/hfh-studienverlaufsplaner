<template>
    <Head :title="computedTitle"> </Head>
</template>

<script lang="ts" setup>
import { Head } from "@inertiajs/vue3";
import { PropType, computed } from "vue";

const props = defineProps({
    title: { type: String as PropType<string>, default: "" },
    planerName: { type: String as PropType<string>, default: "" },
});

const computedTitle = computed(() => {
    let result = "Studienverlaufsplaner";
    if (props.title) {
        result = props.title + " - " + result;
    }
    if (props.planerName) {
        result = result + " " + props.planerName;
    }
    return result;
});
</script>
