<template>
    <div class="p-4">
        <h1 class="text-xl">Daten</h1>
        <form @submit.prevent="submit" class="mt-4">
            <div class="mt-2">
                <label for="file" class="block text-sm">Datei</label>
                <input
                    type="file"
                    accept="application/json"
                    name="file"
                    id="file"
                    @change="setFile"
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

const form = useForm({
    import: null,
} as { import: File | null });

const setFile = (event: Event) => {
    const target = event.target as HTMLInputElement | null;
    const files = target?.files;
    if (files && files.length > 0) {
        form.import = files[0];
    } else {
        form.import = null;
    }
};
const submit = () => {
    form.post(`/admin/data`, {
        onSuccess: () => form.reset(),
    });
};
</script>

<style lang="scss" scoped></style>
