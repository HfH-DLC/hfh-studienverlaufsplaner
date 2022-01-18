<template>
  <template v-if="initialized">
    <div class="mb-4 p-4" role="alert" v-if="timeSlotErrors.length > 0">
      <ul class="space-y-2">
        <ErrorList :errors="errors" />
      </ul>
    </div>
    <div class="flex flex-1">
      <div class="w-3/12 p-4 sticky top-0">
        <ModuleList />
      </div>
      <div class="w-7/12 p-4">
        <TimeTable ref="timeTable" />
      </div>
      <div class="w-2/12 sticky top-0 p-4" aria-live="polite">
        <div class="mb-4 pb-4 border-b border-gray-300">
          <h2 class="text-sm text-gray-500 font-bold uppercase">
            Total Kreditpunkte
          </h2>
          <div class="flex items-center gap-2">
            {{ credits }} / {{ requiredCredits }}
            <CheckCircleIcon
              v-if="credits === requiredCredits"
              class="text-green-600 w-5 h-5"
            />
          </div>
        </div>
        <ModuleInformation />
      </div>
    </div>
  </template>
  <div v-else class="text-2xl text-center p-4 flex-1">Loading...</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

// Components
import ErrorList from "../Components/ErrorList.vue";
import ModuleInformation from "../Components/ModuleInformation.vue";
import ModuleList from "../Components/ModuleList.vue";
import TimeTable from "../Components/TimeTable.vue";
import { CheckCircleIcon } from "@heroicons/vue/outline";

export default {
  components: {
    CheckCircleIcon,
    ErrorList,
    TimeTable,
    ModuleInformation,
    ModuleList,
  },
  props: {
    categories: {
      type: Object,
      required: true,
    },
    timeSlots: {
      type: Object,
      required: true,
    },
    modules: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    plan: {
      type: Object,
      required: true,
    },
    requiredCredits: {
      type: Number,
      required: true,
    },
    planerSlug: {
      type: String,
      required: true,
    },
    optionsWeek: {
      type: Array,
      required: true,
    },
    optionsDay: {
      type: Array,
      required: true,
    },
    optionsTime: {
      type: Array,
      required: true,
    },
  },
  async created() {
    await this.init({
      categories: this.categories.data,
      modules: this.modules.data,
      timeSlots: this.timeSlots.data,
      rules: this.rules.data,
      plan: this.plan.data,
      planerSlug: this.planerSlug,
      optionsWeek: this.optionsWeek,
      optionsDay: this.optionsDay,
      optionsTime: this.optionsTime,
    });
  },
  computed: {
    ...mapState(["initialized"]),
    ...mapGetters(["credits", "timeSlotErrors"]),
    errors() {
      return this.timeSlotErrors.map((error) => error.text);
    },
  },
  methods: {
    ...mapActions(["init"]),
  },
};
</script>

<style scoped>
</style>