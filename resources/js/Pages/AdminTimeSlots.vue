<template>
  <div class="flex-1 flex justify-between">
    <div class="w-8/12 p-4">
      <h2 class="text-xl">Termine</h2>
      <button
        class="my-4 rounded p-2 bg-gray-700 text-white hover:bg-gray-900"
        @click="showCreateForm"
      >
        Termin erstellen
      </button>
      <ul>
        <li
          v-for="timeSlot in timeSlots"
          :key="timeSlot.id"
          class="even:bg-gray-200 odd:bg-gray-100"
        >
          <div class="text-left p-2 flex justify-between items-center gap-12">
            <span
              >{{ timeSlot.semester }}{{ timeSlot.year }} {{ timeSlot.week }}
              {{ timeSlot.day }} {{ timeSlot.time }}</span
            >
            <div class="space-x-2 whitespace-nowrap">
              <button
                @click="showEditForm(timeSlot)"
                class="p-1 hover:text-blue-600"
              >
                <PencilIcon class="inline-block w-5 h-5 flex-shrink-0" />
              </button>
              <button
                @click="deleteTimeSlot(timeSlot)"
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
        <form @submit.prevent="processForm">
          <label for="year" class="block uppercase text-sm">Jahr</label>
          <input
            ref="yearInput"
            type="number"
            id="year"
            v-model="timeSlotsForm.year"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            required
            :aria-describedby="timeSlotsForm.errors.year && 'error-year'"
          />
          <Error id="error-year" class="mt-2" v-if="timeSlotsForm.errors.year">
            {{ timeSlotsForm.errors.year }}
          </Error>
          <label for="semester" class="block uppercase text-sm mt-3"
            >Semester</label
          >
          <select
            id="semester"
            v-model="timeSlotsForm.semester"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            required
            :aria-describedby="
              timeSlotsForm.errors.semester && 'error-semester'
            "
          >
            <option value="" disabled>Bitte wählen...</option>
            <option value="HS">HS</option>
            <option value="FS">FS</option>
          </select>
          <Error
            id="error-semester"
            class="mt-2"
            v-if="timeSlotsForm.errors.semester"
          >
            {{ timeSlotsForm.errors.semester }}
          </Error>

          <label for="week" class="block uppercase text-sm mt-3">Woche</label>
          <select
            id="week"
            v-model="timeSlotsForm.week"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            required
            :aria-describedby="timeSlotsForm.errors.week && 'error-week'"
          >
            <option value="" disabled>Bitte wählen...</option>
            <option value="Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13">
              Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13
            </option>
            <option value="Wo 1, 6, 10, 14">Wo 1, 6, 10, 14</option>
          </select>
          <Error id="error-week" class="mt-2" v-if="timeSlotsForm.errors.week">
            {{ timeSlotsForm.errors.week }}
          </Error>

          <label for="day" class="block uppercase text-sm mt-3">Tag</label>
          <select
            id="day"
            v-model="timeSlotsForm.day"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            required
            :aria-describedby="timeSlotsForm.errors.day && 'error-day'"
          >
            <option value="" disabled>Bitte wählen...</option>
            <option value="Montag">Montag</option>
            <option value="Donnerstag">Donnerstag</option>
          </select>
          <Error id="error-day" class="mt-2" v-if="timeSlotsForm.errors.day">
            {{ timeSlotsForm.errors.day }}
          </Error>

          <label for="time" class="block uppercase text-sm mt-3">Zeit</label>
          <select
            id="time"
            v-model="timeSlotsForm.time"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            required
            :aria-describedby="timeSlotsForm.errors.time && 'error-time'"
          >
            <option value="" disabled>Bitte wählen...</option>
            <option value="Vormittag">Vormittag</option>
            <option value="Nachmittag">Nachmittag</option>
          </select>
          <Error id="error-time" class="mt-2" v-if="timeSlotsForm.errors.time">
            {{ timeSlotsForm.errors.time }}
          </Error>

          <button
            type="submit"
            :disabled="timeSlotsForm.processing"
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
      timeSlotsForm: this.$inertia.form({
        year: "",
        semester: "",
        week: "",
        day: "",
        time: "",
      }),
      editedTimeSlot: null,
      formVisible: false,
    };
  },
  computed: {
    timeSlots() {
      return this.timeSlotsResource.data;
    },
    formTitle() {
      return this.editedTimeSlot ? "Termin bearbeiten" : "Neuer Termin";
    },
    formSubmitText() {
      return "Speichern";
    },
  },
  methods: {
    showForm() {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.yearInput.focus();
      });
    },
    showCreateForm() {
      this.editedTimeSlot = null;
      this.timeSlotsForm.reset();
      this.showForm();
    },
    showEditForm(timeSlot) {
      this.editedTimeSlot = timeSlot;
      this.timeSlotsForm.year = this.editedTimeSlot.year;
      this.timeSlotsForm.semester = this.editedTimeSlot.semester;
      this.timeSlotsForm.week = this.editedTimeSlot.week;
      this.timeSlotsForm.day = this.editedTimeSlot.day;
      this.timeSlotsForm.time = this.editedTimeSlot.time;
      this.showForm();
    },
    hideForm() {
      this.editedTimeSlot = null;
      this.timeSlotsForm.reset();
      this.formVisible = false;
    },
    processForm() {
      if (this.editedTimeSlot) {
        this.editTimeSlot();
      } else {
        this.createTimeSlot();
      }
    },
    createTimeSlot() {
      this.timeSlotsForm.post(`/admin/planers/${this.planerSlug}/timeslots`, {
        onSuccess: () => this.hideForm(),
      });
    },
    editTimeSlot() {
      this.timeSlotsForm.put(
        `/admin/planers/${this.planerSlug}/timeslots/${this.editedTimeSlot.id}`,
        {
          onSuccess: () => this.hideForm(),
        }
      );
    },
    deleteTimeSlot(timeSlot) {
      if (confirm(`Willst du die Termin ${timeSlot.name} wirklich löschen?`)) {
        this.timeSlotsForm.delete(
          `/admin/planers/${this.planerSlug}/timeslots/${timeSlot.id}`,
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