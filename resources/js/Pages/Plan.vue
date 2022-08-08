<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <PlanHeader />
    </header>
    <main class="flex-1 flex flex-col">
      <Flash class="fixed top-4 left-1/2 -translate-x-1/2" />
      <template v-if="initialized">
        <div>
          <div class="mb-4 p-4" role="alert" v-if="errors.length > 0">
            <ul class="space-y-2">
              <ErrorList :errors="errors" />
            </ul>
          </div>
          <div class="flex flex-1 items-start">
            <div id="module-list" class="w-3/12 p-4 sticky top-0">
              <ModuleList />
            </div>
            <div id="time-table" class="w-7/12 p-4 sticky top-0">
              <TimeTable ref="timeTable" />
            </div>
            <div
              id="info-column"
              class="w-2/12 py-4 sticky top-0"
              aria-live="polite"
            >
              <div id="total-credits" class="px-4">
                <div class="border-b border-gray-300 pb-4">
                  <h2 class="text-sm text-gray-500 font-bold uppercase">
                    Total Kreditpunkte
                  </h2>
                  <div class="flex items-center gap-2">
                    {{ credits }} / {{ requiredCredits }}
                    <CheckCircleIcon
                      v-if="credits === requiredCredits"
                      class="text-green-700 w-5 h-5"
                    />
                  </div>
                </div>
              </div>
              <div id="module-information" class="p-4 min-h-16">
                <ModuleInformation
                  :selectedModule="
                    tourActive ? tourSelectedModule : selectedModule
                  "
                />
              </div>
            </div>
          </div>
        </div>
        <Tour :startOnMount="!plan.tourCompleted" @completed="completeTour" />
      </template>
      <div v-else class="text-2xl text-center p-4 flex-1">
        Plan wird geladen...
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
// Components
import { CheckCircleIcon } from "@heroicons/vue/outline";
import ErrorList from "../Components/ErrorList.vue";
import ModuleInformation from "../Components/ModuleInformation.vue";
import ModuleList from "../Components/ModuleList.vue";
import TimeTable from "../Components/TimeTable.vue";
import Tour from "../Components/Tour.vue";
import PlanHeader from "../Components/PlanHeader.vue";
import Flash from "../Components/Flash.vue";
import flashTypes from "../flashTypes";

export default {
  components: {
    CheckCircleIcon,
    ErrorList,
    Flash,
    TimeTable,
    ModuleInformation,
    ModuleList,
    Tour,
    PlanHeader,
  },
  props: {
    categoriesResource: {
      type: Object,
      required: true,
    },
    rulesResource: {
      type: Object,
      required: true,
    },
    planResource: {
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
  },
  async created() {
    await this.init({
      categories: this.categoriesResource.data,
      rules: this.rulesResource.data,
      plan: this.planResource.data,
      planerSlug: this.planerSlug,
    });
    this.$emitter.on("retry-save", this.retrySave);
  },
  beforeDestroy() {
    this.$emitter.off("retry-save", this.retrySave);
  },
  computed: {
    ...mapState([
      "initialized",
      "flash",
      "plan",
      "tourActive",
      "tourSelectedModule",
    ]),
    ...mapGetters(["credits", "placementErrors", "selectedModule"]),
    errors() {
      return this.placementErrors.map((error) => error.text);
    },
  },
  methods: {
    ...mapActions(["init", "completeTour", "save"]),
    async retrySave() {
      if (await this.save()) {
        this.$emitter.emit("flash", {
          type: flashTypes.SUCCESS,
          message: "Ihr Plan wurde erfolgreich gespeichert.",
        });
      }
    },
  },
};
</script>

<style scoped>
#module-list,
#time-table,
#info-column {
  height: calc(100vh - 89px);
  overflow: auto;
}
</style>