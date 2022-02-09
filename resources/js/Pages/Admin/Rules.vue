<template>
  <div class="flex-1 flex justify-between">
    <div class="w-8/12 p-4">
      <h2 class="text-xl">Regeln</h2>
      <Button class="my-4" @click="showCreateForm"> Regel erstellen </Button>
      <EntityList :entities="rules" @edit="showEditForm" @delete="deleteRule" />
    </div>

    <Sidebar
      v-if="formVisible"
      @close="hideForm"
      class="w-4/12"
      :title="formTitle"
    >
      <RulesForm
        :planerSlug="planerSlug"
        @success="hideForm"
        :editedRule="editedRule"
        :types="types"
      />
    </Sidebar>
  </div>
</template>

<script>
import AdminPlanerLayout from "../../Layouts/AdminPlanerLayout.vue";
import Button from "../../Components/Button.vue";
import EntityList from "../../Components/EntityList.vue";
import Sidebar from "../../Components/Sidebar.vue";
import RulesForm from "../../Components/Admin/RulesForm.vue";
export default {
  layout: AdminPlanerLayout,
  components: {
    RulesForm,
    Button,
    EntityList,
    Sidebar,
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
    planerSlug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      editedRule: null,
      formVisible: false,
    };
  },
  computed: {
    rules() {
      return this.rulesResource.data;
    },
    formTitle() {
      return this.editedRule ? "Regel bearbeiten" : "Neue Regel";
    },
  },
  methods: {
    showForm() {
      this.formVisible = true;
    },
    showCreateForm() {
      this.editedRule = null;
      this.showForm();
    },
    showEditForm(rule) {
      this.editedRule = rule;
      this.showForm();
    },
    hideForm() {
      this.editedRule = null;
      this.formVisible = false;
    },
    deleteRule(rule) {
      if (confirm(`Willst du die Regel ${rule.id} wirklich löschen?`)) {
        this.rulesForm.delete(
          `/admin/planers/${this.planerSlug}/rules/${rule.id}`,
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