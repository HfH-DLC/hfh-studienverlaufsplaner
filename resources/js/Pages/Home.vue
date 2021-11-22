<template>
  <div class="min-h-screen">
    <div class="flex justify-between items-start p-4 border-b border-gray-300">
      <h1 class="text-3xl">Studienverlaufsplanner</h1>
    </div>
    <div class="flex items-start">
      <div class="w-3/12 p-4 sticky top-0">
        <Disclosure
          v-for="category in plan.categories"
          :key="category"
          as="div"
          class="mb-4 border border-gray-300 rounded overflow-hidden"
          v-slot="{ open }"
          :defaultOpen="dropdownStatus[category.name]"
        >
          <DisclosureButton
            class="
              flex
              justify-between
              items-center
              w-full
              px-4
              py-2
              text-left
              bg-gray-50
            "
            :class="{ 'border-b': open }"
            @click="toggleDropdownStatus(category.name)"
          >
            <div>
              {{ category.name }}
              <span class="whitespace-nowrap"
                >({{ category.placedNumber }} /
                {{ category.requiredNumber }})</span
              >
            </div>
            <ChevronUpIcon
              :class="open ? 'transform rotate-180' : ''"
              class="w-5 h-5 transition"
            />
          </DisclosureButton>
          <DisclosurePanel class="p-4">
            <ul>
              <li v-for="module in category.modules" :key="module.id">
                <Module
                  @click="toggleSelection(module)"
                  :module="module"
                  :disabled="
                    !plan.hasFreeSlots() ||
                    category.placedNumber === category.requiredNumber ||
                    (module.errors && module.errors.length > 0)
                  "
                  :selected="module.id == selectedModuleId"
                />
              </li>
            </ul>
          </DisclosurePanel>
        </Disclosure>
      </div>
      <div class="w-7/12 p-4 bg-gray-50">
        <div
          class="overflow-hidden rounded-xl border border-gray-300 mb-8"
          v-for="(semester, index) in semesters"
          :key="index"
        >
          <table class="w-full divide-y divide-gray-300 table-fixed">
            <caption class="bg-gray-900 text-white py-2">
              {{
                semester.label
              }}
            </caption>
            <thead class="bg-gray-50">
              <tr class="divide-x divide-gray-300">
                <th id="blank"></th>
                <th
                  scope="col"
                  class="px-6 py-2 text-xs text-gray-500"
                  v-for="day in semester.days"
                  :key="day"
                >
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-300">
              <template v-for="(time, index) in semester.times" :key="index">
                <th
                  :id="`${semester}-time-${index}`"
                  colspan="3"
                  scope="colgroup"
                  class="
                    px-6
                    py-2
                    text-xs text-center
                    bg-gray-100
                    text-gray-500
                  "
                >
                  {{ time }}
                </th>
                <tr
                  class="divide-x divide-gray-300"
                  v-for="(week, index) in semester.weeks"
                  :key="index"
                >
                  <th
                    scope="row"
                    class="px-6 py-2 text-xs text-left text-gray-500"
                  >
                    {{ week }}
                  </th>
                  <td class="p-1" v-for="day in semester.days" :key="day">
                    <TimeSlot
                      :timeSlot="getTimeSlot(semester.label, week, day, time)"
                      @placeModule="placeModule"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="w-2/12 p-4 sticky top-0">
        <div v-if="selectedModule">
          <h2 class="text-xl">{{ selectedModule.name }}</h2>
          <dl class="mt-4">
            <dt class="text-sm text-gray-500 font-bold uppercase">
              Modulnummer
            </dt>
            <dd>{{ selectedModule.id }}</dd>
            <dt class="mt-2 text-sm text-gray-500 font-bold uppercase">
              Kreditpunkte
            </dt>
            <dd>{{ selectedModule.credits }}</dd>
          </dl>
        </div>
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
import PrerequisiteRule from "../Models/Rules/PrerequisiteRule";
import OnePerSemesterRule from "../Models/Rules/OnePerSemesterRule";

