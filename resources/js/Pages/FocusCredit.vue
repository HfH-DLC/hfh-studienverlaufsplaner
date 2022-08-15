<template>
  <main class="p-4 max-w-6xl mx-auto">
    <h1 class="text-3xl mt-4 mb-2">Anrechnung an die Studienschwerpunkte</h1>
    <form @submit.prevent="save">
      <div class="mt-4 grid grid-cols-2 gap-y-4 items-center">
        <template v-for="module in modules" :key="module.id">
          <div>
            <label :for="`credit-${module.id}`"
              >{{ module.id }} {{ module.name }}</label
            >
          </div>
          <HfHSelect
            :id="`credit-${module.id}`"
            :options="focusOptions"
            v-model="form.focusCredits[module.id]"
          />
        </template>
      </div>
      <HfHButton class="mt-4" :disabled="form.processing">Weiter</HfHButton>
    </form>
  </main>
</template>

<script>
import HfHButton from "../Components/HfHButton.vue";
import HfHSelect from "../Components/HfHSelect.vue";
export default {
  components: { HfHButton, HfHSelect },
  props: {
    categoriesResource: {
      type: Object,
      required: true,
    },
    planResource: {
      type: Object,
      required: true,
    },
    planerSlug: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      form: this.$inertia.form({
        focusCredits: {},
      }),
    };
  },

  created() {
    this.form.focusCredits = this.modules.reduce((acc, cur) => {
      acc[cur.id] = cur.creditedFocusSelectionId
        ? cur.creditedFocusSelectionId
        : "";
      return acc;
    }, {});
  },

  computed: {
    modules() {
      return this.planResource.data.modules
        .filter((module) => module.creditableAgainstFocus)
        .map((module) => ({
          ...module,
          creditedFocusSelectionId: this.getCreditedFocusSelectionId(module),
        }));
    },
    focusOptions() {
      return this.planResource.data.focusSelections.map((focusSelection) => ({
        label: focusSelection.focus.name,
        value: focusSelection.id,
      }));
    },
  },

  methods: {
    save() {
      this.form
        .transform((data) => ({
          focusCredits: Object.entries(data.focusCredits).reduce((acc, cur) => {
            const focusId = cur[1];
            if (!focusId) {
              return acc;
            }
            const moduleId = cur[0];
            if (!acc[focusId]) {
              acc[focusId] = [];
            }
            acc[focusId].push(moduleId);
            return acc;
          }, {}),
        }))
        .put(`/${this.planerSlug}/${this.planResource.data.slug}/anrechnung`, {
          onSuccess: () => this.form.reset(),
        });
    },
    getCreditedFocusSelectionId(module) {
      const focusSelection = this.planResource.data.focusSelections.find(
        (focusSelection) =>
          focusSelection.creditModules.some(
            (creditedModule) => creditedModule.id === module.id
          )
      );
      return focusSelection ? focusSelection.id : "";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>