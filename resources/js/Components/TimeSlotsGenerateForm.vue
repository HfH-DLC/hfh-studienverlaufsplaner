<template>
  <form @submit.prevent="processForm">
    <label for="start-year" class="block uppercase text-sm">Start-Jahr</label>
    <input
      ref="firstInput"
      type="number"
      id="start-year"
      v-model="form.startYear"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.startYear && 'error-start-year'"
    />
    <Error id="error-start-year" class="mt-2" v-if="form.errors.startYear">
      {{ form.errors.startYear }}
    </Error>

    <label for="end-year" class="block uppercase text-sm">End-Jahr</label>
    <input
      ref="firstInput"
      type="number"
      id="end-year"
      v-model="form.endYear"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.endYear && 'error-end-year'"
    />
    <Error id="error-end-year" class="mt-2" v-if="form.errors.endYear">
      {{ form.errors.endYear }}
    </Error>
    <button
      type="submit"
      :disabled="form.processing"
      class="w-full mt-3 rounded p-2 bg-gray-700 text-white hover:bg-gray-900"
    >
      Termine Generieren
    </button>
  </form>
</template>

<script>
import Error from "./Error.vue";
export default {
  emits: ["success"],
  props: {
    planerSlug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: this.$inertia.form({
        startYear: "",
        endYear: "",
      }),
    };
  },
  components: {
    Error,
  },
  methods: {
    processForm() {
      this.form.post(`/admin/planers/${this.planerSlug}/timeslots/generate`, {
        onSuccess: () => this.$emit("success"),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>