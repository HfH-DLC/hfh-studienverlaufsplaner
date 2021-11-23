<template>
  <div class="min-h-screen">
    <div class="flex justify-between items-start p-4 border-b border-gray-300">
      <h1 class="text-3xl">Studienverlaufsplanner</h1>
    </div>
    <div class="flex items-start">
      <div class="w-3/12 p-4 sticky top-0">
        <ModuleList
          :categories="plan.categories"
          :selectedModuleId="plan.selectedModuleId"
          @selected="(id) => plan.toggleSelect(id)"
        />
      </div>
      <div class="w-7/12 p-4 bg-gray-50">
        <TimeTable
          :semesters="plan.semesters"
          :timeSlots="plan.timeSlots"
          @placeModule="(id) => plan.placeModule(id)"
          @selectModule="(slotId) => plan.selectSlotModule(slotId)"
        />
      </div>
      <div class="w-2/12 sticky top-0 p-4">
        <div class="mb-4 pb-4 border-b border-gray-300">
          <div class="text-sm text-gray-500 font-bold uppercase">
            Total Kreditpunkte
          </div>
          <div>{{ plan.credits }} / 90</div>
        </div>
        <ModuleInformation :selectedModule="plan.selectedModule" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import DataAdapter from "../DataAdapter";

// Components

import ModuleInformation from "../Components/ModuleInformation.vue";
import ModuleList from "../Components/ModuleList.vue";
import TimeTable from "../Components/TimeTable.vue";

export default {
  components: {
    TimeTable,
    ModuleInformation,
    ModuleList,
  },
  setup() {
    const plan = ref(new DataAdapter().getPlan());
    return {
      plan,
    };
  },
};
</script>

<style scoped>
</style>