<template>
  <Disclosure
    v-for="(category, index) in categories"
    :key="category.id"
    as="div"
    class="mb-4 border border-gray-300 rounded"
    v-slot="{ open }"
    :defaultOpen="index == 0"
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
        rounded-t
        focus:outline-none focus:ring-2 focus:ring-indigo-600
      "
      :class="{ 'border-b': open, 'rounded-b': !open }"
    >
      <h2>
        {{ category.name }}
        <span class="whitespace-nowrap"
          >({{ category.placedNumber }} / {{ category.requiredNumber }})</span
        >
      </h2>
      <ChevronUpIcon
        :class="open ? 'transform rotate-180' : ''"
        class="w-5 h-5 transition"
      />
    </DisclosureButton>
    <DisclosurePanel class="p-4">
      <ul>
        <li v-for="module in category.modules" :key="module.id">
          <Module
            :module="module"
            :disabled="
              category.placedNumber === category.requiredNumber ||
              !module.selectable
            "
          />
        </li>
      </ul>
    </DisclosurePanel>
  </Disclosure>
</template>

<script>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/outline";
import Module from "../Components/Module.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    ChevronUpIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Module,
  },
  computed: {
    ...mapGetters(["categories"]),
  },
};
</script>

<style lang="scss" scoped>
</style>