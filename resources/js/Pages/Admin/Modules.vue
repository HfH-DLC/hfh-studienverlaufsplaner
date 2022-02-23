<template>
  <div class="flex-1 flex justify-between">
    <div class="w-full p-4">
      <h2 class="text-xl">Module</h2>
      <EntityList :entities="modules">
        <template v-slot:label="slotProps">
          <Link :href="`/admin/modules/${slotProps.entity.id}`"
            >{{ slotProps.entity.id }} {{ slotProps.entity.name }}</Link
          >
        </template>
      </EntityList>
    </div>
  </div>
</template>

<script>
import EntityList from "../../Components/Admin/EntityList.vue";
import { Link } from "@inertiajs/inertia-vue3";
import AdminLayout from "../../Layouts/AdminLayout.vue";
export default {
  layout: AdminLayout,
  components: {
    EntityList,
    Link,
  },
  props: {
    modulesResource: {
      type: Object,
      required: true,
    },
  },
  computed: {
    modules() {
      return this.modulesResource.data;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>