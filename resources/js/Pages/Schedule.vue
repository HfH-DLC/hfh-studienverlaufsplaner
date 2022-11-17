<template>
  <AppHead :planerName="planerName" title="Zeitplan" />
  <div class="min-h-screen flex flex-col">
    <header>
      <PlanHeader
        :planerSlug="planerSlug"
        :planerName="planerName"
        :planSlug="planResource.data.slug"
        :showNavigation="focusSelectionEnabled"
        :showTour="!!tour"
        :brochureUrl="brochureUrl"
        :moduleDirectoryUrl="moduleDirectoryUrl"
      />
    </header>
    <main class="flex-1 flex flex-col">
      <Flash class="fixed top-4 left-1/2 -translate-x-1/2" />
      <template v-if="initialized">
        <div>
          <div
            class="p-4 border-b border-gray-300 space-y-4"
            role="alert"
            v-if="errors.length > 0 || infos.length > 0"
          >
            <InfoList
              class="space-y-2"
              v-if="infos.length > 0"
              :infos="infos"
              aria-live="polite"
            />
            <ErrorList
              class="space-y-2"
              v-if="errors.length > 0"
              :errors="errors"
              aria-live="polite"
            />
          </div>
          <FocusSelection
            v-if="focusSelectionEnabled"
            id="focus-selection"
            class="px-4 py-8"
          />
          <div class="flex flex-1 items-start print:block">
            <StickyColumn id="modules" class="w-3/12 print:hidden pb-24">
              <ModuleInformation
                v-show="selectedOrTourModule"
                :selectedModule="selectedOrTourModule"
              />
              <div v-show="!selectedOrTourModule">
                <LocationSelect
                  v-if="selectableLocations.length > 1"
                  class="mb-4"
                />
                <ModuleList
                  :hashModuleId="hashModuleId"
                  :hashCategoryId="hashCategoryId"
                />
              </div>
            </StickyColumn>
            <StickyColumn
              id="time-table"
              class="w-6/12 print:w-full lg:mx-0 xl:mx-8 pb-24 print:pb-4"
            >
              <TimeTable ref="timeTable" />
            </StickyColumn>
            <StickyColumn
              id="todos"
              class="w-3/12 print:w-full pb-24 print:pb-4"
              aria-live="polite"
            >
              <p
                v-if="
                  errors.length == 0 &&
                  !todoEntries.some((entry) => !entry.checked)
                "
                class="mb-8"
              >
                Ihre Planung erfüllt alle Anforderungen.
                <HfhLink
                  v-if="focusSelectionEnabled"
                  href="anrechnung"
                  component="Link"
                  >Weiter zur Anrechnung.</HfhLink
                >
              </p>
              <Checklist :entries="todoEntries" />
            </StickyColumn>
          </div>
        </div>
        <Tour
          v-if="tour"
          :steps="tour.steps"
          :startOnMount="!tourCompleted"
          @started="startTour"
          @completed="completeTour"
        />
      </template>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
// Components
import { CheckCircleIcon } from "@heroicons/vue/outline";
import ErrorList from "../Components/ErrorList.vue";
import InfoList from "../Components/InfoList.vue";
import FocusSelection from "../Components/FocusSelection.vue";
import ModuleInformation from "../Components/ModuleInformation.vue";
import ModuleList from "../Components/ModuleList.vue";
import TimeTable from "../Components/TimeTable.vue";
import Tour from "../Components/Tour.vue";
import PlanHeader from "../Components/PlanHeader.vue";
import Flash from "../Components/Flash.vue";
import flashTypes from "../flashTypes";
import StickyColumn from "../Components/StickyColumn.vue";
import Checklist from "../Components/Checklist.vue";
import LocationSelect from "../Components/LocationSelect.vue";
import MainLayout from "../Layouts/MainLayout.vue";
import { HfhLink } from "@hfh-dlc/hfh-styleguide";

export default {
  layout: MainLayout,
  components: {
    CheckCircleIcon,
    Checklist,
    ErrorList,
    InfoList,
    Flash,
    FocusSelection,
    TimeTable,
    ModuleInformation,
    ModuleList,
    Tour,
    PlanHeader,
    StickyColumn,
    HfhLink,
    LocationSelect,
  },
  props: {
    categoriesResource: {
      type: Object,
      required: true,
    },
    focusSelectionEnabled: {
      type: Boolean,
      required: true,
    },
    fociResource: {
      type: Object,
      required: true,
    },
    planerSlug: {
      type: String,
      required: true,
    },
    planerName: {
      type: String,
      required: true,
    },
    planResource: {
      type: Object,
      required: true,
    },
    requiredECTS: {
      type: Number,
      required: true,
    },
    rulesResource: {
      type: Object,
      required: true,
    },
    todosResource: {
      type: Object,
      required: true,
    },
    locationsResource: {
      type: Object,
      required: true,
    },
    tourData: {
      type: Object,
      required: true,
    },
    brochureUrl: {
      type: String,
      required: true,
    },
    moduleDirectoryUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hashModuleId: null,
      hashCategoryId: null,
      readOnly: true,
    };
  },
  created() {
    this.init({
      categories: this.categoriesResource.data,
      plan: this.planResource.data,
      planerSlug: this.planerSlug,
      rules: this.rulesResource.data,
      todos: this.todosResource.data,
      foci: this.fociResource.data,
      locations: this.locationsResource.data,
      requiredECTS: this.requiredECTS,
      tour: this.tourData,
    });
    this.$emitter.on("retry-save", this.retrySave);
    this.$emitter.on("focus-module", this.selectModule);
  },
  beforeDestroy() {
    this.$emitter.off("retry-save", this.retrySave);
    this.$emitter.off("focus-module", this.selectModule);
  },
  computed: {
    ...mapState("schedule", [
      "initialized",
      "flash",
      "tour",
      "tourCompleted",
      "tourActive",
      "tourSelectedModule",
      "todoEntries",
    ]),
    ...mapGetters("schedule", [
      "ects",
      "placementErrors",
      "infos",
      "selectedModule",
      "selectableLocations",
    ]),
    errors() {
      return this.placementErrors.map((error) => error.text);
    },
    selectedOrTourModule() {
      return this.tourActive ? this.tourSelectedModule : this.selectedModule;
    },
  },
  methods: {
    ...mapActions("schedule", [
      "init",
      "startTour",
      "completeTour",
      "save",
      "selectModule",
    ]),
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

<style>
:root {
  --w-container: 100%;
}
</style>
