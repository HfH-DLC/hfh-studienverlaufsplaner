<template>
  <AppHead />
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
      <div class="text-2xl">Studienverlaufsplaner</div>
    </div>
  </div>
  <div class="p-4 max-w-container mx-auto">
    <h1>Willkommen!</h1>
    <p>Bitte wählen Sie einen Studiengang.</p>
    <ul class="mt-4 grid grid-cols-2 gap-8">
      <li v-for="planer in planers" :key="planer.id">
        <HfhLink :href="planer.slug" component="Link"
          ><HfhTeaser>{{ planer.name }}</HfhTeaser></HfhLink
        >
      </li>
    </ul>
  </div>
</template>

<script>
import {
  HfhButton,
  HfhHeaderBar,
  HfhInput,
  HfhLogo,
  HfhSelect,
  HfhLink,
  HfhTeaser,
} from "@hfh-dlc/hfh-styleguide";
import HtmlContent from "../Components/HtmlContent.vue";
export default {
  components: {
    HfhButton,
    HfhHeaderBar,
    HfhInput,
    HfhLink,
    HfhLogo,
    HfhSelect,
    HtmlContent,
    HfhTeaser,
  },
  props: {
    planersResource: {
      type: Object,
      required: true,
    },
  },
  computed: {
    planers() {
      return this.planersResource.data;
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
