<template>
  <div class="flex">
    <div class="w-2/12 p-4">
      <div v-for="category in plan.categories" :key="category" class="mb-4">
        <h2 class="text-lg">
          {{ category.name }} ({{ category.placedNumber }} /
          {{ category.requiredNumber }})
        </h2>
        <ul>
          <li v-for="module in category.modules" :key="module.id">
            <button
              @click="toggleSelection(module)"
              class="text-left disabled:cursor-default mb-2"
              :disabled="
                !plan.hasFreeSlots() ||
                category.placedNumber === category.requiredNumber ||
                (module.errors && module.errors.length > 0)
              "
              :class="{
                'module--selected': module.id == selectedModuleId,
                'module--disabled':
                  !plan.hasFreeSlots() ||
                  category.placedNumber === category.requiredNumber ||
                  (module.errors && module.errors.length > 0),
              }"
            >
              {{ module.id }} | {{ module.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="w-8/12 p-4 bg-gray-100">
      <ul>
        <li v-for="timeSlot in plan.timeSlots" :key="timeSlot.id">
          <TimeSlot
            :timeSlot="timeSlot"
            @click="placeModule(timeSlot)"
            :disabled="
              !selectedModuleId ||
              timeSlot.module ||
              (selectionErrors[timeSlot.id] &&
                selectionErrors[timeSlot.id].length > 0)
            "
          />
        </li>
      </ul>
    </div>
    <div class="w-2/12 p-4">Total Credits: {{ plan.credits }}</div>
  </div>
</template>

<script>
import { ref } from "vue";
import Plan from "../Models/Plan";
import Category from "../Models/Category";
import Module from "../Models/Module";
import TimeSlotModel from "../Models/TimeSlot";
import PrerequisiteRule from "../Models/Rules/PrerequisiteRule";
import OnePerSemesterRule from "../Models/Rules/OnePerSemesterRule";

import TimeSlot from "../Components/TimeSlot.vue";

export default {
  components: {
    TimeSlot,
  },
  setup() {
    const categories = [
      new Category("Pflichtbereich HFE", [
        new Module("P1_01", "Grundfragen der Heilpädagogik", 5),
        new Module("P1_03", "Heilpädagogik im Vorschulbereich", 5),
        new Module(
          "P4_02",
          "Grundlagen der Heilpädagogischen Früherziehung",
          5
        ),
        new Module(
          "P4_06",
          "Diagnostik und Früherfassung in der Heilpädagogischen Früherziehung",
          5
        ),
        new Module(
          "P4_07",
          "Entwicklungsorientierte Intervention in der Heilpädagogischen Früherziehung",
          5
        ),
        new Module(
          "P4_08",
          "Beratung und Begleitung von Eltern und weiteren Bezugs- und Fachpersonen in der Heilpädagogischen Früherziehung",
          5
        ),
        new Module(
          "P4_09",
          "Interdisziplinarität und Kooperation im Kontext der Heilpädagogischen Früherziehung",
          5
        ),
      ]),
      new Category("Berufspraxis HFE", [
        new Module("BP5_01.1.HFE", "Berufspraxis I & Portfolio", 5),
        new Module("BP5_01.2.HFE", "Berufspraxis II & Portfolio", 5),
        new Module("BP5_01.3.HFE", "Berufspraxis III & Portfolio", 10),
      ]),
      new Category(
        "Wahlpflichtbereich HFE",
        [
          new Module("WP2_04.1", "Heilpädagogik im Bereich Hören I", 5),
          new Module("WP2_04.2", "Heilpädagogik im Bereich Hören II", 5),
          new Module("WP2_05.1", "Heilpädagogik im Bereich Sehen I", 5),
          new Module(
            "WP2_06.1",
            "Heilpädagogik im Bereich körperlich-motorische Entwicklung. Motorische Beeinträchtigungen",
            5
          ),
          new Module(
            "WP2_06.2",
            "Heilpädagogik im Bereich körperlich-motorische Entwicklung. Chronische Erkrankungen",
            5
          ),
          new Module("WP2_07", "Schwere mehrfache Beeinträchtigungen", 5),
          new Module(
            "WP2_11",
            "Autismus im Kontext der Heilpädagogischen Früherziehung",
            5
          ),
        ],
        3
      ),
      new Category("Masterarbeit HFE", [
        new Module("M5_03", "Masterarbeit", 20),
      ]),
    ];

    const timeSlots = [
      new TimeSlotModel("Slot 1", "HS21"),
      new TimeSlotModel("Slot 2", "HS21"),
      new TimeSlotModel("Slot 3", "FS22"),
      new TimeSlotModel("Slot 4", "FS22"),
      new TimeSlotModel("Slot 5", "HS22"),
      new TimeSlotModel("Slot 6", "HS22"),
    ];

    const rules = [
      new PrerequisiteRule("P4_07", ["P4_02"]),
      new PrerequisiteRule("P4_08", ["P4_02"]),
      new PrerequisiteRule("BP5_01.2.HFE", ["BP5_01.1.HFE"]),
      new PrerequisiteRule("BP5_01.3.HFE", ["BP5_01.1.HFE", "BP5_01.2.HFE"]),
      new OnePerSemesterRule(["BP5_01.1.HFE", "BP5_01.2.HFE", "BP5_01.3.HFE"]),
      new PrerequisiteRule("WP2_04.2", ["WP2_04.1"]),
    ];

    const plan = ref(new Plan(categories, timeSlots, rules));

    const selectedModuleId = ref(null);
    const selectionErrors = ref({});

    const toggleSelection = (module) => {
      if (module) {
        if (selectedModuleId.value == module.id) {
          selectedModuleId.value = null;
        } else {
          selectedModuleId.value = module.id;
        }
      } else {
        selectedModuleId.value = null;
      }
      selectionErrors.value = plan.value.validateSelection(module.id);
    };

    const placeModule = (slot) => {
      plan.value.placeModule(slot.id, selectedModuleId.value);
      selectionErrors.value = {};
      selectedModuleId.value = null;
    };

    return {
      plan,
      selectedModuleId,
      toggleSelection,
      placeModule,
      selectionErrors,
    };
  },
};
</script>

<style scoped>
.module--selected {
  color: green;
}

.module--disabled {
  color: gray;
}
</style>