<template>
  <main>
    <h1>Wahlpflicht- und Wahlmodule</h1>
    <p>
      Das Wahlpflicht- und Wahlangebot ist in drei Bereiche gegliedert. Aus den
      Bereichen Wahlpflicht 1 und Wahlpflicht 2 belegen Sie mindestens 10 CP und
      maximal 20 CP. Aus dem Bereich Wahl belegen Sie maximal 10 CP. Falls sich
      Ihre Interessen im Verlauf des Studiums ändern sollten, ist ein Wechsel
      der Wahlpflicht- und Wahlmodule in der jeweiligen Überprüfungsphase
      möglich.
    </p>

    <form @submit.prevent="save">
      <div v-for="category in categories" :key="category.id">
        <h2>
          {{ category.name }}
        </h2>
        <div v-if="category.moduleSelectionEnabled">
          <div v-for="module in category.modules" :key="module.id">
            <input
              type="checkbox"
              :id="module.id"
              :value="module.id"
              v-model="form.modules"
            />
            <label :for="module.id">{{ module.id }} {{ module.name }}</label>
          </div>
        </div>
        <div v-else>
          <div v-for="module in category.modules" :key="module.id">
            <input
              type="checkbox"
              :id="module.id"
              :value="module.id"
              disabled
              checked
            />
            <label :for="module.id">{{ module.id }} {{ module.name }}</label>
          </div>
        </div>
      </div>
      <div>{{ form.modules }}</div>

      <HfHButton>Weiter</HfHButton>
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
    this.form.modules = this.categories
      .filter((category) => category.moduleSelectionEnabled)
      .reduce((acc, cur) => {
        cur.modules.forEach((module) => {
          if (
            this.planResource.data.modules.some(
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
    categories() {
      return this.categoriesResource.data;
    },
  },
  methods: {
    save() {
      this.form.put(
        `/planers/${this.planerSlug}/plans/${this.planResource.data.slug}/module`,
        {
          onSuccess: () => this.form.reset(),
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>