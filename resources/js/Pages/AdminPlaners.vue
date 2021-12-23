<template>
  <div class="flex-1 flex justify-between">
    <div class="w-8/12 p-4">
      <h2 class="text-xl">Planer</h2>
      <Button class="my-4" @click="showCreateForm"> Planer erstellen </Button>
      <EntityList
        :entities="planers"
        @edit="showEditForm"
        @delete="deletePlaner"
      >
        <template v-slot:label="slotProps">
          <Link
            :href="`/admin/planers/${slotProps.entity.slug}`"
            class="focus:text-blue-600 hover:text-blue-600"
            >{{ slotProps.entity.name }}</Link
          >
        </template>
      </EntityList>
    </div>

    <Sidebar
      class="w-4/12"
      v-if="formVisible"
      :title="formTitle"
      @close="hideForm"
    >
      <form @submit.prevent="processForm" class="mt-2">
        <label for="name" class="block uppercase text-sm">Name</label>
        <input
          ref="nameInput"
          type="text"
          id="name"
          v-model="planersForm.name"
          class="w-full block border border-gray-600 rounded shadow-inner p-1"
          required
          :aria-describedby="planersForm.errors.name && 'error-name'"
        />
        <Error id="error-name" v-if="planersForm.errors.name" class="mt-2">
          {{ planersForm.errors.name }}
        </Error>
        <label for="required-credits" class="block uppercase text-sm mt-3"
          >Benötigte Kreditpunkte</label
        >
        <input
          type="number"
          required
          id="required-credits"
          v-model="planersForm.requiredCredits"
          class="w-full block border border-gray-600 rounded shadow-inner p-1"
          :aria-describedby="
            planersForm.errors.requiredCredits && 'error-required-credits'
          "
        />
        <Error
          id="error-required-credits"
          class="mt-2"
          v-if="planersForm.errors.requiredCredits"
        >
          {{ planersForm.errors.requiredCredits }}
        </Error>
        <fieldset class="mt-3">
          <legend class="block uppercase text-sm">Tage</legend>
          <div
            class="flex items-center gap-x-2"
            v-for="day in days"
            :key="day.id"
          >
            <input
              type="checkbox"
              :id="day.id"
              :value="day.label"
              v-model="planersForm.optionsDay"
            />
            <label :for="day.id">{{ day.label }}</label>
          </div>
        </fieldset>
        <Button
          type="submit"
          :disabled="planersForm.processing"
          class="w-full mt-3"
        >
          {{ formSubmitText }}
        </Button>
      </form>
    </Sidebar>
  </div>
</template>

<script>
import { Link } from "@inertiajs/inertia-vue3";
import { XIcon } from "@heroicons/vue/outline";
import AdminLayout from "../Layouts/AdminLayout.vue";
import Error from "../Components/Error.vue";
import Button from "../Components/Button.vue";
import Sidebar from "../Components/Sidebar.vue";
import EntityList from "../Components/EntityList.vue";
export default {
  layout: AdminLayout,
  components: {
    Button,
    Link,
    EntityList,
    Error,
    Sidebar,
    XIcon,
  },
  props: {
    planersResource: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      planersForm: this.$inertia.form({
        name: null,
        requiredCredits: null,
        optionsDay: [],
      }),
      editedPlaner: null,
      formVisible: false,
      days: [
        { id: "montag", label: "Montag" },
        { id: "dienstag", label: "Dienstag" },
        { id: "mittwoch", label: "Mittwoch" },
        { id: "donnerstag", label: "Donnerstag" },
        { id: "freitag", label: "Freitag" },
        { id: "samstag", label: "Samstag" },
        { id: "sonntag", label: "Sonntag" },
      ],
    };
  },
  computed: {
    planers() {
      return this.planersResource.data;
    },
    formTitle() {
      return this.editedPlaner ? "Planer bearbeiten" : "Neue Planer";
    },
    formSubmitText() {
      return "Speichern";
    },
  },
  methods: {
    showForm() {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.nameInput.focus();
      });
    },
    showCreateForm() {
      this.editedPlaner = null;
      this.planersForm.reset();
      this.showForm();
    },
    showEditForm(planer) {
      this.editedPlaner = planer;
      this.planersForm.name = this.editedPlaner.name;
      this.planersForm.requiredCredits = this.editedPlaner.requiredCredits;
      this.planersForm.optionsDay = this.editedPlaner.optionsDay;
      this.showForm();
    },
    hideForm() {
      this.editedPlaner = null;
      this.planersForm.reset();
      this.formVisible = false;
    },
    processForm() {
      if (this.editedPlaner) {
        this.editPlaner();
      } else {
        this.createPlaner();
      }
    },
    createPlaner() {
      this.planersForm.post(`/admin/planers`, {
        onSuccess: () => this.hideForm(),
      });
    },
    editPlaner() {
      this.planersForm.put(`/admin/planers/${this.editedPlaner.slug}`, {
        onSuccess: () => this.hideForm(),
      });
    },
    deletePlaner(planer) {
      if (confirm(`Willst du den Planer ${planer.name} wirklich löschen?`)) {
        this.planersForm.delete(`/admin/planers/${planer.slug}`, {
          onSuccess: () => this.hideForm(),
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>