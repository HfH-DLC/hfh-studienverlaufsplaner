<template>
  <div>
    <div v-for="category in plan.categories" :key="category">
      {{ category.name }} ({{ category.placedNumber }} /
      {{ category.requiredNumber }})
      <ul>
        <li
          v-for="module in category.modules"
          :key="module.id"
          @click="
            plan.hasFreeSlots() &&
              !(
                category.placedNumber === category.requiredNumber ||
                (module.errors && module.errors.length > 0)
              ) &&
              toggleSelection(module)
          "
          class="module"
          :class="{
            'module--selected': module.id == selectedModuleId,
            'module--disabled':
              !plan.hasFreeSlots() ||
              category.placedNumber === category.requiredNumber ||
              (module.errors && module.errors.length > 0),
          }"
        >
          {{ module.id }} | {{ module.name }}
        </li>
      </ul>
    </div>
    <hr />
    <div>
      <ul>
        <li
          v-for="slot in plan.timeSlots"
          :key="slot.id"
          @click="
            selectedModuleId &&
              !slot.module &&
              !(
                selectionErrors[slot.id] && selectionErrors[slot.id].length > 0
              ) &&
              placeModule(slot)
          "
          class="slot"
          :class="{
            'slot--disabled':
              selectionErrors[slot.id] && selectionErrors[slot.id].length > 0,
            'slot--invalid': slot.errors && slot.errors.length > 0,
          }"
        >
          <span>{{ slot.id }} | {{ slot.semester }}:</span>
          <span v-if="slot.module">
            {{ slot.module.id }} | {{ slot.module.name }}
          </span>
        </li>
      </ul>
    </div>
    <hr />
    <div>Total Credits: {{ plan.credits }}</div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Plan from "../Models/Plan";
import Category from "../Models/Category";
import Module from "../Models/Module";
import TimeSlot from "../Models/TimeSlot";
import PrerequisiteRule from "../Models/Rules/PrerequisiteRule";
import OnePerSemesterRule from "../Models/Rules/OnePerSemesterRule";

export default defineComponent({
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
      new TimeSlot("Slot 1", "HS21"),
      new TimeSlot("Slot 2", "HS21"),
      new TimeSlot("Slot 3", "FS22"),
      new TimeSlot("Slot 4", "FS22"),
      new TimeSlot("Slot 5", "HS22"),
      new TimeSlot("Slot 6", "HS22"),
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
});
</script>

<style scoped>
.module--selected {
  color: green;
}

.module--disabled {
  color: gray;
}

.slot--disabled {
  color: gray;
}

.slot--invalid {
  color: red;
}
</style>