<template>
  <div>
    <div v-for="[category, modules] in categories" :key="category">
      {{ category }}
      <ul>
        <li
          v-for="module in modules"
          :key="module.id"
          @click="
            !(module.errors && module.errors.length > 0) &&
              toggleSelection(module)
          "
          class="module"
          :class="{
            'module--disabled': module.errors && module.errors.length > 0,
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
import { computed, defineComponent, ref } from "vue";
import Plan from "../Models/Plan";
import Module from "../Models/Module";
import TimeSlot from "../Models/TimeSlot";
import PrerequisiteRule from "../Models/Rules/PrerequisiteRule";
import OnePerSemesterRule from "../Models/Rules/OnePerSemesterRule";

export default defineComponent({
  setup() {
    const plan = ref(
      new Plan(
        [
          new Module(
            "P1_01",
            "Grundfragen der Heilpädagogik",
            5,
            "Pflichtmodule"
          ),
          new Module(
            "P1_03",
            "Heilpädagogik im Vorschulbereich",
            5,
            "Pflichtmodule"
          ),
          new Module(
            "P4_02",
            "Grundlagen der Heilpädagogischen Früherziehung",
            5,
            "Pflichtmodule"
          ),
          new Module(
            "P4_06",
            "Diagnostik und Früherfassung in der Heilpädagogischen Früherziehung",
            5,
            "Pflichtmodule"
          ),
          new Module(
            "P4_07",
            "Entwicklungsorientierte Intervention in der Heilpädagogischen Früherziehung",
            5,
            "Pflichtmodule"
          ),
          new Module(
            "P4_08",
            "Beratung und Begleitung von Eltern und weiteren Bezugs- und Fachpersonen in der Heilpädagogischen Früherziehung",
            5,
            "Pflichtmodule"
          ),
          new Module(
            "P4_09",
            "Interdisziplinarität und Kooperation im Kontext der Heilpädagogischen Früherziehung",
            5,
            "Pflichtmodule"
          ),
          new Module(
            "BP5_01.1.HFE",
            "Berufspraxis I & Portfolio",
            5,
            "Berufspraxis & Portfolio"
          ),
          new Module(
            "BP5_01.2.HFE",
            "Berufspraxis II & Portfolio",
            5,
            "Berufspraxis & Portfolio"
          ),
          new Module(
            "BP5_01.3.HFE",
            "Berufspraxis III & Portfolio",
            10,
            "Berufspraxis & Portfolio"
          ),
        ],
        [
          new TimeSlot("Slot 1", "HS21"),
          new TimeSlot("Slot 2", "HS21"),
          new TimeSlot("Slot 3", "FS22"),
          new TimeSlot("Slot 4", "FS22"),
          new TimeSlot("Slot 5", "HS22"),
          new TimeSlot("Slot 6", "HS22"),
        ],
        [
          new PrerequisiteRule("P4_07", ["P4_02"]),
          new PrerequisiteRule("P4_08", ["P4_02"]),
          new PrerequisiteRule("BP5_01.2.HFE", ["BP5_01.1.HFE"]),
          new PrerequisiteRule("BP5_01.3.HFE", [
            "BP5_01.1.HFE",
            "BP5_01.2.HFE",
          ]),
          new OnePerSemesterRule([
            "BP5_01.1.HFE",
            "BP5_01.2.HFE",
            "BP5_01.3.HFE",
          ]),
        ]
      )
    );
    const categories = computed(() => {
      return plan.value.modules.reduce((map, module) => {
        if (!map.has(module.category)) {
          map.set(module.category, []);
        }
        map.get(module.category).push(module);
        return map;
      }, new Map());
    });

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
    };

    return {
      plan,
      categories,
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