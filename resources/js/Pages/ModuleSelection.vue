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
      <HfHButton class="mt-4" :disabled="form.processing">Weiter</HfHButton>
    </form>
  </main>
</template>

<script>
import HfHButton from "../Components/HfHButton.vue";
export default {
  components: {
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
  data() {
    return {
      form: this.$inertia.form({
        modules: [],
      }),
    };
  },
  created() {
    this.form.modules = this.categories.reduce((acc, cur) => {
      cur.modules.forEach((module) => {
        if (
          this.plan.modules.some((planModule) => module.id === planModule.id)
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
  },
  methods: {
    isFocusModule(module) {
      return this.focusModuleIds.includes(module.id);
    },
    isSelectedModule(module) {
      return this.form.modules.includes(module.id);
    },
    save() {
      this.form
        .transform((data) => ({
          modules: [
            ...data.modules,
            ...this.focusModuleIds,
            ...this.requiredModuleIds,
          ],
        }))
        .put(`/${this.planerSlug}/${this.planResource.data.slug}/module`, {
          onSuccess: () => this.form.reset(),
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>