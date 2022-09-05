<template>
  <nav class="flex justify-between items-end p-4 border-b border-gray-300">
    <h1 class="text-xl">
      Studienverlaufsplaner
      <span v-if="name">{{ name }}</span>
    </h1>
  </nav>
  <div class="p-4 max-w-6xl mx-auto">
    <h2 class="text-2xl mt-4 mb-4">Willkommen!</h2>
    <HtmlContent :content="infoTemplate" />
    <div class="py-8">
      <div>
        <h2 class="text-xl">Ich möchte einen neuen Plan erstellen.</h2>
        <div>
          <form @submit.prevent="createPlan" class="mt-2 w-64">
            <label for="email" class="text-sm">E-Mail</label>
            <input
              v-model="createForm.email"
              type="email"
              name="email"
              id="email"
              required
              class="
                leading-4
                w-full
                block
                border border-gray-600
                rounded
                shadow-inner
                p-2
                mb-2
              "
            />
            <label for="year" class="text-sm">Jahr</label>
            <select
              v-model="createForm.startYear"
              required
              class="
                block
                border border-gray-600
                rounded
                shadow-inner
                p-2
                w-full
              "
            >
              <option value="" disabled>Bitte wählen...</option>
              <option :value="2022">2022</option>
            </select>
            <div v-if="createForm.errors.startYear">
              {{ createForm.errors.startYear }}
            </div>
            <HfHButton class="w-full mt-4">Plan erstellen</HfHButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HfHButton from "../Components/HfHButton.vue";
import HtmlContent from "../Components/HtmlContent.vue";
export default {
  components: {
    HfHButton,
    HtmlContent,
  },
  props: {
    slug: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    infoTemplate: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      createForm: this.$inertia.form({
        email: "",
        startYear: "",
      }),
      planSlug: "",
    };
  },
  methods: {
    createPlan() {
      this.createForm.post(`/${this.slug}/plans`, {
        onSuccess: () => this.createForm.reset(),
      });
    },
    viewPlan() {
      this.$inertia.get(`/${this.slug}/${this.planSlug}`);
    },
  },
};
</script>

<style lang="scss" scoped></style>
