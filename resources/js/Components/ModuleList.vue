<template>
  <Disclosure
    v-for="category in categories"
    :key="category"
    as="div"
    class="mb-4 border border-gray-300 rounded overflow-hidden"
    v-slot="{ open }"
    :defaultOpen="dropdownStatus[category.name]"
  >
    <DisclosureButton
      class="
        flex
        justify-between
        items-center
        w-full
        px-4
        py-2
        text-left
        bg-gray-50
      "
      :class="{ 'border-b': open }"
      @click="toggleDropdownStatus(category.name)"
    >
      <div>
        {{ category.name }}
        <span class="whitespace-nowrap"
          >({{ category.placedNumber }} / {{ category.requiredNumber }})</span
        >
      </div>
      <ChevronUpIcon
        :class="open ? 'transform rotate-180' : ''"
        class="w-5 h-5 transition"
      />
    </DisclosureButton>
    <DisclosurePanel class="p-4">
      <ul>
        <li v-for="module in category.modules" :key="module.id">
          <Module
            @click="$emit('selected', module)"
            :module="module"
            :disabled="
              category.placedNumber === category.requiredNumber ||
              !module.selectable
            "
            :selected="module.id == selectedModuleId"
          />
        </li>
      </ul>
    </DisclosurePanel>
  </Disclosure>
</template>

<script>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/solid";
import Module from "../Components/Module.vue";
export default {
  components: {
    ChevronUpIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Module,
  },
  emits: ["selected"],
  props: {
    categories: {
      type: Array,
      required: true,
    },
    selectedModuleId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      dropdownStatus: this.categories.reduce((acc, category, index) => {
        acc[category.name] = index == 0;
        return acc;
      }, {}),
    };
  },

  methods: {
    toggleDropdownStatus(categoryName) {
      this.dropdownStatus[categoryName] = !this.dropdownStatus[categoryName];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>