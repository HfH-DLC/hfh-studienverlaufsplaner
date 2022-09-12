<template>
  <HfhHeaderBar>
    <template v-slot:right>
      <div class="px-4 py-3 leading-4">
        <a
          class="hover:text-thunderbird-red"
          href="https://hfh.ch"
          rel="noopener noreferer"
          target="_blank"
          >hfh.ch</a
        >
      </div>
    </template>
  </HfhHeaderBar>
  <div class="flex justify-between px-4 pt-4 pb-4">
    <div class="flex gap-x-8 items-center">
      <HfhLogo />
      <div>
        <div class="text-xl">
          Studienverlaufsplaner
          <span v-if="name">{{ name }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="p-4 max-w-6xl mx-auto">
    <h2 class="text-2xl mt-4 mb-4">Willkommen!</h2>
    <HtmlContent :content="infoTemplate" />
    <div class="py-8">
      <div>
        <h2 class="text-xl">Ich möchte einen neuen Plan erstellen.</h2>
        <div>
          <form @submit.prevent="createPlan" class="mt-2 w-64">
            <HfhInput
              class="w-full"
              v-model="createForm.email"
              id="email"
              type="email"
              label="E-Mail"
              :required="true"
            />
            <HfhSelect
              class="w-full mt-4"
              id="plan-start-year"
              label="Jahr"
              v-model="createForm.startYear"
              :required="true"
              :options="yearOptions"
              defaultOption="Bitte wählen..."
            >
            </HfhSelect>
            <div v-if="createForm.errors.startYear">
              {{ createForm.errors.startYear }}
            </div>
            <HfhButton :type="submit" :animated="true" class="w-full mt-4"
              >Plan erstellen</HfhButton
            >
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  HfhButton,
  HfhHeaderBar,
  HfhInput,
  HfhLogo,
  HfhSelect,
} from "@hfh-dlc/hfh-styleguide";
import HtmlContent from "../Components/HtmlContent.vue";
export default {
  components: {
    HfhButton,
    HfhHeaderBar,
    HfhInput,
    HfhLogo,
    HfhSelect,
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
      yearOptions: [{ label: "2022", value: 2022 }],
    };
  },
  methods: {
    createPlan() {
      this.createForm.post(`/${this.slug}/plans`, {
        onSuccess: () => this.createForm.reset(),
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
