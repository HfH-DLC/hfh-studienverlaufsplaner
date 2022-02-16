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
              {{ week }}
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
</template>

<script>
import TimeSlot from "./TimeSlot.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    TimeSlot,
  },
  data() {
    return {
      slotRefs: [],
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