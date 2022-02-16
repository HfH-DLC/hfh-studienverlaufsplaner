<template>
  <div class="flex-1 flex justify-between">
    <div class="w-full p-4">
      <h2 class="text-xl">Planer</h2>
      <EntityList :entities="planers">
        <template v-slot:label="slotProps">
          {{ slotProps.entity.name }}
        </template>
      </EntityList>
    </div>
  </div>
</template>

<script>
import { Link } from "@inertiajs/inertia-vue3";
import AdminLayout from "../../Layouts/AdminLayout.vue";
import EntityList from "../../Components/Admin/EntityList.vue";
export default {
  layout: AdminLayout,
  components: {
    Link,
    EntityList,
    Error,
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
</style>