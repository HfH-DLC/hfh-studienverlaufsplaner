<template>
  <AppHead :planerName="name" />
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
  <div class="flex justify-between px-4 pt-4 pb-4 max-w-container mx-auto">
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
  <div class="p-4 max-w-container mx-auto">
    <h2 class="text-2xl mt-4 mb-4">Willkommen!</h2>
    <p>
      Hier können Sie Ihren gewünschten Studienverlauf über alle Semester
      planen. Der zusammengestellte Plan dient als Orientierung! Die HfH behält
      sich vor, Module bei zu geringer Nachfrage abzusagen.
    </p>
    <p class="mt-4">
      Bevor Sie loslegen, empfehlen wir Ihnen die
      <a
        class="font-bold text-thunderbird-red hover:underline focus:underline;"
        target="_blank"
        rel="noopener noreferrer"
        :href="brochureUrl"
        >Studienbroschüre</a
      >
      und das
      <a
        class="font-bold text-thunderbird-red hover:underline focus:underline;"
        target="_blank"
        rel="noopener noreferrer"
        :href="moduleDirectoryUrl"
      >
        Modulverzeichnis</a
      >.
    </p>

    <h3 class="text-xl mt-3 normal-case text-black">Wichtig</h3>
    <p class="mt-4">
      Unabhängig vom Studienverlaufsplaner müssen Sie ihre Module offiziell in
      daylight-Web buchen. Sie erhalten eine separate Info per Mail von der
      Hochschuladministration.
    </p>
    <p class="text-sm mt-4">
      {{ new Date().toLocaleDateString() }}, Änderungen vorbehalten.
    </p>

    <div class="py-8 flex justify-center">
      <div class="flex flex-col items-center">
        <h2 class="text-xl text-center">
          Ich möchte einen neuen Plan erstellen.
        </h2>
        <div>
          <form @submit.prevent="createPlan" class="mt-2 w-80">
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
            <HfhButton type="submit" :animated="true" class="w-full mt-4"
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
    brochureUrl: {
      type: String,
      required: true,
    },
    moduleDirectoryUrl: {
      type: String,
      required: true,
    },
    allowedYears: {
      type: Array,
    },
  },
  data() {
    return {
      createForm: this.$inertia.form({
        email: "",
        startYear: "",
      }),
      yearOptions: this.allowedYears.map((year) => ({
        label: year,
        value: year,
      })),
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
