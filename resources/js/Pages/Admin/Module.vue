<template>
  <div class="flex-1 flex justify-between">
    <div class="w-full p-4">
      <h2 class="text-xl">{{ module.id }} {{ module.name }}</h2>
      <h3 class="mt-4 mb-1 text-lg">Durchführungen</h3>
      <EntityList :entities="events">
        <template v-slot:label="slotProps">
          {{ slotProps.entity.semester }}
          {{
            getCalendarYear(slotProps.entity.semester, slotProps.entity.year)
          }}, Zeitfenster {{ slotProps.entity.timeWindow }},
          {{ slotProps.entity.day }} {{ slotProps.entity.time }}
        </template>
      </EntityList>
    </div>
  </div>
</template>

<script>
import AdminLayout from "../../Layouts/AdminLayout.vue";
import EntityList from "../../Components/Admin/EntityList.vue";
import {
  getCalendarYear,
  orderDay,
  orderSemester,
  orderTime,
  orderTimeWindow,
} from "../../helpers";
export default {
  layout: AdminLayout,
  components: {
    EntityList,
  },
  props: {
    moduleResource: {
      type: Object,
      required: true,
    },
  },
  computed: {
    module() {
      return this.moduleResource.data;
    },
    events() {
      return this.module.events.sort((a, b) => {
        return (
          a.year - b.year ||
          orderSemester(a.semester, b.semester) ||
          orderTimeWindow(a.timeWindow, b.timeWindow) ||
          orderDay(a.day, b.day) ||
          orderTime(a.time, b.time)
        );
      });
    },
  },
  methods: {
    getCalendarYear(semester, year) {
      return getCalendarYear(semester, year);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>