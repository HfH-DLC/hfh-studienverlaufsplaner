<template>
    <div class="p-4">
        <h1 class="text-xl">Import</h1>
        <h2 class="text-lg">Config</h2>
        <form @submit.prevent="submitConfig">
            <div class="mt-2">
                <label for="file" class="block text-sm">Datei</label>
                <input
                    type="file"
                    accept="application/json"
                    name="file"
                    id="file"
                    @change="setConfigFile"
                    required
                />
            </div>
            <HfhButton type="submit" class="mt-4">Importieren</HfhButton>
        </form>

        <h2 class="mt-8 text-lg">Events</h2>
        <form @submit.prevent="submitEvents">
            <div class="mt-2">
                <label for="file" class="block text-sm">Datei</label>
                <input
                    type="file"
                    accept="application/json"
                    name="file"
                    id="file"
                    @change="setEventsFile"
                    required
                />
            </div>
            <HfhButton type="submit" class="mt-4">Importieren</HfhButton>
        </form>
    </div>
</template>

<script lang="ts">
import AdminLayoutVue from "../../Layouts/AdminLayout.vue";
export default {
    layout: AdminLayoutVue,
};
</script>

<script lang="ts" setup>
import { useForm } from "@inertiajs/vue3";
import { HfhButton } from "@hfh-dlc/hfh-styleguide";

const configForm = useForm({
    import: null,
} as { import: File | null });

const eventsForm = useForm({
    import: null,
} as { import: File | null });

const setConfigFile = (event: Event) => {
    const target = event.target as HTMLInputElement | null;
    const files = target?.files;
    if (files && files.length > 0) {
        configForm.import = files[0];
    } else {
        configForm.import = null;
    }
};

const setEventsFile = (event: Event) => {
    const target = event.target as HTMLInputElement | null;
    const files = target?.files;
    if (files && files.length > 0) {
        eventsForm.import = files[0];
    } else {
        eventsForm.import = null;
    }
};
const submitConfig = () => {
    configForm.post(`/admin/import/config`, {
        onSuccess: () => configForm.reset(),
    });
};

const submitEvents = () => {
    eventsForm.post(`/admin/import/events`, {
        onSuccess: () => eventsForm.reset(),
    });
};
</script>

<style lang="scss" scoped></style>
