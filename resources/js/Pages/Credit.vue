<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <PlanHeader />
    </header>
    <main class="flex-1 flex flex-col p-4">
      <h1 class="text-3xl mt-4 mb-2">Anrechnung an die Studienschwerpunkte</h1>
      <ErrorList class="mt-4 space-y-2" :errors="errors" />
      <div class="mt-4 grid grid-cols-[1fr,auto] gap-y-4">
        <template v-for="module in modules" :key="module.id">
          <div>
            <label :for="`credit-${module.id}`"
              >{{ module.id }} {{ module.name }}</label
            >
          </div>
          <HfHSelect
            :id="`credit-${module.id}`"
            :options="focusOptions"
            :modelValue="module.creditedAgainst ? module.creditedAgainst : ''"
            @update:modelValue="
              creditModuleAgainstFocusSelection({
                moduleId: module.id,
                focusSelectionId: $event,
              })
            "
            emptyOptionLabel="Nicht anrechnen"
          />
        </template>
      </div>
    </main>
  </div>
</template>

<script>
import ErrorList from "../Components/ErrorList.vue";
import HfHButton from "../Components/HfHButton.vue";
import HfHSelect from "../Components/HfHSelect.vue";
import PlanHeader from "../Components/PlanHeader.vue";

import { mapActions, mapState } from "vuex";
export default {
  components: { ErrorList, HfHButton, HfHSelect, PlanHeader },
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
  },
  created() {
    this.init({
      modules: this.creditableModulesResource.data,
      plan: this.planResource.data,
      planerSlug: this.planerSlug,
      focusSelections: this.planResource.data.focusSelections,
      rules: this.rulesResource.data,
    });
  },

  computed: {
    ...mapState("credit", ["errors", "modules", "focusSelections"]),
    focusOptions() {
      return this.focusSelections.map((focusSelection) => ({
        label: "SSP " + focusSelection.focus.name,
        value: focusSelection.id,
      }));
    },
  },

  methods: {
    ...mapActions("credit", ["init", "creditModuleAgainstFocusSelection"]),
  },
};
</script>

<style lang="scss" scoped></style>
