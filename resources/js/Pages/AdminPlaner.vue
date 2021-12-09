<template>
  <div class="p-4 flex gap-16">
    <div>
      <h2 class="text-lg mb-2">Neue Kategorie</h2>
      <form @submit.prevent="createCategory">
        <label for="name" class="block uppercase text-sm">Name</label>
        <input
          type="text"
          id="name"
          v-model="categoriesForm.name"
          class="block border border-gray-600 rounded shadow-inner p-1"
          required
        />
        <div v-if="categoriesForm.errors.name">
          {{ categoriesForm.errors.name }}
        </div>
        <label for="required-number" class="block uppercase text-sm mt-3"
          >Anzahl benötigter Module</label
        >
        <input
          type="number"
          id="required-number"
          v-model="categoriesForm.requiredNumber"
          class="block border border-gray-600 rounded shadow-inner p-1"
        />
        <div v-if="categoriesForm.errors.requiredNumber">
          {{ categoriesForm.errors.requiredNumber }}
        </div>
        <button
          type="submit"
          :disabled="categoriesForm.processing"
          class="mt-3 rounded p-2 border-2 border-black font-bold"
        >
          Kategorie erstellen
        </button>
      </form>
      <div v-if="categories">
        <h2 class="text-lg mb-2">Kategorien</h2>
        <ul>
          <li v-for="category in categories" :key="category.id">
            {{ category.name }}
          </li>
        </ul>
      </div>
    </div>

    <div>
      <h2 class="text-lg mb-2">Neuer Termin</h2>
      <form @submit.prevent="createTimeSlot">
        <label for="year" class="block uppercase text-sm">Jahr</label>
        <input
          type="number"
          id="year"
          v-model="timeSlotsForm.year"
          class="block border border-gray-600 rounded shadow-inner p-1"
          required
        />
        <div v-if="timeSlotsForm.errors.year">
          {{ timeSlotsForm.errors.year }}
        </div>
        <label for="semester" class="block uppercase text-sm mt-3"
          >Semester</label
        >
        <select
          id="semester"
          v-model="timeSlotsForm.semester"
          class="block border border-gray-600 rounded shadow-inner p-1"
          required
        >
          <option value="" disabled>Bitte wählen...</option>
          <option value="HS">HS</option>
          <option value="FS">FS</option>
        </select>
        <div v-if="timeSlotsForm.errors.semester">
          {{ timeSlotsForm.errors.semester }}
        </div>

        <label for="week" class="block uppercase text-sm mt-3">Woche</label>
        <select
          id="week"
          v-model="timeSlotsForm.week"
          class="block border border-gray-600 rounded shadow-inner p-1"
          required
        >
          <option value="" disabled>Bitte wählen...</option>
          <option value="Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13">
            Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13
          </option>
          <option value="Wo 1, 6, 10, 14">Wo 1, 6, 10, 14</option>
        </select>
        <div v-if="timeSlotsForm.errors.week">
          {{ timeSlotsForm.errors.week }}
        </div>

        <label for="day" class="block uppercase text-sm mt-3">Tag</label>
        <select
          id="day"
          v-model="timeSlotsForm.day"
          class="block border border-gray-600 rounded shadow-inner p-1"
          required
        >
          <option value="" disabled>Bitte wählen...</option>
          <option value="Montag">Montag</option>
          <option value="Donnerstag">Donnerstag</option>
        </select>
        <div v-if="timeSlotsForm.errors.day">
          {{ timeSlotsForm.errors.day }}
        </div>

        <label for="time" class="block uppercase text-sm mt-3">Zeit</label>
        <select
          id="time"
          v-model="timeSlotsForm.time"
          class="block border border-gray-600 rounded shadow-inner p-1"
          required
        >
          <option value="" disabled>Bitte wählen...</option>
          <option value="Vormittag">Vormittag</option>
          <option value="Nachmittag">Nachmittag</option>
        </select>
        <div v-if="timeSlotsForm.errors.time">
          {{ timeSlotsForm.errors.time }}
        </div>

        <button
          type="submit"
          :disabled="timeSlotsForm.processing"
          class="mt-3 rounded p-2 border-2 border-black font-bold"
        >
          Termin erstellen
        </button>
      </form>
      <div v-if="timeSlots">
        <h2 class="text-lg mb-2">Termine</h2>
        <ul>
          <li v-for="timeSlot in timeSlots" :key="timeSlot.id">
            {{ timeSlot.year }}-{{ timeSlot.semester }}-{{ timeSlot.week }}-{{
              timeSlot.day
            }}-{{ timeSlot.time }}
          </li>
        </ul>
      </div>
    </div>

    <div>
      <h2 class="text-lg mb-2">Neues Modul</h2>
      <form @submit.prevent="createModule">
        <label for="number" class="block uppercase text-sm">Modulnummer</label>
        <input
          type="text"
          id="number"
          v-model="modulesForm.number"
          class="block border border-gray-600 rounded shadow-inner p-1"
          required
        />
        <div v-if="modulesForm.errors.number">
          {{ modulesForm.errors.number }}
        </div>
        <label for="name" class="block uppercase text-sm mt-3">Name</label>
        <input
          type="name"
          id="name"
          v-model="modulesForm.name"
          class="block border border-gray-600 rounded shadow-inner p-1"
          required
        />
        <div v-if="modulesForm.errors.name">
          {{ modulesForm.errors.name }}
        </div>

        <label for="category" class="block uppercase text-sm mt-3"
          >Kategorie</label
        >
        <select
          v-model="modulesForm.category"
          class="block border border-gray-600 rounded shadow-inner p-1"
          required
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
        <div v-if="modulesForm.errors.category">
          {{ modulesForm.errors.category }}
        </div>

        <label for="credits" class="block uppercase text-sm mt-3"
          >Credits</label
        >
        <input
          type="credits"
          id="credits"
          v-model="modulesForm.credits"
          class="block border border-gray-600 rounded shadow-inner p-1"
        />
        <div v-if="modulesForm.errors.credits">
          {{ modulesForm.errors.credits }}
        </div>

        <label for="timeSlots" class="block uppercase text-sm mt-3"
          >Termine</label
        >
        <MultiSelect
          v-model="moduleTimeSlots"
          id="timeSlots"
          class="block border border-gray-600 rounded shadow-inner p-1"
          :options="timeSlots"
          track-by="id"
          placeholder="Termin auswählen..."
          :multiple="true"
          :customLabel="timeSlotLabel"
        >
        </MultiSelect>
        <div v-if="modulesForm.errors.timeSlots">
          {{ modulesForm.errors.timeSlots }}
        </div>

        <label for="prerequisites" class="block uppercase text-sm mt-3"
          >Vorausetzungen</label
        >
        <MultiSelect
          id="prerequisites"
          v-model="modulesForm.prerequisites"
          class="block border border-gray-600 rounded shadow-inner p-1"
          :options="modules"
          track-by="id"
          placeholder="Modul auswählen..."
          :multiple="true"
          label="number"
        >
        </MultiSelect>
        <div v-if="modulesForm.errors.prerequisites">
          {{ modulesForm.errors.prerequisites }}
        </div>

        <button
          type="submit"
          :disabled="modulesForm.processing"
          class="mt-3 rounded p-2 border-2 border-black font-bold"
        >
          Modul erstellen
        </button>
      </form>
      <div v-if="modules">
        <h2 class="text-lg mb-2">Module</h2>
        <ul>
          <li v-for="module in modules" :key="module.id">
            {{ module.name }}
          </li>
        </ul>
      </div>
    </div>

    <div>
      <h2 class="text-lg mb-2">Neue Regel</h2>
      <form @submit.prevent="createRule">
        <label for="type" class="block uppercase text-sm">Art</label>
        <select
          id="type"
          v-model="rulesForm.type"
          class="block border border-gray-600 rounded shadow-inner p-1"
          required
        >
          <option value="" disabled>Bitte wählen...</option>
          <option value="onePerSemester">Nur ein Modul pro Semester</option>
        </select>
        <div v-if="rulesForm.errors.type">
          {{ rulesForm.errors.type }}
        </div>
        <div v-if="rulesForm.type === 'onePerSemester'">
          <MultiSelect
            id="params"
            v-model="ruleParams"
            class="block border border-gray-600 rounded shadow-inner p-1"
            :options="modules"
            track-by="id"
            placeholder="Modul auswählen..."
            :multiple="true"
            label="number"
          >
          </MultiSelect>
        </div>
        <div v-if="rulesForm.errors.params">
          {{ rulesForm.errors.params }}
        </div>
        <button
          type="submit"
          :disabled="rulesForm.processing"
          class="mt-3 rounded p-2 border-2 border-black font-bold"
        >
          Regel erstellen
        </button>
      </form>
      <div v-if="rules">
        <h2 class="text-lg mb-2">Regeln</h2>
        <ul>
          <li v-for="rule in rules" :key="rule.id">
            {{ rule.id }} - {{ rule.type }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import MultiSelect from "vue-multiselect";
export default {
  components: {
    MultiSelect,
  },
  props: {
    planer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      categoriesForm: this.$inertia.form({
        name: null,
        requiredNumber: null,
      }),
      timeSlotsForm: this.$inertia.form({
        year: "",
        semester: "",
        week: "",
        day: "",
        time: "",
      }),
      modulesForm: this.$inertia.form({
        number: null,
        name: null,
        category: "",
        credits: null,
        timeSlots: [],
        prerequisites: [],
      }),
      rulesForm: this.$inertia.form({
        type: "",
        params: null,
      }),
    };
  },
  computed: {
    categories() {
      return this.planer.data.categories;
    },
    timeSlots() {
      return this.planer.data.timeSlots;
    },
    modules() {
      return this.planer.data.modules;
    },
    rules() {
      return this.planer.data.rules;
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
    ruleParams: {
      set(value) {
        console.log(value);
        this.rulesForm.params = { moduleIds: value.map((module) => module.id) };
      },
      get() {
        const result = this.rulesForm.params
          ? this.rulesForm.params.moduleIds.map((id) =>
              this.modules.find((module) => module.id === id)
            )
          : [];
        return result;
      },
    },
  },
  methods: {
    createCategory() {
      this.categoriesForm.post(
        `/admin/planers/${this.planer.data.slug}/categories`,
        {
          onSuccess: () => this.categoriesForm.reset(),
        }
      );
    },
    createTimeSlot() {
      this.timeSlotsForm.post(
        `/admin/planers/${this.planer.data.slug}/timeslots`,
        {
          onSuccess: () => this.timeSlotsForm.reset(),
        }
      );
    },
    createModule() {
      this.modulesForm.post(`/admin/planers/${this.planer.data.slug}/modules`, {
        onSuccess: () => this.modulesForm.reset(),
      });
    },
    createRule() {
      this.rulesForm.post(`/admin/planers/${this.planer.data.slug}/rules`, {
        onSuccess: () => this.rulesForm.reset(),
      });
    },
    timeSlotLabel(timeSlot) {
      return `${timeSlot.year}-${timeSlot.semester}-${timeSlot.week}-${timeSlot.day}-${timeSlot.time}`;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>