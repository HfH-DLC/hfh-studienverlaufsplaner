<template>
  <template v-if="initialized">
    <div class="mb-4 p-4" role="alert" v-if="errors.length > 0">
      <ul class="space-y-2">
        <li v-for="(error, index) in errors" :key="index">
          <Error :error="error" />
        </li>
      </ul>
    </div>
    <div class="flex flex-1">
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
    </div>
  </template>
  <div v-else class="text-2xl text-center p-4 flex-1">Loading...</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

// Components
import Error from "../Components/Error.vue";
import ModuleInformation from "../Components/ModuleInformation.vue";
import ModuleList from "../Components/ModuleList.vue";
import TimeTable from "../Components/TimeTable.vue";

export default {
  components: {
    Error,
    TimeTable,
    ModuleInformation,
    ModuleList,
  },
  async created() {
    const { categories, modules, timeSlots, rules, plan, planerSlug } =
      this.$page.props;
    await this.init({
      categories: categories.data,
      modules: modules.data,
      timeSlots: timeSlots.data,
      rules: rules.data,
      plan: plan.data,
      planerSlug,
    });
  },
  computed: {
    ...mapState(["initialized"]),
    ...mapGetters(["credits", "errors"]),
  },
  methods: {
    ...mapActions(["init"]),
  },
};
</script>

<style scoped>
</style>