<template>
  <main class="p-4 max-w-6xl mx-auto">
    <h1 class="text-3xl mt-4 mb-2">Studienschwerpunkte</h1>
    <form @submit.prevent="save" class="mt-4">
      <div>
        <label for="firstFocus">Erster Studienschwerpunkt</label>
        <HfHSelect
          name="firstFocus"
          id="firstFocus"
          v-model="form.firstFocus"
          :required="true"
          :options="firstOptions"
        />
      </div>
      <div class="mt-4" v-if="form.firstFocus">
        {{
          this.fociResource.data
            .find((focus) => focus.id === form.firstFocus)
            .modules.map((module) => module.name)
        }}
      </div>
      <div class="mt-4">
        <label for="secondFocus">Zweiter Studienschwerpunkt</label>
        <HfHSelect
          name="secondFocus"
          id="secondFocus"
          v-model="form.secondFocus"
          :options="secondOptions"
        />
      </div>
      <div class="mt-4" v-if="form.secondFocus">
        {{
          this.fociResource.data
            .find((focus) => focus.id === form.secondFocus)
            .modules.map((module) => module.name)
        }}
      </div>
      <HfHButton class="w-full mt-3">Weiter</HfHButton>
    </form>
  </main>
</template>

<script>
import HfHSelect from "../Components/HfHSelect.vue";
import HfHButton from "../Components/HfHButton.vue";
export default {
  components: {
    HfHSelect,
    HfHButton,
  },
  props: {
    fociResource: {
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
        firstFocus: this.planResource.data.firstFocus
          ? this.planResource.data.firstFocus.id
          : "",
        secondFocus: this.planResource.data.secondFocus
          ? this.planResource.data.secondFocus.id
          : "",
      }),
    };
  },
  computed: {
    focusOptions() {
      return this.fociResource.data.map((focus) => ({
        value: focus.id,
        label: focus.name,
      }));
    },
    firstOptions() {
      return this.focusOptions.filter((option) => {
        if (this.form.secondFocus) {
          if (this.form.secondFocus == option.value) {
            return false;
          }
        }
        return true;
      });
    },
    secondOptions() {
      return this.focusOptions.filter((option) => {
        if (this.form.firstFocus) {
          if (this.form.firstFocus == option.value) {
            return false;
          }
        }
        return true;
      });
    },
  },
  methods: {
    save() {
      this.form.put(
        `/${this.planerSlug}/${this.planResource.data.slug}/schwerpunkte`,
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