<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <PlanHeader />
    </header>
    <main class="flex-1 flex flex-col">
      <Flash class="fixed top-4 left-1/2 -translate-x-1/2" />
      <template v-if="initialized">
        <div>
          <div
            class="p-4 border-b border-gray-300"
            role="alert"
            v-if="errors.length > 0"
          >
            <ErrorList class="space-y-2" :errors="errors" />
          </div>
          <FocusSelection v-if="focusSelectionEnabled" class="p-4" />
          <div class="flex flex-1 items-start">
            <StickyColumn id="module-list" class="w-3/12">
              <ModuleInformation
                v-show="selectedModule"
                :selectedModule="
                  tourActive ? tourSelectedModule : selectedModule
                "
              />
              <ModuleList v-show="!selectedModule" />
            </StickyColumn>
            <StickyColumn id="time-table" class="w-6/12">
              <TimeTable ref="timeTable" />
            </StickyColumn>
            <StickyColumn id="info-column" class="w-3/12" aria-live="polite">
              <Checklist :entries="todoEntries" />
            </StickyColumn>
          </div>
        </div>
        <Tour :startOnMount="!tourCompleted" @completed="completeTour" />
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

export default {
  components: {
    CheckCircleIcon,
    Checklist,
    ErrorList,
    Flash,
    FocusSelection,
    TimeTable,
    ModuleInformation,
    ModuleList,
    Tour,
    PlanHeader,
    StickyColumn,
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
  },
  created() {
    this.init({
      categories: this.categoriesResource.data,
      plan: this.planResource.data,
      planerSlug: this.planerSlug,
      rules: this.rulesResource.data,
      todos: this.todosResource.data,
      foci: this.fociResource.data,
      requiredECTS: this.requiredECTS,
    });
    this.$emitter.on("retry-save", this.retrySave);
  },
  beforeDestroy() {
    this.$emitter.off("retry-save", this.retrySave);
  },
  mounted() {
    this.selectModuleFromHash(window.location.hash);
    window.onhashchange = (event) => {
      this.selectModuleFromHash(new URL(event.newURL).hash);
    };
  },
  beforeUnmount() {
    window.onhashchange = null;
  },
  computed: {
    ...mapState("schedule", [
      "initialized",
      "flash",
      "tourCompleted",
      "tourActive",
      "tourSelectedModule",
      "todoEntries",
    ]),
    ...mapGetters("schedule", ["ects", "placementErrors", "selectedModule"]),
    errors() {
      return this.placementErrors.map((error) => error.text);
    },
  },
  methods: {
    ...mapActions("schedule", ["init", "completeTour", "save", "selectModule"]),
    async retrySave() {
      if (await this.save()) {
        this.$emitter.emit("flash", {
          type: flashTypes.SUCCESS,
          message: "Ihr Plan wurde erfolgreich gespeichert.",
        });
      }
    },
    selectModuleFromHash(hash) {
      if (hash && hash.startsWith("#module-")) {
        const moduleId = hash.slice("#module-".length);
        this.selectModule(moduleId);
      }
    },
  },
};
</script>

<style scoped>
</style>
