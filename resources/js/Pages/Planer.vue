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
  <div class="p-4 max-w-container mx-auto content">
    <h1 class="mt-4">Willkommen!</h1>
    <p>
      Hier können Sie Ihren gewünschten Studienverlauf über alle Semester
      planen. Der zusammengestellte Plan dient als Orientierung! Die HfH behält
      sich vor, Module bei zu geringer Nachfrage abzusagen.
    </p>
    <p>
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

    <h2>Wichtig</h2>
    <p>
      Unabhängig vom Studienverlaufsplaner müssen Sie ihre Module offiziell in
      daylight-Web buchen. Sie erhalten eine separate Info per Mail von der
      Hochschuladministration.
    </p>

    <h2>Nutzung des Studienverlaufsplaners</h2>
    <p>
      Falls Sie bereits einen Plan erstellt haben, haben wir Ihnen eine E-Mail
      geschickt. Darin finden Sie die den Link zu Ihrem aktuellen
      HfH-Studienverlaufsplan.
    </p>

    <div>
      <h2>Ich möchte einen neuen Plan erstellen.</h2>
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
          <HfhButton type="submit" :animated="true" class="w-full mt-8"
            >Plan erstellen</HfhButton
          >
        </form>
      </div>
    </div>

    <p class="text-sm mt-8">
      {{ new Date().toLocaleDateString() }}, Änderungen vorbehalten.
    </p>
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

<style lang="scss" scoped>
h1 {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 2.25rem;
}
h2 {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}
p {
  margin-bottom: 1.5rem;
}
</style>
