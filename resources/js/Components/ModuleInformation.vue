<template>
  <div v-if="selectedModule">
    <h2 class="text-xl">{{ selectedModule.name }}</h2>
    <ul class="mt-4 space-y-2" v-if="selectedModule.errors.length > 0">
      <ErrorList :errors="selectedModule.errors" />
    </ul>
    <dl class="mt-4">
      <dt class="text-sm text-gray-500 font-bold uppercase">Modulnummer</dt>
      <dd>{{ selectedModule.number }}</dd>
      <dt class="mt-2 text-sm text-gray-500 font-bold uppercase">
        Kreditpunkte
      </dt>
      <dd>{{ selectedModule.credits }}</dd>
      <template v-if="selectedModule.prerequisites.length > 0">
        <dt class="mt-2 text-sm text-gray-500 font-bold uppercase">
          Voraussetzungen
        </dt>
        <dd>
          <ul>
            <li
              v-for="prerequisite in selectedModule.prerequisites"
              :key="prerequisite.id"
            >
              {{ prerequisite.number }} {{ prerequisite.name }}
            </li>
          </ul>
        </dd>
      </template>
      <dt class="mt-2 text-sm text-gray-500 font-bold uppercase">Termine</dt>
      <dd>
        <ul class="space-y-1">
          <li
            v-for="(timeSlot, index) in selectedModule.timeSlots"
            :key="index"
          >
            {{ timeSlot.semester }} {{ timeSlot.year }} {{ timeSlot.week }}
            {{ timeSlot.day }}
            {{ timeSlot.time }}
          </li>
        </ul>
      </dd>
    </dl>
  </div>
</template>

<script>
import ErrorList from "../Components/ErrorList.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    ErrorList,
  },
  computed: {
    ...mapGetters(["selectedModule"]),
  },
};
</script>

<style lang="scss" scoped>
</style>