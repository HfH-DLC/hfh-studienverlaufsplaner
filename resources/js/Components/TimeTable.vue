<template>
  <div v-for="(year, yearIndex) in years" :key="yearIndex">
    <div
      class="mb-4"
      v-for="(semester, semesterIndex) in year.semesters"
      :key="semesterIndex"
    >
      <table
        class="
          w-full
          divide-y divide-gray-300
          table-fixed
          text-left
          border border-gray-300
        "
      >
        <caption
          class="
            text-white
            py-2
            print:border-t
            print:border-l
            print:border-r
            print:text-black
            print:border-gray-300
            print:bg-transparent
          "
          :class="[semesterIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-600']"
        >
          {{
            getSemesterString(
              yearIndex * 2 + semesterIndex + 1,
              semester.value,
              semester.calendarYear
            )
          }}
        </caption>
        <thead class="bg-gray-50">
          <tr class="divide-x divide-gray-300">
            <th id="blank" class="w-1/5"></th>
            <th
              scope="col"
              class="px-4 py-2 text-base text-gray-600 font-normal"
              v-for="timeWindow in semester.timeWindows"
              :key="timeWindow"
            >
              <div class="flex items-center">
                <span>{{ timeWindow }}</span>
                <button
                  class="p-2 flex items-center gap-1 hover:text-thunderbird-red"
                  @click="setTimeWindowInfo(timeWindow)"
                >
                  <InformationCircleIcon class="w-5 h-5" aria-hidden="true" />
                  <span class="sr-only"
                    >Informationen zu diesem Zeitfenster</span
                  >
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-300">
          <template v-for="day in semester.days" :key="day">
            <tr
              v-for="time in semester.times"
              :key="time"
              class="divide-x divide-gray-300"
            >
              <th
                scope="row"
                class="
                  px-4
                  py-2
                  text-base text-left
                  bg-gray-50
                  text-gray-600
                  w-px
                  font-normal
                "
              >
                {{ day }}: {{ time }}
              </th>
              <td v-for="timeWindow in semester.timeWindows" :key="timeWindow">
                <TimeSlot
                  :ref="setSlotRef"
                  :showLocation="showLocations"
                  :events="
                    selectableEventsByDate(
                      year.value,
                      semester.value,
                      timeWindow,
                      day,
                      time
                    )
                  "
                  :placement="
                    placementByDate(
                      year.value,
                      semester.value,
                      timeWindow,
                      day,
                      time
                    )
                  "
                  :availableModules="
                    modulesByDateAndLocation(
                      year.value,
                      semester.value,
                      timeWindow,
                      day,
                      time
                    )
                  "
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
  <HfhDialog
    v-if="dialogInfo"
    :open="isDialogVisible"
    :title="dialogInfo.title"
    @closed="onDialogClosed"
    ><div v-html="dialogInfo.content"></div
  ></HfhDialog>
</template>

<script>
import TimeSlot from "./TimeSlot.vue";
import { mapGetters, mapState } from "vuex";
import { InformationCircleIcon, XIcon } from "@heroicons/vue/outline";
import HfhDialog from "./HfhDialog.vue";
export default {
  components: {
    HfhDialog,
    TimeSlot,
    InformationCircleIcon,
    XIcon,
  },
  data() {
    return {
      slotRefs: [],
      isDialogVisible: false,
      timeWindowContentList: [
        {
          title: "Pflichtmodule & Wahlpflichtmodule",
          content: "Semesterwochen 2, 3, 4, 5, 7, 8, 9, 11, 12, 13",
        },
        {
          title: "Berufspraxis, Portfolio & Masterarbeit",
          content: `<p>
              Berufspraxis/Portfolio Semesterwochen: 1, 6, 10, 14
            </p>
            <p>
              Masterarbeit: Kalenderwochen 34, 36, 38 (im Herbst), 5, 7, 8 (im Frühling)
            </p>`,
        },
      ],
      dialogInfo: null,
    };
  },
  computed: {
    ...mapState("schedule", ["locations"]),
    ...mapGetters("schedule", [
      "years",
      "selectableEventsByDate",
      "placements",
      "placementByDate",
      "selectedModule",
      "modulesByDateAndLocation",
    ]),
    showLocations() {
      if (this.locations.filter((location) => location.checked).length > 1) {
        return true;
      }
      const placedLocations = this.placements.reduce((acc, cur) => {
        acc.add(cur.location);
        return acc;
      }, new Set());
      if (placedLocations.size > 1) {
        return true;
      }
      return false;
    },
  },
  methods: {
    focusSlot() {
      this.$nextTick(() => {
        const slotRef = this.slotRefs.find((ref) => {
          return (
            !ref.placement &&
            ref.events.length > 0 &&
            ref.events.some((event) => event.valid)
          );
        });
        if (slotRef) {
          slotRef.focusSlot();
        }
      });
    },
    focusPlacement(placementId) {
      this.$nextTick(() => {
        const slotRef = this.slotRefs.find((ref) => {
          return ref.placement && ref.placement.id === placementId;
        });
        if (slotRef) {
          slotRef.focusPlacement();
        }
      });
    },
    setSlotRef(el) {
      if (el) {
        this.slotRefs.push(el);
      }
    },
    setTimeWindowInfo(timeWindow) {
      this.dialogInfo = this.timeWindowContentList.find(
        (info) => info.title === timeWindow
      );
      this.isDialogVisible = true;
    },
    onDialogClosed() {
      this.isDialogVisible = false;
    },
    getSemesterString(count, semester, year) {
      if (semester == "HS") {
        semester = "Herbst";
      } else if (semester == "FS") {
        semester = "Frühling";
      }

      return `${count}. Semester (${semester} ${year})`;
    },
  },
  watch: {
    selectedModule(newValue, oldValue) {
      if (newValue) {
        if (newValue.placement) {
          this.focusPlacement(newValue.placement.id);
        } else {
          this.focusSlot();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  page-break-inside: avoid !important;
}
</style>