// Components
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import TimeSlot from "../Components/TimeSlot.vue";
import Module from "../Components/Module.vue";
import { ChevronUpIcon } from "@heroicons/vue/solid";

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    TimeSlot,
    Module,
    ChevronUpIcon,
  },
  setup() {
    const categories = [
      new Category("Pflichtbereich HFE", [
        new ModuleModel("P1_01", "Grundfragen der Heilpädagogik", 5),
        new ModuleModel("P1_03", "Heilpädagogik im Vorschulbereich", 5),
        new ModuleModel(
          "P4_02",
          "Grundlagen der Heilpädagogischen Früherziehung",
          5
        ),
        new ModuleModel(
          "P4_06",
          "Diagnostik und Früherfassung in der Heilpädagogischen Früherziehung",
          5
        ),
        new ModuleModel(
          "P4_07",
          "Entwicklungsorientierte Intervention in der Heilpädagogischen Früherziehung",
          5
        ),
        new ModuleModel(
          "P4_08",
          "Beratung und Begleitung von Eltern und weiteren Bezugs- und Fachpersonen in der Heilpädagogischen Früherziehung",
          5
        ),
        new ModuleModel(
          "P4_09",
          "Interdisziplinarität und Kooperation im Kontext der Heilpädagogischen Früherziehung",
          5
        ),
      ]),
      new Category("Berufspraxis HFE", [
        new ModuleModel("BP5_01.1.HFE", "Berufspraxis I & Portfolio", 5),
        new ModuleModel("BP5_01.2.HFE", "Berufspraxis II & Portfolio", 5),
        new ModuleModel("BP5_01.3.HFE", "Berufspraxis III & Portfolio", 10),
      ]),
      new Category(
        "Wahlpflichtbereich HFE",
        [
          new ModuleModel("WP2_04.1", "Heilpädagogik im Bereich Hören I", 5),
          new ModuleModel("WP2_04.2", "Heilpädagogik im Bereich Hören II", 5),
          new ModuleModel("WP2_05.1", "Heilpädagogik im Bereich Sehen I", 5),
          new ModuleModel(
            "WP2_06.1",
            "Heilpädagogik im Bereich körperlich-motorische Entwicklung. Motorische Beeinträchtigungen",
            5
          ),
          new ModuleModel(
            "WP2_06.2",
            "Heilpädagogik im Bereich körperlich-motorische Entwicklung. Chronische Erkrankungen",
            5
          ),
          new ModuleModel("WP2_07", "Schwere mehrfache Beeinträchtigungen", 5),
          new ModuleModel(
            "WP2_11",
            "Autismus im Kontext der Heilpädagogischen Früherziehung",
            5
          ),
        ],
        3
      ),
      new Category("Masterarbeit HFE", [
        new ModuleModel("M5_03", "Masterarbeit", 20),
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

    const dropdownStatus = ref(
      plan.value.categories.reduce((acc, category, index) => {
        acc[category.name] = index == 0;
        return acc;
      }, {})
    );

    const toggleDropdownStatus = (categoryName) => {
      dropdownStatus.value[categoryName] = !dropdownStatus.value[categoryName];
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

    const getTimeSlot = (semester, week, day, time) => {
      let timeSlot = plan.value.timeSlots.find((slot) => {
        return (
          slot.semester == semester &&
          slot.week == week &&
          slot.day == day &&
          slot.time == time
        );
      });
      if (timeSlot) {
        const selectable =
          selectedModuleId.value &&
          !timeSlot.module &&
          (!selectionErrors.value[timeSlot.id] ||
            selectionErrors.value[timeSlot.id].length == 0);

        return {
          ...timeSlot,
          selectable,
        };
      }
      return null;
    };

    return {
      plan,
      semesters,
      getTimeSlot,
      selectedModuleId,
      selectedModule,
      toggleSelection,
      placeModule,
      selectionErrors,
      dropdownStatus,
      toggleDropdownStatus,
    };
  },
};
</script>

<style scoped>
</style>