<template>
  <div class="min-h-screen">
    <div class="flex justify-between items-start p-4 border-b border-gray-300">
      <h1 class="text-3xl">Studienverlaufsplanner</h1>
    </div>
    <div class="flex items-start">
      <div class="w-3/12 p-4 sticky top-0">
        <ModuleList
          :categories="plan.categories"
          :selectedModuleId="selectedModuleId"
          @selected="toggleSelection"
        />
      </div>
      <div class="w-7/12 p-4 bg-gray-50">
        <TimeTable
          :semesters="semesters"
          :timeSlots="plan.timeSlots"
          @placeModule="placeModule"
        />
      </div>
      <div class="w-2/12 p-4 sticky top-0">
        <ModuleInformation :selectedModule="selectedModule" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import Plan from "../Models/Plan";
import Category from "../Models/Category";
import ModuleModel from "../Models/Module";
import TimeSlotModel from "../Models/TimeSlot";
import DateRule from "../Models/Rules/DateRule";
import PrerequisiteRule from "../Models/Rules/PrerequisiteRule";
import OnePerSemesterRule from "../Models/Rules/OnePerSemesterRule";

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
    const categories = [
      new Category("Pflichtbereich HFE", [
        new ModuleModel("P1_01", "Grundfragen der Heilpädagogik", 5, [
          { semester: "HS", day: "Montag", time: "Nachmittag" },
          { semester: "HS", day: "Donnerstag", time: "Nachmittag" },
          { semester: "FS", day: "Montag", time: "Nachmittag" },
          { semester: "FS", day: "Donnerstag", time: "Nachmittag" },
        ]),
        new ModuleModel("P1_03", "Heilpädagogik im Vorschulbereich", 5, [
          { semester: "FS", day: "Montag", time: "Vormittag" },
        ]),
        new ModuleModel(
          "P4_02",
          "Grundlagen der Heilpädagogischen Früherziehung",
          5,
          [{ semester: "HS", day: "Montag", time: "Vormittag" }]
        ),
        new ModuleModel(
          "P4_06",
          "Diagnostik und Früherfassung in der Heilpädagogischen Früherziehung",
          5,
          [{ semester: "FS", day: "Montag", time: "Nachmittag" }]
        ),
        new ModuleModel(
          "P4_07",
          "Entwicklungsorientierte Intervention in der Heilpädagogischen Früherziehung",
          5,
          [{ semester: "HS", day: "Donnerstag", time: "Nachmittag" }]
        ),
        new ModuleModel(
          "P4_08",
          "Beratung und Begleitung von Eltern und weiteren Bezugs- und Fachpersonen in der Heilpädagogischen Früherziehung",
          5,
          [{ semester: "HS", day: "Donnerstag", time: "Vormittag" }]
        ),
        new ModuleModel(
          "P4_09",
          "Interdisziplinarität und Kooperation im Kontext der Heilpädagogischen Früherziehung",
          5,
          [{ semester: "FS", day: "Donnerstag", time: "Vormittag" }]
        ),
      ]),
      new Category("Berufspraxis HFE", [
        new ModuleModel("BP5_01.1.HFE", "Berufspraxis I & Portfolio", 5, [
          { semester: "HS", day: "Montag", time: "Vormittag" },
          { semester: "FS", day: "Montag", time: "Vormittag" },
        ]),
        new ModuleModel("BP5_01.2.HFE", "Berufspraxis II & Portfolio", 5, [
          { semester: "HS", day: "Donnerstag", time: "Vormittag" },
          { semester: "FS", day: "Donnerstag", time: "Vormittag" },
        ]),
        new ModuleModel("BP5_01.3.HFE", "Berufspraxis III & Portfolio", 10, [
          { semester: "HS", day: "Donnerstag", time: "Nachmittag" },
          { semester: "FS", day: "Donnerstag", time: "Vormittag" },
          { semester: "FS", day: "Donnerstag", time: "Nachmittag" },
        ]),
      ]),
      new Category(
        "Wahlpflichtbereich HFE",
        [
          new ModuleModel("WP2_04.1", "Heilpädagogik im Bereich Hören I", 5, [
            { semester: "HS", day: "Donnerstag", time: "Nachmittag" },
          ]),
          new ModuleModel("WP2_04.2", "Heilpädagogik im Bereich Hören II", 5, [
            { semester: "FS", day: "Donnerstag", time: "Nachmittag" },
          ]),
          new ModuleModel("WP2_05.1", "Heilpädagogik im Bereich Sehen I", 5, [
            { semester: "HS", day: "Donnerstag", time: "Nachmittag" },
          ]),
          new ModuleModel(
            "WP2_06.1",
            "Heilpädagogik im Bereich körperlich-motorische Entwicklung. Motorische Beeinträchtigungen",
            5,
            [{ semester: "HS", day: "Montag", time: "Nachmittag" }]
          ),
          new ModuleModel(
            "WP2_06.2",
            "Heilpädagogik im Bereich körperlich-motorische Entwicklung. Chronische Erkrankungen",
            5,
            [{ semester: "FS", day: "Montag", time: "Nachmittag" }]
          ),
          new ModuleModel("WP2_07", "Schwere mehrfache Beeinträchtigungen", 5, [
            { semester: "HS", day: "Montag", time: "Vormittag" },
          ]),
          new ModuleModel(
            "WP2_11",
            "Autismus im Kontext der Heilpädagogischen Früherziehung",
            5,
            [{ semester: "FS", day: "Donnerstag", time: "Nachmittag" }]
          ),
        ],
        3
      ),
      new Category("Masterarbeit HFE", [
        new ModuleModel("M5_03", "Masterarbeit", 20, [
          { semester: "HS", day: "Montag", time: "Vormittag" },
          { semester: "HS", day: "Donnerstag", time: "Vormittag" },
          { semester: "FS", day: "Montag", time: "Vormittag" },
          { semester: "FS", day: "Donnerstag", time: "Vormittag" },
        ]),
      ]),
    ];

    const timeSlots = [
      new TimeSlotModel(
        1,
        "HS21",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Montag",
        "Vormittag"
      ),
      new TimeSlotModel(
        2,
        "HS21",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Montag",
        "Nachmittag"
      ),
      new TimeSlotModel(
        3,
        "HS21",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Donnerstag",
        "Vormittag"
      ),
      new TimeSlotModel(
        4,
        "HS21",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Donnerstag",
        "Nachmittag"
      ),
      new TimeSlotModel(5, "HS21", "Wo 1, 6, 10, 14", "Montag", "Vormittag"),
      new TimeSlotModel(6, "HS21", "Wo 1, 6, 10, 14", "Montag", "Nachmittag"),
      new TimeSlotModel(
        7,
        "HS21",
        "Wo 1, 6, 10, 14",
        "Donnerstag",
        "Vormittag"
      ),
      new TimeSlotModel(
        8,
        "HS21",
        "Wo 1, 6, 10, 14",
        "Donnerstag",
        "Nachmittag"
      ),

      new TimeSlotModel(
        9,
        "FS22",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Montag",
        "Vormittag"
      ),
      new TimeSlotModel(
        10,
        "FS22",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Montag",
        "Nachmittag"
      ),
      new TimeSlotModel(
        11,
        "FS22",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Donnerstag",
        "Vormittag"
      ),
      new TimeSlotModel(
        12,
        "FS22",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Donnerstag",
        "Nachmittag"
      ),
      new TimeSlotModel(13, "FS22", "Wo 1, 6, 10, 14", "Montag", "Vormittag"),
      new TimeSlotModel(14, "FS22", "Wo 1, 6, 10, 14", "Montag", "Nachmittag"),
      new TimeSlotModel(
        15,
        "FS22",
        "Wo 1, 6, 10, 14",
        "Donnerstag",
        "Vormittag"
      ),
      new TimeSlotModel(
        16,
        "FS22",
        "Wo 1, 6, 10, 14",
        "Donnerstag",
        "Nachmittag"
      ),

      new TimeSlotModel(
        17,
        "HS22",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Montag",
        "Vormittag"
      ),
      new TimeSlotModel(
        18,
        "HS22",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Montag",
        "Nachmittag"
      ),
      new TimeSlotModel(
        19,
        "HS22",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Donnerstag",
        "Vormittag"
      ),
      new TimeSlotModel(
        20,
        "HS22",
        "Wo 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        "Donnerstag",
        "Nachmittag"
      ),
      new TimeSlotModel(21, "HS22", "Wo 1, 6, 10, 14", "Montag", "Vormittag"),
      new TimeSlotModel(22, "HS22", "Wo 1, 6, 10, 14", "Montag", "Nachmittag"),
      new TimeSlotModel(
        23,
        "HS22",
        "Wo 1, 6, 10, 14",
        "Donnerstag",
        "Vormittag"
      ),
      new TimeSlotModel(
        24,
        "HS22",
        "Wo 1, 6, 10, 14",
        "Donnerstag",
        "Nachmittag"
      ),
    ];

    const rules = [
      new DateRule(),
      new PrerequisiteRule("P4_07", ["P4_02"]),
      new PrerequisiteRule("P4_08", ["P4_02"]),
      new PrerequisiteRule("BP5_01.2.HFE", ["BP5_01.1.HFE"]),
      new PrerequisiteRule("BP5_01.3.HFE", ["BP5_01.1.HFE", "BP5_01.2.HFE"]),
      new OnePerSemesterRule(["BP5_01.1.HFE", "BP5_01.2.HFE", "BP5_01.3.HFE"]),
      new PrerequisiteRule("WP2_04.2", ["WP2_04.1"]),
    ];

    const plan = ref(new Plan(categories, timeSlots, rules));

    const selectedModuleId = ref(null);
    const selectedModule = computed(() => {
      const foundModule = plan.value.modules.find((module) => {
        return module.id == selectedModuleId.value;
      });
      return foundModule;
    });

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
      plan.value.select(module.id);
    };

    const placeModule = (slot) => {
      plan.value.placeModule(slot.id, selectedModuleId.value);
      selectedModuleId.value = null;
    };

    const semesters = computed(() => {
      return [
        ...new Set(
          plan.value.timeSlots.map((slot) => {
            return slot.semester;
          })
        ),
      ].map((semester) => {
        const slotsBySemester = plan.value.timeSlots.filter(
          (slot) => slot.semester == semester
        );
        return {
          label: semester,
          weeks: new Set(slotsBySemester.map((slot) => slot.week)),
          days: new Set(slotsBySemester.map((slot) => slot.day)),
          times: new Set(slotsBySemester.map((slot) => slot.time)),
        };
      });
    });

    return {
      plan,
      semesters,
      selectedModuleId,
      selectedModule,
      toggleSelection,
      placeModule,
    };
  },
};
</script>

<style scoped>
</style>