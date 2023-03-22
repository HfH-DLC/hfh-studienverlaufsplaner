<template>
    <AppHead />
    <PageHeader></PageHeader>
    <main class="p-4 max-w-container mx-auto">
        <h1>Willkommen!</h1>
        <p>Bitte wählen Sie einen Studiengang.</p>
        <ul class="mt-4 grid grid-cols-2 gap-8">
            <li v-for="planer in planers" :key="planer.id">
                <HfhTeaser
                    :title="planer.name"
                    :link="planer.slug"
                    class="h-full"
                ></HfhTeaser>
            </li>
        </ul>
    </main>
</template>

<script lang="ts">
import AppHead from "@/Components/AppHead.vue";
import PageHeader from "@/Components/PageHeader.vue";
import {
    HfhButton,
    HfhHeaderBar,
    HfhInput,
    HfhLogo,
    HfhSelect,
    HfhLink,
    HfhTeaser,
} from "@hfh-dlc/hfh-styleguide";
export default {
    components: {
        AppHead,
        HfhButton,
        HfhHeaderBar,
        HfhInput,
        HfhLink,
        HfhLogo,
        HfhSelect,
        HfhTeaser,
        PageHeader,
    },
    props: {
        planersResource: {
            type: Object,
            required: true,
        },
    },
    computed: {
        planers() {
            return this.planersResource.data;
        },
    },
};
</script>

<style lang="scss" scoped>
h1 {
    display: inline-block;
    margin-bottom: 1.5rem;
    font-size: 2.25rem;
}
h2 {
    display: inline-block;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
}
p {
    margin-bottom: 1.5rem;
}
</style>
