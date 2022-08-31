<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <PlanHeader />
    </header>
    <main class="flex-1 flex flex-col p-4">
      <h1 class="text-3xl mt-4 mb-2">Anrechnung an die Studienschwerpunkte</h1>
      <ErrorList class="mt-4 space-y-2" :errors="errors" />
      <div class="flex mt-4 gap-x-8">
        <table class="w-9/12">
          <template v-for="(module, index) in modules" :key="module.id">
            <tr
              :class="{
                'bg-gray-300': index % 2 == 0,
                'bg-gray-100': index % 2 != 0,
              }"
            >
              <td class="p-4 whitespace-nowrap w-full">
                <label :for="`credit-${module.id}`"
                  >{{ module.id }} {{ module.name }}</label
                >
              </td>
              <td class="p-4">
                <div v-if="module.requiredCredit">
                  {{ getFocusName(module.creditedAgainst) }}
                </div>
                <HfHSelect
                  v-else
                  class="w-fit"
                  :id="`credit-${module.id}`"
                  :options="focusOptions"
                  :modelValue="
                    module.creditedAgainst ? module.creditedAgainst : ''
                  "
                  @update:modelValue="
                    creditModuleAgainstFocusSelection({
                      moduleId: module.id,
                      focusSelectionId: $event,
                    })
                  "
                  emptyOptionLabel="Nicht anrechnen"
                />
              </td>
            </tr>
          </template>
        </table>
        <Checklist :entries="todoEntries" class="w-3/12" />
      </div>
    </main>
  </div>
</template>

<script>
import Checklist from "../Components/Checklist.vue";
import ErrorList from "../Components/ErrorList.vue";
import HfHButton from "../Components/HfHButton.vue";
import HfHSelect from "../Components/HfHSelect.vue";
import PlanHeader from "../Components/PlanHeader.vue";

import { mapActions, mapState } from "vuex";
export default {
  components: { Checklist, ErrorList, HfHButton, HfHSelect, PlanHeader },
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
      modules: this.creditableModulesResource.data,
      plan: this.planResource.data,
      planerSlug: this.planerSlug,
      focusSelections: this.planResource.data.focusSelections,
      rules: this.rulesResource.data,
      todos: this.todosResource.data,
    });
  },

  computed: {
    ...mapState("credit", [
      "errors",
      "modules",
      "focusSelections",
      "todoEntries",
    ]),
    focusOptions() {
      return this.focusSelections.map((focusSelection) => ({
        label: "SSP " + focusSelection.focus.name,
        value: focusSelection.id,
      }));
    },
  },

  methods: {
    ...mapActions("credit", ["init", "creditModuleAgainstFocusSelection"]),
    getFocusName(focusSelectionId) {
      console.log(focusSelectionId);
      return this.focusSelections.find(
        (focusSelection) => focusSelection.id == focusSelectionId
      ).focus.name;
    },
  },
};
</script>

<style lang="scss" scoped></style>
