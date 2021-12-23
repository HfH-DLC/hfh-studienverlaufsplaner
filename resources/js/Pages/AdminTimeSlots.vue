<template>
  <div class="flex-1 flex justify-between">
    <div class="w-8/12 p-4">
      <h2 class="text-xl">Termine</h2>
      <div class="flex items-center gap-4">
        <Button class="my-4" @click="showGenerateForm">
          Termine generieren
        </Button>
        <Button class="my-4" @click="showCreateForm">
          Einzelnen Termin erstellen
        </Button>
      </div>

      <EntityList
        :entities="timeSlots"
        @edit="showEditForm"
        @delete="deleteTimeSlot"
      >
        <template v-slot:label="slotProps">
          {{ getLabel(slotProps.entity) }}
        </template>
      </EntityList>
    </div>

    <Sidebar v-if="action" :title="formTitle" @close="hideForm" class="w-4/12">
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
    </Sidebar>
  </div>
</template>

<script>
import AdminPlanerLayout from "../Layouts/AdminPlanerLayout.vue";
import TimeSlotsForm from "../Components/TimeSlotsForm.vue";
import TimeSlotsGenerateForm from "../Components/TimeSlotsGenerateForm.vue";
import Button from "../Components/Button.vue";
import EntityList from "../Components/EntityList.vue";
import Sidebar from "../Components/Sidebar.vue";
export default {
  layout: AdminPlanerLayout,
  components: {
    Button,
    EntityList,
    Sidebar,
    TimeSlotsForm,
    TimeSlotsGenerateForm,
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
      if (
        confirm(
          `Willst du den Termin "${this.getLabel(timeSlot)}" wirklich löschen?`
        )
      ) {
        this.$inertia.delete(
          `/admin/planers/${this.planerSlug}/timeslots/${timeSlot.id}`
        );
      }
    },
    getLabel(timeSlot) {
      return `${timeSlot.semester} ${timeSlot.year} ${timeSlot.week} ${timeSlot.day} ${timeSlot.time}`;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>