<template>
    <div class="flex-1 flex justify-between">
        <div class="w-full p-4">
            <h2 class="text-xl">Regeln</h2>
            <RulesImport />
            <EntityList :entities="rules">
                <template v-slot:label="slotProps">
                    {{ slotProps.entity.id }} - {{ slotProps.entity.type }} -
                    {{ slotProps.entity.params }}
                </template>
            </EntityList>
        </div>
    </div>
</template>

<script>
import AdminLayout from "../../Layouts/AdminLayout.vue";
import EntityList from "../../Components/Admin/EntityList.vue";
import RulesImport from "../../Components/Admin/RulesImport.vue";
export default {
    layout: AdminLayout,
    components: {
        EntityList,
        RulesImport,
    },
    props: {
        rulesResource: {
            type: Object,
            required: true,
        },
        types: {
            type: Array,
            required: true,
        },
    },
    computed: {
        rules() {
            return this.rulesResource.data;
        },
    },
};
</script>

<style lang="scss" scoped></style>
