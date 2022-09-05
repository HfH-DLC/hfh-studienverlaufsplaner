<template>
  <td>
    <div class="min-h-16 relative p-1">
      <button
        ref="button"
        v-if="placement"
        class="
          text-sm text-left
          disabled:cursor-default
          w-full
          p-4
          border border-gray-300
          rounded
          'bg-gray-50'
          transition-all
          truncate
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
        :class="{
          'slot--invalid': invalidPlacement,
        }"
        @click="onModuleClick"
      >
        <XCircleIcon
          v-if="invalidPlacement"
          class="text-red-600 inline-block mr-2 w-5 h-5"
        />
        <span>{{ placement.module.id }} {{ placement.module.name }}</span>
      </button>
      <ContextMenu
        class="absolute -bottom-8 right-2"
        v-if="placement && placement.module.selected"
        :placement="placement"
      />
      <button
        ref="button"
        v-if="event && !placement"
        class="
          text-sm text-left
          disabled:cursor-default
          w-full
          p-4
          border border-gray-300
          rounded
          bg-white
          transition-all
          truncate
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          shadow-inner
        "
        :class="event.valid ? 'slot--valid' : 'slot--invalid'"
        @click="onPlaceModule"
      >
        <span>
          <CheckCircleIcon v-if="event.valid" class="text-green-700 w-5 h-5" />
          <XCircleIcon v-else class="text-red-600 inline-block mr-2 w-5 h-5" />
        </span>
      </button>
    </div>
  </td>
</template>

<script>
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/outline";
import { mapActions } from "vuex";

import ContextMenu from "./ContextMenu.vue";
export default {
  components: {
    ContextMenu,
    CheckCircleIcon,
    XCircleIcon,
  },
  props: {
    event: {
      type: Object,
      default: null,
    },
    placement: {
      type: Object,
      default: null,
    },
  },
  methods: {
    ...mapActions("schedule", [
      "placeModule",
      "selectModule",
      "deselectModule",
    ]),
    onModuleClick() {
      if (this.placement.module.selected) {
        this.deselectModule();
      } else {
        this.selectModule(this.placement.module.id);
      }
    },
    onPlaceModule() {
      this.placeModule(this.event);
    },
    focusButton() {
      this.$refs.button.focus();
    },
  },
  computed: {
    invalidPlacement() {
      return this.placement.errors && this.placement.errors.length > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.slot--invalid {
  @apply bg-red-50 text-red-600;
}
.slot--valid {
  @apply bg-green-50;
}
</style>
