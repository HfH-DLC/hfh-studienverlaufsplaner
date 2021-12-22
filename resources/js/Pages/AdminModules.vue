<template>
  <div class="flex-1 flex justify-between">
    <div class="w-8/12 p-4">
      <h2 class="text-xl">Module</h2>
      <button
        class="my-4 rounded p-2 bg-gray-700 text-white hover:bg-gray-900"
        @click="showCreateForm"
      >
        Modul erstellen
      </button>
      <ul>
        <li
          v-for="module in modules"
          :key="module.id"
          class="even:bg-gray-200 odd:bg-gray-100"
        >
          <div class="text-left p-2 flex justify-between items-center gap-12">
            <span>{{ module.number }} {{ module.name }}</span>
            <div class="space-x-2 whitespace-nowrap">
              <button
                @click="showEditForm(module)"
                class="p-1 focus:text-blue-600 hover:text-blue-600"
              >
                <PencilIcon class="inline-block w-5 h-5 flex-shrink-0" />
              </button>
              <button
                @click="deleteModule(module)"
                class="p-1 focus:text-red-600 hover:text-red-600"
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
        <form @submit.prevent="processForm">
          <label for="number" class="block uppercase text-sm"
            >Modulnummer</label
          >
          <input
            ref="numberInput"
            type="text"
            id="number"
            v-model="modulesForm.number"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            required
            :aria-describedby="modulesForm.errors.number && 'error-number'"
          />
          <Error
            id="error-number"
            class="mt-2"
            v-if="modulesForm.errors.number"
          >
            {{ modulesForm.errors.number }}
          </Error>
          <label for="name" class="block uppercase text-sm mt-3">Name</label>
          <input
            type="name"
            id="name"
            v-model="modulesForm.name"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            required
            :aria-describedby="modulesForm.errors.name && 'error-name'"
          />
          <Error id="error-name" class="mt-2" v-if="modulesForm.errors.name">
            {{ modulesForm.errors.name }}
          </Error>

          <label for="category" class="block uppercase text-sm mt-3"
            >Kategorie</label
          >
          <select
            v-model="modulesForm.category"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            required
            :aria-describedby="modulesForm.errors.category && 'error-category'"
          >
            <option disabled value="">Bitte wählen...</option>
            <option
              :value="category.id"
              v-for="category in categories"
              :key="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <Error
            id="error-category"
            class="mt-2"
            v-if="modulesForm.errors.category"
          >
            {{ modulesForm.errors.category }}
          </Error>

          <label for="credits" class="block uppercase text-sm mt-3"
            >Credits</label
          >
          <input
            type="credits"
            id="credits"
            v-model="modulesForm.credits"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            :aria-describedby="modulesForm.errors.credits && 'error-credits'"
          />
          <Error
            id="error-credits"
            class="mt-2"
            v-if="modulesForm.errors.credits"
          >
            {{ modulesForm.errors.credits }}
          </Error>

          <label for="timeSlots" class="block uppercase text-sm mt-3"
            >Termine</label
          >
          <MultiSelect
            v-model="moduleTimeSlots"
            id="timeSlots"
            class="
              w-full
              !box-border
              block
              border border-gray-600
              rounded
              shadow-inner
              p-1
            "
            :options="timeSlots"
            track-by="id"
            placeholder="Termin auswählen..."
            :multiple="true"
            :customLabel="timeSlotLabel"
            :aria-describedby="
              modulesForm.errors.timeSlots && 'error-timeslots'
            "
          >
          </MultiSelect>
          <Error
            v-if="modulesForm.errors.timeSlots"
            id="error-timeslots"
            class="mt-2"
          >
            {{ modulesForm.errors.timeSlots }}
          </Error>

          <label for="prerequisites" class="block uppercase text-sm mt-3"
            >Vorausetzungen</label
          >
          <MultiSelect
            id="prerequisites"
            v-model="modulePrerequisites"
            class="
              w-full
              !box-border
              block
              border border-gray-600
              rounded
              shadow-inner
              p-1
            "
            :options="modules"
            track-by="id"
            placeholder="Modul auswählen..."
            :multiple="true"
            label="number"
            :aria-describedby="
              modulesForm.errors.prerequisites && 'error-prerequisites'
            "
          >
          </MultiSelect>
          <Error
            id="error-prerequisites"
            class="mt-2"
            v-if="modulesForm.errors.prerequisites"
          >
            {{ modulesForm.errors.prerequisites }}
          </Error>

          <button
            type="submit"
            :disabled="modulesForm.processing"
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
import MultiSelect from "vue-multiselect";
import AdminPlanerLayout from "../Layouts/AdminPlanerLayout.vue";
export default {
  layout: AdminPlanerLayout,
  components: {
    PencilIcon,
    TrashIcon,
    XIcon,
    MultiSelect,
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
      modulesForm: this.$inertia.form({
        number: null,
        name: null,
        category: "",
        credits: null,
        timeSlots: [],
        prerequisites: [],
      }),
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
    formSubmitText() {
      return "Speichern";
    },
    moduleTimeSlots: {
      set(value) {
        this.modulesForm.timeSlots = value.map((slot) => slot.id);
      },
      get() {
        return this.modulesForm.timeSlots.map((id) =>
          this.timeSlots.find((slot) => slot.id == id)
        );
      },
    },
    modulePrerequisites: {
      set(value) {
        this.modulesForm.prerequisites = value.map((module) => module.id);
      },
      get() {
        return this.modulesForm.prerequisites.map((id) => {
          return this.modules.find((module) => module.id == id);
        });
      },
    },
  },
  methods: {
    showForm() {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.numberInput.focus();
      });
    },
    showCreateForm() {
      this.editedModule = null;
      this.modulesForm.reset();
      this.showForm();
    },
    showEditForm(module) {
      this.editedModule = module;
      this.modulesForm.number = module.number;
      this.modulesForm.name = module.name;
      this.modulesForm.category = module.category.id;
      this.modulesForm.credits = module.credits;
      this.modulesForm.timeSlots = module.timeSlots.map(
        (timeSlot) => timeSlot.id
      );
      this.modulesForm.prerequisites = module.prerequisites.map(
        (module) => module.id
      );
      this.modulesForm.requiredNumber = module.requiredNumber;
      this.showForm();
    },
    hideForm() {
      this.editedModule = null;
      this.modulesForm.reset();
      this.formVisible = false;
    },
    processForm() {
      if (this.editedModule) {
        this.editModule();
      } else {
        this.createModule();
      }
    },
    createModule() {
      this.modulesForm.post(`/admin/planers/${this.planerSlug}/modules`, {
        onSuccess: () => this.hideForm(),
      });
    },
    editModule() {
      this.modulesForm.put(
        `/admin/planers/${this.planerSlug}/modules/${this.editedModule.id}`,
        {
          onSuccess: () => this.hideForm(),
        }
      );
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
    timeSlotLabel(timeSlot) {
      return `${timeSlot.year}-${timeSlot.semester}-${timeSlot.week}-${timeSlot.day}-${timeSlot.time}`;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>