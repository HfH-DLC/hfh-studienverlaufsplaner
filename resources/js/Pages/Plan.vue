<template>
  <div class="flex flex-1">
    <template v-if="initialized">
      <div class="w-3/12 p-4 sticky top-0">
        <ModuleList />
      </div>
      <div class="w-7/12 p-4 bg-gray-50">
        <TimeTable ref="timeTable" />
      </div>
      <div class="w-2/12 sticky top-0 p-4" aria-live="polite">
        <div class="mb-4 pb-4 border-b border-gray-300">
          <h2 class="text-sm text-gray-500 font-bold uppercase">
            Total Kreditpunkte
          </h2>
          <div>{{ credits }} / 90</div>
        </div>
        <ModuleInformation />
      </div>
    </template>
    <div v-else class="text-2xl text-center p-4 flex-1">Loading...</div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

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
  async created() {
    const { categories, modules, timeSlots, rules, plan } = this.$page.props;
    await this.init({
      categories,
      modules: modules.data,
      timeSlots,
      rules,
      plan,
    });
  },
  computed: {
    ...mapState(["initialized"]),
    ...mapGetters(["credits"]),
  },
  methods: {
    ...mapActions(["init"]),
  },
};
</script>

<style scoped>
</style>