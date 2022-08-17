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
      form: this.$inertia.form({
        modules: [],
      }),
      requiredCredits: 30, //todo get data from backend
    };
  },
  created() {
    this.form.modules = this.categories.reduce((acc, cur) => {
      cur.modules.forEach((module) => {
        if (
          this.plan.selectedModules.some(
            (planModule) => module.id === planModule.id
          )
        ) {
          acc.push(module.id);
        }
      });
      return acc;
    }, []);
  },
  computed: {
    plan() {
      return this.planResource.data;
    },
    categories() {
      return this.categoriesResource.data
        .filter((category) => category.moduleSelectionEnabled)
        .map((category) => {
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
    requiredModuleIds() {
      return this.categoriesResource.data
        .filter((category) => !category.moduleSelectionEnabled)
        .reduce((acc, cur) => {
          acc.push(...cur.modules.map((module) => module.id));
          return acc;
        }, []);
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
      if (this.totalCredits != this.requiredCredits) {
        this.addError(
          "total",
          `Sie müssen insgesamt ${this.requiredCredits} aus dem Wahlpflicht- und Wahlangebot Kreditpunkte belegen.`
        );
      }
      this.categories.forEach((category) => {
        if (category.currentCredits > category.maxCredits) {
          this.addError(
            `categories.${category.id}`,
            `Sie können im Bereich ${category.name} maximal ${category.maxCredits} Kreditpunkte belegen.`
          );
        }
        if (category.currentCredits < category.minCredits) {
          this.addError(
            `categories.${category.id}`,
            `Sie müssen im Bereich ${category.name} mindestens ${category.minCredits} Kreditpunkte belegen.`
          );
        }
      });
      return this.isValid;
    },
    save() {
      if (!this.validate()) {
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