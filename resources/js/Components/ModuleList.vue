<template>
  <div>
    <HfhAccordion
      v-for="(category, index) in filteredCategories"
      :key="category.id"
      :open="currentOpen === index"
      @opened="currentOpen = index"
      @closed="currentOpen == index && (currentOpen = -1)"
    >
      <template v-slot:title>
        {{ category.name }}
      </template>
      <template v-slot:content>
        <ul>
          <li v-for="module in category.modules" :key="module.id">
            <Module :module="module" />
          </li>
        </ul>
      </template>
    </HfhAccordion>
  </div>
</template>

<script>
import { ChevronUpIcon, CheckCircleIcon } from "@heroicons/vue/outline";
import { HfhAccordion } from "@hfh-dlc/hfh-styleguide";
import Module from "../Components/Module.vue";
import { mapGetters, mapState } from "vuex";
export default {
  components: {
    HfhAccordion,
    CheckCircleIcon,
    ChevronUpIcon,
    Module,
  },
  props: {
    hashModuleId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentOpen: 0,
    };
  },
  computed: {
    ...mapState("schedule", ["locations"]),
    ...mapGetters("schedule", [
      "categories",
      "selectableLocations",
      "checkedLocations",
    ]),
    filteredCategories() {
      return this.categories.map((category) => ({
        ...category,
        modules: category.modules
          .filter((module) =>
            module.events.some((event) =>
              this.checkedLocations.includes(event.location)
            )
          )
          .map((module) => ({
            ...module,
            events: module.events.filter((event) =>
              this.checkedLocations.includes(event.location)
            ),
          })),
      }));
    },
  },
  methods: {
    openActiveAccordion(moduleId) {
      if (moduleId) {
        const index = this.categories.findIndex((category) =>
          category.modules.some((module) => module.id == moduleId)
        );
        if (index > -1) {
          this.currentOpen = index;
        }
      }
    },
  },
  watch: {
    hashModuleId(newValue) {
      this.openActiveAccordion(newValue);
    },
  },
};
</script>

<style lang="scss" scoped></style>
