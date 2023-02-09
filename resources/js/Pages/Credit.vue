<template>
  <AppHead :planerName="planerName" title="Anrechnung" />
  <div class="min-h-screen flex flex-col">
    <header>
      <PlanHeader
        :planerSlug="planerSlug"
        :planerName="planerName"
        :planSlug="planResource.data.slug"
        :showNavigation="true"
        :showTour="!!tour && planResource.data.scheduleValid"
        :brochureUrl="brochureUrl"
        :moduleDirectoryUrl="moduleDirectoryUrl"
      />
    </header>
    <main class="flex-1 flex flex-col px-4 pb-4">
      <ErrorList class="mt-4 space-y-2" :errors="errors" aria-live="polite" />
      <div class="flex mt-4 gap-x-8 print:block">
        <template v-if="planResource.data.scheduleValid">
          <h2 class="hfh-sr-only">Anrechnung an die Studienschwerpunkte</h2>
          <table
            class="
              w-9/12
              print:w-full
              divide-y divide-gray-300
              border border-gray-300
              text-left
              layout-fixed
            "
            id="modules"
          >
            <caption
              class="
                text-white
                py-2
                bg-gray-900
                print:bg-transparent
                print:text-black
                print:border-t
                print:border-r
                print:border-l
                print:border-gray-300
              "
            >
              Anrechnung an die Studienschwerpunkte
            </caption>
            <thead class="bg-gray-50">
              <tr class="divide-x divide-gray-300">
                <th class="px-4 py-2 text-sm text-gray-600 w-2/3">Modul</th>
                <th class="px-4 py-2 text-sm text-gray-600">Anrechnung</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-300">
              <template v-for="module in modules" :key="module.id">
                <tr class="divide-x divide-gray-300">
                  <td class="p-4">
                    <label :for="`credit-${module.id}`"
                      >{{ module.id }} {{ module.name }}</label
                    >
                  </td>
                  <td class="p-4">
                    <div v-if="module.requiredCredit">
                      SSP {{ getFocusName(module.creditedAgainst) }}
                    </div>
                    <HfhSelect
                      v-else
                      :id="`credit-${module.id}`"
                      :options="focusOptions"
                      :modelValue="
                        module.creditedAgainst
                          ? `${module.creditedAgainst}`
                          : ''
                      "
                      @update:modelValue="
                        creditModuleAgainstFocusSelection({
                          moduleId: module.id,
                          focusSelectionId: $event,
                        })
                      "
                      defaultOption="Nicht anrechnen"
                      :disabled="readOnly"
                      :class="{
                        'hfh-selected-focus-option': !!module.creditedAgainst,
                      }"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <div class="w-3/12 print:w-full print:mt-8" aria-live="polite">
            <h2 class="hfh-sr-only">Checkliste</h2>
            <p
              class="mb-8"
              v-if="
                errors.length == 0 &&
                !todoEntries.some((entry) => !entry.checked)
              "
            >
              Ihre Planung erfüllt alle Anforderungen.
            </p>
            <Checklist :entries="todoEntries" id="todos" />
          </div>
        </template>
        <p v-else>
          Bitte erfüllen sie zuerst alle Anforderungen an Ihren
          <HfhLink component="Link" href="zeitplan">Zeitplan</HfhLink>, bevor
          Sie mit der Anrechnung an die Studienschwerpunkte beginnen.
        </p>
      </div>
    </main>
    <Tour
      v-if="tour"
      :steps="tour.steps"
      :startOnMount="!tourCompleted"
      @started="startTour"
      @completed="completeTour"
    />
  </div>
</template>

<script>
import { HfhSelect, HfhLink } from "@hfh-dlc/hfh-styleguide";

import Checklist from "../Components/Checklist.vue";
import ErrorList from "../Components/ErrorList.vue";
import PlanHeader from "../Components/PlanHeader.vue";
import Tour from "../Components/Tour.vue";
import MainLayout from "../Layouts/MainLayout.vue";

import { mapActions, mapState } from "pinia";
import { useCreditStore } from "../Store/credit";
export default {
  layout: MainLayout,
  components: {
    Checklist,
    ErrorList,
    HfhSelect,
    HfhLink,
    PlanHeader,
    Tour,
  },
  props: {
    creditableModulesResource: {
      type: Object,
      required: true,
    },
    planResource: {
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
    todosResource: {
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
  created() {
    this.init({
      modules: this.creditableModulesResource.data,
      plan: this.planResource.data,
      planerSlug: this.planerSlug,
      focusSelections: this.planResource.data.focusSelections,
      todos: this.todosResource.data,
      tour: this.tourData,
    });
  },

  computed: {
    ...mapState(useCreditStore, [
      "errors",
      "modules",
      "focusSelections",
      "todoEntries",
      "tour",
      "tourCompleted",
      "readOnly",
    ]),
    focusOptions() {
      return this.focusSelections.map((focusSelection) => ({
        label: "SSP " + focusSelection.focus.name,
        value: focusSelection.id,
      }));
    },
  },

  methods: {
    ...mapActions(useCreditStore, [
      "init",
      "creditModuleAgainstFocusSelection",
      "startTour",
      "completeTour",
    ]),
    getFocusName(focusSelectionId) {
      return this.focusSelections.find(
        (focusSelection) => focusSelection.id == focusSelectionId
      ).focus.name;
    },
  },
};
</script>

<style>
:root {
  --w-container: 100%;
}
</style>

<style scoped>
table {
  page-break-inside: avoid !important;
}

:deep() .hfh-selected-focus-option select {
  font-weight: 700;
}
</style>
