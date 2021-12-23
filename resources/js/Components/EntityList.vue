<template>
  <ul>
    <li
      v-for="entity in entities"
      :key="entity.id"
      class="even:bg-gray-200 odd:bg-gray-100"
    >
      <div class="text-left p-2 flex justify-between items-center gap-12">
        <span
          ><slot name="label" :entity="entity">{{ entity.name }}</slot></span
        >
        <div class="space-x-2 whitespace-nowrap">
          <button
            @click="showEditForm(entity)"
            class="p-1 focus:text-blue-600 hover:text-blue-600"
          >
            <PencilIcon class="inline-block w-5 h-5 flex-shrink-0" />
          </button>
          <button
            @click="deleteEntity(entity)"
            class="p-1 focus:red-blue-600 hover:text-red-600"
          >
            <TrashIcon class="inline-block w-5 h-5 flex-shrink-0" />
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { PencilIcon, TrashIcon } from "@heroicons/vue/outline";
export default {
  components: {
    PencilIcon,
    TrashIcon,
  },
  props: {
    entities: {
      type: Array,
      required: true,
    },
  },
  methods: {
    showEditForm(entity) {
      this.$emit("edit", entity);
    },
    deleteEntity(entity) {
      this.$emit("delete", entity);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>