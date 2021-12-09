<template>
  <div class="w-32 mx-auto">
    <form @submit.prevent="createPlan">
      <label for="year" class="text-sm uppercase">Jahr</label>
      <select
        v-model="form.startYear"
        required
        class="block border border-gray-600 rounded shadow-inner p-1 w-full"
      >
        <option value="" disabled>Bitte wählen...</option>
        <option :value="2021">2021</option>
        <option :value="2022">2022</option>
        <option :value="2023">2023</option>
      </select>
      <div v-if="form.errors.startYear">{{ form.errors.startYear }}</div>
      <button class="mt-3 rounded p-2 border-2 border-black font-bold w-full">
        Plan erstellen
      </button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: this.$inertia.form({
        startYear: "",
      }),
    };
  },
  methods: {
    createPlan() {
      this.form.post(`/planers/${this.slug}/plans`, {
        onSuccess: () => this.form.reset(),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>