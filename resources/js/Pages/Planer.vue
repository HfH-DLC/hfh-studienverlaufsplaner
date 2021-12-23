<template>
  <div class="mt-20 w-full p-4 flex justify-around gap-4">
    <div>
      <h2 class="text-xl">Ich habe bereits einen Plan.</h2>
      <div class="w-64">
        <form @submit.prevent="viewPlan" class="mt-4">
          <label for="slug" class="text-sm uppercase">Plan-Nummer</label>
          <input
            type="text"
            name="slug"
            id="slug"
            class="w-full block border border-gray-600 rounded shadow-inner p-1"
            placeholder="X63p4Z"
            v-model="planSlug"
            required
          />
          <button
            class="
              w-full
              mt-3
              rounded
              p-2
              bg-gray-700
              text-white
              hover:bg-gray-900
            "
          >
            Anschauen
          </button>
        </form>
      </div>
    </div>
    <div>
      <h2 class="text-xl">Ich möchte einen neuen Plan erstellen.</h2>
      <div class="mt-4 w-64">
        <form @submit.prevent="createPlan">
          <label for="year" class="text-sm uppercase">Jahr</label>
          <select
            v-model="createForm.startYear"
            required
            class="block border border-gray-600 rounded shadow-inner p-2 w-full"
          >
            <option value="" disabled>Bitte wählen...</option>
            <option :value="2022">2022</option>
          </select>
          <div v-if="createForm.errors.startYear">
            {{ createForm.errors.startYear }}
          </div>
          <button
            class="
              w-full
              mt-3
              rounded
              p-2
              bg-gray-700
              text-white
              hover:bg-gray-900
            "
          >
            Plan erstellen
          </button>
        </form>
      </div>
    </div>
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
      createForm: this.$inertia.form({
        startYear: "",
      }),
      planSlug: "",
    };
  },
  methods: {
    createPlan() {
      this.createForm.post(`/planers/${this.slug}/plans`, {
        onSuccess: () => this.createForm.reset(),
      });
    },
    viewPlan() {
      this.$inertia.get(`/planers/${this.slug}/plans/${this.planSlug}`);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>