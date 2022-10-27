<template>
  <div
    v-for="(year, yearIndex) in years"
    :key="yearIndex"
    class="mb-24 print:mb-4"
  >
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
            getSemesterString(semester.value)
          }}
          {{
            semester.calendarYear
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
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
  <Dialog
    :open="isTimeWindowInfoVisible"
    @close="setTimeWindowInfoVisible(false)"
    class="fixed inset-0 z-10 overflow-y-auto"
  >
    <DialogOverlay class="fixed inset-0 pointer-events-none bg-black/60" />
    <div
      class="
        max-w-2xl
        absolute
        bg-white
        shadow-lg
        p-4
        top-1/2
        left-1/2
        -translate-x-1/2 -translate-y-1/2
      "
    >
      <DialogTitle class="text-lg font-bold mr-20">{{
        timeWindowInfo.title
      }}</DialogTitle>
      <button
        @click="setTimeWindowInfoVisible(false)"
        class="absolute top-2 right-2 p-2"
      >
        <XIcon class="block w-6 h-6" aria-hidden="true" />
        <span class="sr-only">Schliessen</span>
      </button>

      <div class="mt-2" v-html="timeWindowInfo.content"></div>
    </div>
  </Dialog>
</template>

<script>
import TimeSlot from "./TimeSlot.vue";
import { mapGetters, mapState } from "vuex";
import { InformationCircleIcon, XIcon } from "@heroicons/vue/outline";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";
import { placements } from "@popperjs/core";
export default {
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TimeSlot,
    InformationCircleIcon,
    XIcon,
  },
  data() {
    return {
      slotRefs: [],
      isTimeWindowInfoVisible: false,
      timeWindowInfos: [
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
      timeWindowInfo: null,
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
      this.timeWindowInfo = this.timeWindowInfos.find(
        (info) => info.title === timeWindow
      );
      this.setTimeWindowInfoVisible(true);
    },
    setTimeWindowInfoVisible(value) {
      this.isTimeWindowInfoVisible = value;
    },
    getSemesterString(value) {
      if (value == "HS") {
        return "Herbstsemester";
      }
      if (value == "FS") {
        return "Frühlingssemester";
      }
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
