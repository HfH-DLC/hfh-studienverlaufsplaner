<template>
    <header>
        <PageHeader
            :planer-name="planerName"
            :planer-slug="planerSlug"
            :brochure-url="brochureUrl"
            :module-directory-url="moduleDirectoryUrl"
        ></PageHeader>
    </header>
    <main class="mt-8">
        <HfhInfoField class="max-w-content mx-4 md:mx-auto"
            >Der Studienverlaufsplaner ist nicht für die Betrachtung auf mobilen
            Geräten ausgelegt. Bitte verwenden Sie ein Gerät mit einer Breite
            von mindestens 1024 Pixel oder vergrössern Sie das Fenster Ihres
            Browsers.</HfhInfoField
        >
    </main>
</template>

<script setup lang="ts">
import { usePage } from "@inertiajs/vue3";
import type { PageProps } from "@inertiajs/core";
import { HfhInfoField } from "@hfh-dlc/hfh-styleguide";
import PageHeader from "./PageHeader.vue";

interface MainPage extends PageProps {
    planerName: string;
    planerSlug: string;
    brochureUrl: string;
    moduleDirectoryUrl: string;
}

const { planerName, planerSlug, brochureUrl, moduleDirectoryUrl } =
    usePage<MainPage>().props;
</script>

<style lang="scss" scoped></style>
