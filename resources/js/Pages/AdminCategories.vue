<template>
  <div class="flex-1 flex justify-between">
    <div class="w-8/12 p-4">
      <h2 class="text-xl">Kategorien</h2>
      <Button class="my-4" @click="showCreateForm">
        Kategorie erstellen
      </Button>
      <EntityList
        :entities="categories"
        @edit="showEditForm"
        @delete="deleteCategory"
      />
    </div>

    <Sidebar
      v-if="formVisible"
      @close="hideForm"
      class="w-4/12"
      :title="formTitle"
    >
      <CategoriesForm
        :planerSlug="planerSlug"
        @success="hideForm"
        :editedCategory="editedCategory"
      />
    </Sidebar>
  </div>
</template>

<script>
import AdminPlanerLayout from "../Layouts/AdminPlanerLayout.vue";
import Button from "../Components/Button.vue";
import EntityList from "../Components/EntityList.vue";
import Sidebar from "../Components/Sidebar.vue";
import CategoriesForm from "../Components/CategoriesForm.vue";
export default {
  layout: AdminPlanerLayout,
  components: {
    CategoriesForm,
    Button,
    EntityList,
    Sidebar,
  },
  props: {
    categoriesResource: {
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
      editedCategory: null,
      formVisible: false,
    };
  },
  computed: {
    categories() {
      return this.categoriesResource.data;
    },
    formTitle() {
      return this.editedCategory ? "Kategorie bearbeiten" : "Neue Kategorie";
    },
  },
  methods: {
    showForm() {
      this.formVisible = true;
    },
    showCreateForm() {
      this.editedCategory = null;
      this.showForm();
    },
    showEditForm(category) {
      this.editedCategory = category;
      this.showForm();
    },
    hideForm() {
      this.editedCategory = null;
      this.formVisible = false;
    },
    deleteCategory(category) {
      if (
        confirm(`Willst du die Kategorie ${category.name} wirklich löschen?`)
      ) {
        this.categoriesForm.delete(
          `/admin/planers/${this.planerSlug}/categories/${category.id}`,
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