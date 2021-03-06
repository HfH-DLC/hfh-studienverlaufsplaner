<template>
  <div v-for="(year, yearIndex) in years" :key="yearIndex" class="mb-24">
    <div
      class="mb-4 border border-gray-300"
      v-for="(semester, semesterIndex) in year.semesters"
      :key="semesterIndex"
    >
      <table class="w-full divide-y divide-gray-300 table-fixed">
        <caption
          class="text-white py-2"
          :class="[semesterIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-600']"
        >
          {{
            semester.value
          }}
          {{
            semester.calendarYear
          }}
        </caption>
        <thead class="bg-gray-50">
          <tr class="divide-x divide-gray-300">
            <th id="blank"></th>
            <th
              scope="col"
              class="px-6 py-2 text-xs text-gray-500"
              v-for="week in semester.weeks"
              :key="week"
            >
              <div class="flex items-center">
                <span>{{ week }}</span>
                <button
                  class="p-2 flex items-center gap-1 hover:text-thunderbird-red"
                  @click="setWeekInfo(week)"
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
                  px-6
                  py-2
                  text-xs text-left
                  bg-gray-50
                  text-gray-500
                  w-px
                "
              >
                {{ day }} {{ time }}
              </th>
              <TimeSlot
                v-for="week in semester.weeks"
                :key="week"
                :ref="setSlotRef"
                :event="
                  selectableEventByDate(
                    year.value,
                    semester.value,
                    week,
                    day,
                    time
                  )
                "
                :placement="
                  placementByDate(year.value, semester.value, week, day, time)
                "
              />
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
  <Dialog
    :open="isWeekInfoVisible"
    @close="setWeekInfoVisible(false)"
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
        weekInfo.title
      }}</DialogTitle>
      <button
        @click="setWeekInfoVisible(false)"
        class="absolute top-2 right-2 p-2"
      >
        <XIcon class="block w-6 h-6" aria-hidden="true" />
        <span class="sr-only">Schliessen</span>
      </button>

      <div class="mt-2" v-html="weekInfo.content"></div>
    </div>
  </Dialog>
</template>

<script>
import TimeSlot from "./TimeSlot.vue";
import { mapGetters } from "vuex";
import { InformationCircleIcon, XIcon } from "@heroicons/vue/outline";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";
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
      isWeekInfoVisible: false,
      weekInfos: [
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
      weekInfo: null,
    };
  },
  computed: {
    ...mapGetters([
      "years",
      "selectableEventByDate",
      "placementByDate",
      "selectedModule",
    ]),
  },
  methods: {
    focusSelectableSlot() {
      //todo focus invalid slot if no valid ones are available?
      this.$nextTick(() => {
        const slotRef = this.slotRefs.find((ref) => {
          return ref.event && ref.event.valid;
        });
        if (slotRef) {
          slotRef.focusButton();
        }
      });
    },
    focusSlot(placementId) {
      this.$nextTick(() => {
        const slotRef = this.slotRefs.find((ref) => {
          return ref.placement && ref.placement.id === placementId;
        });
        if (slotRef) {
          slotRef.focusButton();
        }
      });
    },
    setSlotRef(el) {
      if (el) {
        this.slotRefs.push(el);
      }
    },
    setWeekInfo(week) {
      this.weekInfo = this.weekInfos.find((info) => info.title === week);
      this.setWeekInfoVisible(true);
    },
    setWeekInfoVisible(value) {
      this.isWeekInfoVisible = value;
    },
  },
  watch: {
    selectedModule(newValue, oldValue) {
      if (newValue) {
        if (newValue.placement) {
          this.focusSlot(newValue.placement.id);
        } else {
          this.focusSelectableSlot();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>