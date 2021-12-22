<template>
  <form @submit.prevent="processForm">
    <label for="year" class="block uppercase text-sm">Jahr</label>
    <input
      ref="yearInput"
      type="number"
      id="year"
      v-model="form.year"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.year && 'error-year'"
    />
    <Error id="error-year" class="mt-2" v-if="form.errors.year">
      {{ form.errors.year }}
    </Error>
    <label for="semester" class="block uppercase text-sm mt-3">Semester</label>
    <select
      id="semester"
      v-model="form.semester"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.semester && 'error-semester'"
    >
      <option value="" disabled>Bitte wählen...</option>
      <option value="HS">HS</option>
      <option value="FS">FS</option>
    </select>
    <Error id="error-semester" class="mt-2" v-if="form.errors.semester">
      {{ form.errors.semester }}
    </Error>

    <label for="week" class="block uppercase text-sm mt-3">Woche</label>
    <select
      id="week"
      v-model="form.week"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.week && 'error-week'"
    >
      <option value="" disabled>Bitte wählen...</option>
      <option value="Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13">
        Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13
      </option>
      <option value="Wo 1, 6, 10, 14">Wo 1, 6, 10, 14</option>
    </select>
    <Error id="error-week" class="mt-2" v-if="form.errors.week">
      {{ form.errors.week }}
    </Error>

    <label for="day" class="block uppercase text-sm mt-3">Tag</label>
    <select
      id="day"
      v-model="form.day"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.day && 'error-day'"
    >
      <option value="" disabled>Bitte wählen...</option>
      <option v-for="day in planerOptionsDay" :value="day" :key="day">
        {{ day }}
      </option>
    </select>
    <Error id="error-day" class="mt-2" v-if="form.errors.day">
      {{ form.errors.day }}
    </Error>

    <label for="time" class="block uppercase text-sm mt-3">Zeit</label>
    <select
      id="time"
      v-model="form.time"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.time && 'error-time'"
    >
      <option value="" disabled>Bitte wählen...</option>
      <option value="Vormittag">Vormittag</option>
      <option value="Nachmittag">Nachmittag</option>
    </select>
    <Error id="error-time" class="mt-2" v-if="form.errors.time">
      {{ form.errors.time }}
    </Error>

    <button
      type="submit"
      :disabled="form.processing"
      class="w-full mt-3 rounded p-2 bg-gray-700 text-white hover:bg-gray-900"
    >
      Speichern
    </button>
  </form>
</template>

<script>
import Error from "./Error.vue";
export default {
  emits: ["success"],
  props: {
    planerSlug: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.focusYearInput();
  },
  data() {
    return {
      form: this.$inertia.form({
        year: "",
        semester: "",
        week: "",
        day: "",
        time: "",
      }),
    };
  },
  components: {
    Error,
  },
  props: {
    editedTimeSlot: {
      type: Object,
      default: null,
    },
    planerSlug: {
      type: String,
      required: true,
    },
    planerOptionsDay: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.setTimeSlot(this.editedTimeSlot);
  },
  methods: {
    setTimeSlot() {
      this.form.reset();
      if (this.editedTimeSlot) {
        this.form.year = this.editedTimeSlot.year;
        this.form.semester = this.editedTimeSlot.semester;
        this.form.week = this.editedTimeSlot.week;
        this.form.day = this.editedTimeSlot.day;
        this.form.time = this.editedTimeSlot.time;
      }
      this.focusYearInput();
    },
    focusYearInput() {
      this.$nextTick(() => {
        this.$refs.yearInput.focus();
      });
    },
    processForm() {
      if (this.editedTimeSlot) {
        this.editTimeSlot();
      } else {
        this.createTimeSlot();
      }
    },
    createTimeSlot() {
      this.form.post(`/admin/planers/${this.planerSlug}/timeslots`, {
        onSuccess: () => this.$emit("success"),
      });
    },
    editTimeSlot() {
      this.form.put(
        `/admin/planers/${this.planerSlug}/timeslots/${this.editedTimeSlot.id}`,
        {
          onSuccess: () => this.$emit("success"),
        }
      );
    },
  },
  watch: {
    editedTimeSlot(newValue, oldValue) {
      this.setTimeSlot(newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>