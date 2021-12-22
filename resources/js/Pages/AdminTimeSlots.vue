<template>
  <div class="flex-1 flex justify-between">
    <div class="w-8/12 p-4">
      <h2 class="text-xl">Termine</h2>
      <div class="flex items-center gap-4">
        <button
          class="my-4 rounded p-2 bg-gray-700 text-white hover:bg-gray-900"
          @click="showGenerateForm"
        >
          Termine generieren
        </button>
        <button
          class="my-4 rounded p-2 bg-gray-700 text-white hover:bg-gray-900"
          @click="showCreateForm"
        >
          Einzelnen Termin erstellen
        </button>
      </div>

      <ul>
        <li
          v-for="timeSlot in timeSlots"
          :key="timeSlot.id"
          class="even:bg-gray-200 odd:bg-gray-100"
        >
          <div class="text-left p-2 flex justify-between items-center gap-12">
            <span
              >{{ timeSlot.semester }} {{ timeSlot.year }} {{ timeSlot.week }}
              {{ timeSlot.day }} {{ timeSlot.time }}</span
            >
            <div class="space-x-2 whitespace-nowrap">
              <button
                @click="showEditForm(timeSlot)"
                class="p-1 focus:text-blue-600 hover:text-blue-600"
              >
                <PencilIcon class="inline-block w-5 h-5 flex-shrink-0" />
              </button>
              <button
                @click="deleteTimeSlot(timeSlot)"
                class="p-1 focus:text-red-600 hover:text-red-600"
              >
                <TrashIcon class="inline-block w-5 h-5 flex-shrink-0" />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="w-4/12 border-l border-gray-300" v-if="action">
      <div class="bg-gray-700 flex justify-end items-center">
        <button class="text-3xl p-2 text-white" @click="hideForm">
          <XIcon class="w-6 h-6" />
        </button>
      </div>
      <div class="p-4">
        <h2 class="text-lg whitespace-nowrap">{{ formTitle }}</h2>
        <TimeSlotsForm
          :planerSlug="planerSlug"
          :planerOptionsDay="planerOptionsDay"
          v-if="action === 'create' || action === 'edit'"
          @success="hideForm"
          :editedTimeSlot="editedTimeSlot"
        />
        <TimeSlotsGenerateForm
          :planerSlug="planerSlug"
          v-if="action === 'generate'"
          @success="hideForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { PencilIcon, TrashIcon, XIcon } from "@heroicons/vue/outline";
import AdminPlanerLayout from "../Layouts/AdminPlanerLayout.vue";
import TimeSlotsForm from "../Components/TimeSlotsForm.vue";
import TimeSlotsGenerateForm from "../Components/TimeSlotsGenerateForm.vue";
export default {
  layout: AdminPlanerLayout,
  components: {
    PencilIcon,
    TimeSlotsForm,
    TimeSlotsGenerateForm,
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
    planerOptionsDay: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      action: null,
      editedTimeSlot: null,
    };
  },
  computed: {
    timeSlots() {
      return this.timeSlotsResource.data;
    },
    formTitle() {
      switch (this.action) {
        case "create":
          return "Neuer Termin";
        case "edit":
          return "Termin bearbeiten";
        case "generate":
          return "Termine generieren";
      }
    },
  },
  methods: {
    showCreateForm() {
      this.editedTimeSlot = null;
      this.action = "create";
    },
    showEditForm(timeSlot) {
      this.editedTimeSlot = timeSlot;
      this.action = "edit";
    },
    showGenerateForm() {
      this.editedTimeSlot = null;
      this.action = "generate";
    },
    hideForm() {
      this.editedTimeSlot = null;
      this.action = null;
    },
    deleteTimeSlot(timeSlot) {
      if (confirm(`Willst du die Termin ${timeSlot.name} wirklich löschen?`)) {
        this.$inertia.delete(
          `/admin/planers/${this.planerSlug}/timeslots/${timeSlot.id}`
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>