<template>
  <div class="flex-1 flex justify-between">
    <div class="w-8/12 p-4">
      <h2 class="text-xl">Kategorien</h2>
      <button
        class="my-4 rounded p-2 bg-gray-700 text-white hover:bg-gray-900"
        @click="showCreateForm"
      >
        Kategorie erstellen
      </button>
      <ul>
        <li
          v-for="category in categories"
          :key="category.id"
          class="even:bg-gray-200 odd:bg-gray-100"
        >
          <div class="text-left p-2 flex justify-between items-center gap-12">
            <span>{{ category.name }}</span>
            <div class="space-x-2 whitespace-nowrap">
              <button
                @click="showEditForm(category)"
                class="p-1 hover:text-blue-600"
              >
                <PencilIcon class="inline-block w-5 h-5 flex-shrink-0" />
              </button>
              <button
                @click="deleteCategory(category)"
                class="p-1 hover:text-red-600"
              >
                <TrashIcon class="inline-block w-5 h-5 flex-shrink-0" />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="w-4/12 border-l border-gray-300" v-if="formVisible">
      <div class="bg-gray-700 flex justify-end items-center">
        <button class="text-3xl p-2 text-white" @click="hideForm">
          <XIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="p-4">
        <h2 class="text-lg whitespace-nowrap">{{ formTitle }}</h2>
        <form @submit.prevent="processForm" class="mt-2">
          <label for="name" class="block uppercase text-sm">Name</label>
          <input
            ref="nameInput"
            type="text"
            id="name"
            v-model="categoriesForm.name"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            :aria-describedby="planersForm.errors.name && 'error-name'"
          />
          <Error v-if="categoriesForm.errors.name" id="error-name" class="mt-2">
            {{ categoriesForm.errors.name }}
          </Error>
          <label for="required-number" class="block uppercase text-sm mt-3"
            >Anzahl benötigter Module</label
          >
          <input
            type="number"
            id="required-number"
            v-model="categoriesForm.requiredNumber"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            :aria-describedby="
              planersForm.errors.name && 'error-required-number'
            "
          />
          <Error
            v-if="categoriesForm.errors.requiredNumber"
            id="error-required-number"
            class="mt"
          >
            {{ categoriesForm.errors.requiredNumber }}
          </Error>
          <button
            type="submit"
            :disabled="categoriesForm.processing"
            class="
              w-full
              mt-3
              rounded
              p-2
              bg-gray-700
              text-white
              hover:bg-gray-900
            "
          >
            {{ formSubmitText }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { PencilIcon, TrashIcon, XIcon } from "@heroicons/vue/outline";
import AdminLayout from "../Layouts/AdminLayout.vue";
export default {
  layout: AdminLayout,
  components: {
    PencilIcon,
    TrashIcon,
    XIcon,
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
      categoriesForm: this.$inertia.form({
        name: null,
        requiredNumber: null,
      }),
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
      this.editedCategory = null;
      this.categoriesForm.reset();
      this.showForm();
    },
    showEditForm(category) {
      this.editedCategory = category;
      this.categoriesForm.name = this.editedCategory.name;
      this.categoriesForm.requiredNumber = this.editedCategory.requiredNumber;
      this.showForm();
    },
    hideForm() {
      this.editedCategory = null;
      this.categoriesForm.reset();
      this.formVisible = false;
    },
    processForm() {
      if (this.editedCategory) {
        this.editCategory();
      } else {
        this.createCategory();
      }
    },
    createCategory() {
      this.categoriesForm.post(`/admin/planers/${this.planerSlug}/categories`, {
        onSuccess: () => this.hideForm(),
      });
    },
    editCategory() {
      this.categoriesForm.put(
        `/admin/planers/${this.planerSlug}/categories/${this.editedCategory.id}`,
        {
          onSuccess: () => this.hideForm(),
        }
      );
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