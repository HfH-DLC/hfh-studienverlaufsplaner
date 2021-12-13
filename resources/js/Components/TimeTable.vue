<template>
  <template v-for="year in years">
    <div
      class="overflow-hidden rounded-xl border border-gray-300 mb-8"
      v-for="(semester, semesterIndex) in year.semesters"
      :key="semesterIndex"
    >
      <table class="w-full divide-y divide-gray-300 table-fixed">
        <caption class="bg-gray-900 text-white py-2">
          {{
            semester.semester
          }}
          {{
            year.year
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
          <template
            v-for="(time, timeIndex) in semester.times"
            :key="timeIndex"
          >
            <th
              colspan="3"
              scope="colgroup"
              class="px-6 py-2 text-xs text-center bg-gray-100 text-gray-500"
              aria-hidden="true"
            >
              {{ time }}
            </th>
            <tr
              class="divide-x divide-gray-300"
              v-for="(week, weekIndex) in semester.weeks"
              :key="weekIndex"
            >
              <th
                scope="row"
                class="px-6 py-2 text-xs text-left bg-gray-50 text-gray-500"
              >
                <span aria-hidden="true">{{ week }}</span>
                <span class="sr-only">{{ time }} {{ week }}</span>
              </th>
              <TimeSlot
                v-for="day in semester.days"
                :key="day"
                :ref="setTimeSlotRef"
                :timeSlot="
                  timeSlotByDate(year.year, semester.semester, week, day, time)
                "
              />
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </template>
</template>

<script>
import TimeSlot from "../Components/TimeSlot.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    TimeSlot,
  },
  data() {
    return {
      timeSlotRefs: [],
    };
  },
  computed: {
    ...mapGetters(["years", "timeSlots", "timeSlotByDate", "selectedModule"]),
  },
  methods: {
    focusSlot() {
      this.$nextTick(() => {
        const slotRef = this.timeSlotRefs.find((ref) => {
          return ref.timeSlot.selectable;
        });
        if (slotRef) {
          slotRef.focusButton();
        }
      });
    },
    setTimeSlotRef(el) {
      if (el) {
        this.timeSlotRefs.push(el);
      }
    },
  },
  watch: {
    selectedModule(newValue, oldValue) {
      if (newValue) {
        this.focusSlot();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>