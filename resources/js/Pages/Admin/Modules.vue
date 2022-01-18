<template>
  <div class="flex-1 flex justify-between">
    <div class="w-8/12 p-4">
      <h2 class="text-xl">Module</h2>
      <Button class="my-4" @click="showCreateForm"> Modul erstellen </Button>
      <EntityList
        :entities="modules"
        @edit="showEditForm"
        @delete="deleteModule"
      >
        <template v-slot:label="slotProps">
          {{ slotProps.entity.number }} {{ slotProps.entity.name }}
        </template>
      </EntityList>
    </div>

    <Sidebar
      class="w-4/12"
      v-if="formVisible"
      @close="hideForm"
      :title="formTitle"
    >
      <ModulesForm
        :planerSlug="planerSlug"
        @success="hideForm"
        :editedModule="editedModule"
        :categories="categories"
        :modules="modules"
        :timeSlots="timeSlots"
      />
    </Sidebar>
  </div>
</template>

<script>
import AdminPlanerLayout from "../../Layouts/AdminPlanerLayout.vue";
import Button from "../../Components/Button.vue";
import EntityList from "../../Components/EntityList.vue";
import ModulesForm from "../../Components/Admin/ModulesForm.vue";
import Sidebar from "../../Components/Sidebar.vue";
export default {
  layout: AdminPlanerLayout,
  components: {
    Button,
    EntityList,
    ModulesForm,
    Sidebar,
  },
  props: {
    modulesResource: {
      type: Object,
      required: true,
    },
    categoriesResource: {
      type: Object,
      required: true,
    },
    timeSlotsResource: {
      type: Object,
      required: true,
    },
    planerSlug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      editedModule: null,
      formVisible: false,
    };
  },
  computed: {
    categories() {
      return this.categoriesResource.data;
    },
    timeSlots() {
      return this.timeSlotsResource.data;
    },
    modules() {
      return this.modulesResource.data;
    },
    formTitle() {
      return this.editedModule ? "Modul bearbeiten" : "Neues Module";
    },
  },
  methods: {
    showForm() {
      this.formVisible = true;
    },
    showCreateForm() {
      this.editedModule = null;
      this.showForm();
    },
    showEditForm(module) {
      this.editedModule = module;
      this.showForm();
    },
    hideForm() {
      this.editedModule = null;
      this.formVisible = false;
    },
    deleteModule(module) {
      if (
        confirm(
          `Willst du das Module ${module.number} ${module.name} wirklich löschen?`
        )
      ) {
        this.modulesForm.delete(
          `/admin/planers/${this.planerSlug}/modules/${module.id}`,
          {
            onSuccess: () => this.hideForm(),
          }
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>