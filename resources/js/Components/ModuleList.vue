<template>
  <Accordion
    v-for="(category, index) in categories"
    :key="category.id"
    :open="currentOpen === index"
    @opened="currentOpen = index"
    @closed="currentOpen = -1"
  >
    <template v-slot:title>
      <h2
        class="flex items-center justify-between gap-2"
        :class="{
          'text-green-700': category.placedNumber === category.requiredNumber,
        }"
      >
        <CheckCircleIcon
          v-if="category.placedNumber === category.requiredNumber"
          class="text-green-700 w-5 h-5"
        />
        <div>{{ category.name }}</div>
        <div class="whitespace-nowrap">
          ({{ category.placedNumber }}/{{ category.requiredNumber }})
        </div>
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
              category.placedNumber === category.requiredNumber
            "
          />
        </li>
      </ul>
    </template>
  </Accordion>
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
};
</script>

<style lang="scss" scoped>
</style>