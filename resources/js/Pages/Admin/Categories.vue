<template>
    <div class="flex-1 flex justify-between">
        <div class="w-full p-4">
            <h2 class="text-xl">Kategorien</h2>
            <EntityList :entities="categories" />
        </div>
    </div>
</template>

<script>
import EntityList from "../../Components/Admin/EntityList.vue";
import AdminLayout from "../../Layouts/AdminLayout.vue";
export default {
    layout: AdminLayout,
    components: {
        EntityList,
    },
    props: {
        categoriesResource: {
            type: Object,
            required: true,
        },
    },
    computed: {
        categories() {
            return this.categoriesResource.data;
        },
    },
};
</script>

<style lang="scss" scoped></style>
