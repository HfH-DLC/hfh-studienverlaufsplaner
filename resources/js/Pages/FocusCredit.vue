<template>
  <main class="p-4 max-w-6xl mx-auto">
    <h1 class="text-3xl mt-4 mb-2">Anrechnung an die Studienschwerpunkte</h1>
    <form @submit.prevent="save">
      <div class="mt-4 grid grid-cols-[1fr,auto] gap-y-4">
        <template v-for="module in modules" :key="module.id">
          <div>
            <label :for="`credit-${module.id}`"
              >{{ module.id }} {{ module.name }}</label
            >
          </div>
          <div v-if="module.fixedCredit">
            SSP {{ module.creditedAgainst.label }}
          </div>
          <HfHSelect
            v-else
            :id="`credit-${module.id}`"
            :options="focusOptions"
            v-model="form.focusCredits[module.id]"
            emptyOptionLabel="Nicht anrechnen"
          />
        </template>
      </div>
      <ErrorList class="mt-4 space-y-2" :errors="getErrors('global')" />
      <HfHButton class="mt-4" :disabled="form.processing">Weiter</HfHButton>
    </form>
  </main>
</template>

<script>
import ErrorList from "../Components/ErrorList.vue";
import HfHButton from "../Components/HfHButton.vue";
import HfHSelect from "../Components/HfHSelect.vue";

import { useValidation } from "../Composables/useValidation";
import ECTSPerFocusRule from "../Models/Rules/FocusCredit/ECTSPerFocusRule";
import RequiredModulePerFocusRule from "../Models/Rules/FocusCredit/RequiredModulePerFocusRule";
export default {
  components: { ErrorList, HfHButton, HfHSelect },
  props: {
    creditableModulesResource: {
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
  setup() {
    return useValidation();
  },
  data() {
    return {
      form: this.$inertia.form("FocusCredit", {
        focusCredits: this.creditableModulesResource.data.reduce((acc, cur) => {
          acc[cur.id] = cur.creditedAgainst ? cur.creditedAgainst.id : "";
          return acc;
        }, {}),
      }),
      rules: [
        new ECTSPerFocusRule({ minECTS: 30, maxECTS: 65 }),
        new RequiredModulePerFocusRule({
          moduleIds: ["BP5_01.1.SHP", "BP5_01.2.SHP", "BP5_01.3.SHP"],
        }),
      ],
    };
  },

  computed: {
    modules() {
      return this.creditableModulesResource.data;
    },
    focusOptions() {
      return this.planResource.data.focusSelections.map((focusSelection) => ({
        label: "SSP " + focusSelection.focus.name,
        value: focusSelection.id,
      }));
    },
  },

  methods: {
    validate() {
      const focusCredits = this.groupByFocus(this.form.focusCredits);
      this.resetErrors();
      this.rules.forEach((rule) =>
        rule.validate(
          focusCredits,
          this.planResource.data.focusSelections,
          this.modules,
          this.addError
        )
      );
    },
    groupByFocus(focusCredits) {
      return Object.entries(focusCredits).reduce((acc, cur) => {
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
      }, {});
    },
    save() {
      this.validate();
      console.log(this.isValid);
      if (!this.isValid) {
        return;
      }
      this.form
        .transform((data) => ({
          focusCredits: this.groupByFocus(data.focusCredits),
        }))
        .put(`/${this.planerSlug}/${this.planResource.data.slug}/anrechnung`, {
          onSuccess: () => this.form.reset(),
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>