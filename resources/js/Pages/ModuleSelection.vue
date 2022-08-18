<template>
  <main class="p-4 max-w-6xl mx-auto">
    <h1 class="text-3xl mt-4 mb-2">Wahlpflicht- und Wahlmodule</h1>
    <p>
      Das Wahlpflicht- und Wahlangebot ist in drei Bereiche gegliedert. Aus den
      Bereichen Wahlpflicht 1 und Wahlpflicht 2 belegen Sie mindestens 10 CP und
      maximal 20 CP. Aus dem Bereich Wahl belegen Sie maximal 10 CP. Falls sich
      Ihre Interessen im Verlauf des Studiums ändern sollten, ist ein Wechsel
      der Wahlpflicht- und Wahlmodule in der jeweiligen Überprüfungsphase
      möglich.
    </p>

    <form @submit.prevent="save" class="mt-4">
      <div v-for="category in categories" :key="category.id">
        <h2 class="text-2xl mt-4 mb-2">
          {{ category.name }}
          <span class="text-base"
            >({{ category.currentCredits }} / {{ category.minCredits }} -
            {{ category.maxCredits }} Kreditpunkte)</span
          >
        </h2>
        <ErrorList :errors="getErrors(`categories.${category.id}`)" />
        <div v-for="module in category.modules" :key="module.id" class="mb-1">
          <input
            v-if="!module.isFocusModule"
            type="checkbox"
            :id="module.id"
            :value="module.id"
            v-model="form.modules"
            :disabled="
              category.currentCredits >= category.maxCredits &&
              !module.isSelectedModule
            "
          />
          <input
            v-else
            type="checkbox"
            :id="module.id"
            :value="module.id"
            disabled
            checked
          />
          <label class="ml-2" :for="module.id"
            >{{ module.id }} {{ module.name }}</label
          >
        </div>
      </div>
      <ErrorList :errors="getErrors('total')" />
      <HfHButton class="mt-4" :disabled="form.processing">Weiter</HfHButton>
    </form>
  </main>
</template>

<script>
import { useValidation } from "../Composables/useValidation";
import ErrorList from "../Components/ErrorList.vue";
import HfHButton from "../Components/HfHButton.vue";

import TotalECTSRule from "../Models/Rules/ModuleSelection/TotalECTSRule";
import CategoriesECTSRule from "../Models/Rules/ModuleSelection/CategoriesECTSRule";
export default {
  components: {
    ErrorList,
    HfHButton,
  },
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

  setup() {
    return useValidation();
  },
  data() {
    return {
      form: this.$inertia.form("ModuleSelection", {
        modules: this.categoriesResource.data.reduce((acc, cur) => {
          cur.modules.forEach((module) => {
            if (
              this.planResource.data.selectedModules.some(
                (planModule) => module.id === planModule.id
              )
            ) {
              acc.push(module.id);
            }
          });
          return acc;
        }, []),
      }),
      rules: [
        //todo get from backend
        new TotalECTSRule({ requiredECTS: 30 }),
        new CategoriesECTSRule(),
      ],
    };
  },
  computed: {
    plan() {
      return this.planResource.data;
    },
    categories() {
      return this.categoriesResource.data.map((category) => {
        const modules = category.modules.map((module) => ({
          ...module,
          isFocusModule: this.isFocusModule(module),
          isSelectedModule: this.isSelectedModule(module),
        }));
        const currentModules = modules.filter((module) => {
          return module.isFocusModule || module.isSelectedModule;
        });
        const currentCredits = currentModules.reduce(
          (acc, cur) => acc + cur.credits,
          0
        );
        return {
          ...category,
          modules,
          currentCredits,
        };
      });
    },
    focusModuleIds() {
      return this.plan.focusSelections.reduce((acc, cur) => {
        if (cur.focus) {
          acc.push(...cur.focus.requiredModules.map((module) => module.id));
          acc.push(...cur.selectedRequiredModules.map((module) => module.id));
        }
        return acc;
      }, []);
    },
    totalCredits() {
      return this.categories.reduce((acc, cur) => {
        return acc + cur.currentCredits;
      }, 0);
    },
  },
  methods: {
    isFocusModule(module) {
      return this.focusModuleIds.includes(module.id);
    },
    isSelectedModule(module) {
      return this.form.modules.includes(module.id);
    },
    validate() {
      this.resetErrors();
      this.rules.forEach((rule) =>
        rule.validate(this.categories, this.addError)
      );
    },
    save() {
      this.validate();
      if (!this.isValid) {
        return;
      }
      this.form.put(
        `/${this.planerSlug}/${this.planResource.data.slug}/module`,
        {
          onSuccess: () => this.form.reset(),
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
input:checked + label {
  @apply text-green-700;
}
</style>