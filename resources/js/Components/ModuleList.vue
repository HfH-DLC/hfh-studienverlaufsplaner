<template>
  <div class="pb-4">
    <HfhAccordion
      v-for="(category, index) in filteredCategories"
      :key="category.id"
      :open="currentOpen === index"
      @opened="currentOpen = index"
      @closed="currentOpen == index && (currentOpen = -1)"
      :ref="setCategoryRef"
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
import { mapActions, mapState } from "pinia";
import { useScheduleStore } from "../Store/schedule";
export default {
  components: {
    HfhAccordion,
    CheckCircleIcon,
    ChevronUpIcon,
    Module,
  },
  data() {
    return {
      categoryRefs: [],
      currentOpen: 0,
    };
  },
  mounted() {
    this.$emitter.on("focus-category", this.focusCategory);
    this.$emitter.on("focus-module", this.openCategoryByModule);
  },
  beforeUnmount() {
    this.$emitter.off("focus-category", this.focusCategory);
    this.$emitter.on("focus-module", this.openCategoryByModule);
  },
  computed: {
    ...mapState(useScheduleStore, [
      "locations",
      "categories",
      "selectableLocations",
      "checkedLocations",
    ]),
    filteredCategories() {
      return this.categories
        .map((category) => ({
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
        }))
        .filter((category) => category.modules.length > 0);
    },
  },
  methods: {
    ...mapActions(useScheduleStore, ["deselectModule"]),
    openActiveAccordion(index) {
      if (index > -1) {
        this.currentOpen = index;
      }
    },
    setCategoryRef(el) {
      if (el) {
        this.categoryRefs.push(el);
      }
    },
    openCategoryByModule(moduleId) {
      const index = this.filteredCategories.findIndex((category) =>
        category.modules.some((module) => module.id == moduleId)
      );
      if (index >= 0) {
        this.openActiveAccordion(index);
      }
    },
    focusCategory(categoryId) {
      const index = this.filteredCategories.findIndex(
        (category) => category.id == categoryId
      );
      if (index >= 0) {
        this.deselectModule();
        this.openActiveAccordion(index);
        this.$nextTick(() => {
          const ref = this.categoryRefs[index];
          const summary = ref.$el.querySelector("summary");
          if (summary) {
            summary.focus();
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
