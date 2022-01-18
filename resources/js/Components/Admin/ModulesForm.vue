<template>
  <form @submit.prevent="processForm">
    <label for="number" class="block uppercase text-sm">Modulnummer</label>
    <input
      ref="firstInput"
      type="text"
      id="number"
      v-model="form.number"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.number && 'error-number'"
    />
    <Error id="error-number" class="mt-2" v-if="form.errors.number">
      {{ form.errors.number }}
    </Error>
    <label for="name" class="block uppercase text-sm mt-3">Name</label>
    <input
      type="name"
      id="name"
      v-model="form.name"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.name && 'error-name'"
    />
    <Error id="error-name" class="mt-2" v-if="form.errors.name">
      {{ form.errors.name }}
    </Error>

    <label for="category" class="block uppercase text-sm mt-3">Kategorie</label>
    <select
      v-model="form.category"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.category && 'error-category'"
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
    <Error id="error-category" class="mt-2" v-if="form.errors.category">
      {{ form.errors.category }}
    </Error>

    <label for="credits" class="block uppercase text-sm mt-3">Credits</label>
    <input
      type="credits"
      id="credits"
      v-model="form.credits"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      :aria-describedby="form.errors.credits && 'error-credits'"
    />
    <Error id="error-credits" class="mt-2" v-if="form.errors.credits">
      {{ form.errors.credits }}
    </Error>

    <label for="timeSlots" class="block uppercase text-sm mt-3">Termine</label>
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
      :aria-describedby="form.errors.timeSlots && 'error-timeslots'"
    >
    </MultiSelect>
    <Error v-if="form.errors.timeSlots" id="error-timeslots" class="mt-2">
      {{ form.errors.timeSlots }}
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
      :aria-describedby="form.errors.prerequisites && 'error-prerequisites'"
    >
    </MultiSelect>
    <Error
      id="error-prerequisites"
      class="mt-2"
      v-if="form.errors.prerequisites"
    >
      {{ form.errors.prerequisites }}
    </Error>

    <Button type="submit" :disabled="form.processing" class="w-full mt-3">
      Speichern
    </Button>
  </form>
</template>

<script>
import Button from "../Button.vue";
import Error from "../Error.vue";
import MultiSelect from "vue-multiselect";
export default {
  emits: ["success"],
  components: {
    Button,
    Error,
    MultiSelect,
  },
  props: {
    editedModule: {
      type: Object,
      default: null,
    },
    categories: {
      type: Array,
      required: true,
    },
    modules: {
      type: Array,
      required: true,
    },
    timeSlots: {
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
      form: this.$inertia.form({
        number: null,
        name: null,
        category: "",
        credits: null,
        timeSlots: [],
        prerequisites: [],
      }),
    };
  },
  mounted() {
    this.setModule(this.editedModule);
  },
  computed: {
    moduleTimeSlots: {
      set(value) {
        this.form.timeSlots = value.map((slot) => slot.id);
      },
      get() {
        return this.form.timeSlots.map((id) =>
          this.timeSlots.find((slot) => slot.id == id)
        );
      },
    },
    modulePrerequisites: {
      set(value) {
        this.form.prerequisites = value.map((module) => module.id);
      },
      get() {
        return this.form.prerequisites.map((id) => {
          return this.modules.find((module) => module.id == id);
        });
      },
    },
  },
  methods: {
    setModule() {
      this.form.reset();
      if (this.editedModule) {
        this.form.number = this.editedModule.number;
        this.form.name = this.editedModule.name;
        this.form.category = this.editedModule.category.id;
        this.form.credits = this.editedModule.credits;
        this.form.timeSlots = this.editedModule.timeSlots.map(
          (timeSlot) => timeSlot.id
        );
        this.form.prerequisites = this.editedModule.prerequisites.map(
          (module) => module.id
        );
        this.form.requiredNumber = this.editedModule.requiredNumber;
      }
      this.focusFirstInput();
    },
    focusFirstInput() {
      this.$nextTick(() => {
        this.$refs.firstInput.focus();
      });
    },
    processForm() {
      if (this.editedModule) {
        this.editModule();
      } else {
        this.createModule();
      }
    },
    createModule() {
      this.form.post(`/admin/planers/${this.planerSlug}/modules`, {
        onSuccess: () => this.$emit("success"),
      });
    },
    editModule() {
      this.form.put(
        `/admin/planers/${this.planerSlug}/modules/${this.editedModule.id}`,
        {
          onSuccess: () => this.$emit("success"),
        }
      );
    },
    timeSlotLabel(timeSlot) {
      return `${timeSlot.year}-${timeSlot.semester}-${timeSlot.week}-${timeSlot.day}-${timeSlot.time}`;
    },
  },
  watch: {
    editedModule(newValue, oldValue) {
      this.setModule(newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>