<template>
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
            class="px-6 py-2 text-xs text-center bg-gray-100 text-gray-500"
          >
            {{ time }}
          </th>
          <tr
            class="divide-x divide-gray-300"
            v-for="(week, index) in semester.weeks"
            :key="index"
          >
            <th scope="row" class="px-6 py-2 text-xs text-left text-gray-500">
              {{ week }}
            </th>
            <td class="p-1" v-for="day in semester.days" :key="day">
              <TimeSlot
                :timeSlot="getTimeSlot(semester.label, week, day, time)"
                @placeModule="$emit('placeModule', $event)"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import TimeSlot from "../Components/TimeSlot.vue";
export default {
  components: {
    TimeSlot,
  },
  emits: ["placeModule"],
  props: {
    semesters: {
      type: Array,
      required: true,
    },
    timeSlots: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getTimeSlot(semester, week, day, time) {
      return this.timeSlots.find((slot) => {
        return (
          slot.semester == semester &&
          slot.week == week &&
          slot.day == day &&
          slot.time == time
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>