<template>
  <div>
    <Accordion
      v-for="(category, index) in categories"
      :key="category.id"
      :open="currentOpen === index"
      @opened="currentOpen = index"
      @closed="currentOpen = -1"
    >
      <template v-slot:title>
        <h2 class="flex items-center justify-between gap-2">
          <div>{{ category.name }}</div>
        </h2>
        <ChevronUpIcon
          :class="currentOpen === index ? 'transform rotate-180' : ''"
          class="w-5 h-5 transition"
        />
      </template>
      <template v-slot:content>
        <ul>
          <li v-for="module in category.modules" :key="module.id">
            <Module
              :module="module"
              :disabled="
                !module.placement &&
                !!category.maxECTS &&
                category.currentECTS >= category.maxECTS
              "
            />
          </li>
        </ul>
      </template>
    </Accordion>
  </div>
</template>

<script>
import { ChevronUpIcon, CheckCircleIcon } from "@heroicons/vue/outline";
import Module from "../Components/Module.vue";
import Accordion from "../Components/Accordion.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Accordion,
    CheckCircleIcon,
    ChevronUpIcon,
    Module,
  },
  data() {
    return {
      currentOpen: 0,
    };
  },
  computed: {
    ...mapGetters("schedule", ["categories"]),
  },
  mounted() {
    this.openActiveAccordion(window.location.hash);
    window.onhashchange = (event) => {
      this.openActiveAccordion(new URL(event.newURL).hash);
    };
  },
  beforeUnmount() {
    window.onhashchange = null;
  },
  methods: {
    openActiveAccordion(hash) {
      if (hash && hash.startsWith("#module-")) {
        const moduleId = hash.slice("#module-".length);
        const index = this.categories.findIndex((category) =>
          category.modules.some((module) => module.id == moduleId)
        );
        if (index > -1) {
          this.currentOpen = index;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
