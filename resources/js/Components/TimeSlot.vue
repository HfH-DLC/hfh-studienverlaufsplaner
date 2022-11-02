<template>
  <div class="min-h-16 relative p-1 flex flex-col gap-y-2">
    <template v-if="placement">
      <button
        ref="placement"
        class="
          text-sm text-left
          disabled:cursor-default
          w-full
          p-4
          border border-gray-300
          rounded
          'bg-gray-50'
          transition-all
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
        :class="{
          'slot--invalid': invalidPlacement,
        }"
        @click="onModuleClick"
      >
        <div class="flex items-start">
          <XCircleIcon
            v-if="invalidPlacement"
            class="text-red-600 mr-2 w-5 h-5"
          />
          <div class="overflow-hidden">
            <div class="truncate">
              {{ placement.module.id }} {{ placement.module.name }}
            </div>
            <div v-if="showLocation">
              Standort: {{ locationById(placement.location).name }}
            </div>
          </div>
        </div>
      </button>
      <ContextMenu
        class="absolute -bottom-8 right-2"
        v-if="placement.module.selected"
        :placement="placement"
      />
    </template>
    <div v-if="filteredEvents.length > 0" class="flex flex-wrap gap-2">
      <template v-for="event in filteredEvents" :key="event.id">
        <button
          ref="slot"
          class="
            text-sm text-left
            disabled:cursor-default
            w-full
            p-4
            border border-gray-300
            rounded
            bg-white
            transition-all
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            shadow-inner
            grow-1
            shrink-1
            min-w-content
          "
          :class="event.valid ? 'slot--valid' : 'slot--invalid'"
          @click="onPlaceModule(event)"
        >
          <span class="flex items-center gap-x-2">
            <CheckCircleIcon
              v-if="event.valid"
              class="text-green-700 w-5 h-5 shrink-0"
            />
            <XCircleIcon v-else class="text-red-600 w-5 h-5 shrink-0" />
            <span v-if="showLocation"
              >Standort: {{ locationById(event.location).name }}</span
            >
          </span>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/outline";
import { mapActions, mapGetters, mapState } from "vuex";
import { isSameDate } from "../helpers.js";

import ContextMenu from "./ContextMenu.vue";
export default {
  components: {
    ContextMenu,
    CheckCircleIcon,
    XCircleIcon,
  },
  props: {
    events: {
      type: Array,
      default: [],
    },
    placement: {
      type: Object,
      default: null,
    },
    showLocation: {
      type: Boolean,
      required: true,
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
    onPlaceModule(event) {
      this.placeModule(event);
    },
    focusPlacement() {
      this.$refs.placement.focus();
    },
    focusSlot() {
      if (this.$refs.slot.length > 0) {
        this.$refs.slot[0].focus();
      }
    },
    placementMatchesEvent(placement, event) {
      return (
        isSameDate(placement, event) && placement.location == event.location
      );
    },
    locationById(id) {
      const location = this.locations.find((location) => location.id == id);
      return location;
    },
  },
  computed: {
    ...mapState("schedule", ["locations"]),
    invalidPlacement() {
      return this.placement.errors && this.placement.errors.length > 0;
    },
    filteredEvents() {
      return this.events.filter((event) => {
        const isActiveLocation = this.locations
          .filter((location) => location.checked)
          .map((location) => location.id)
          .includes(event.location);

        const isCurrent = this.placement
          ? this.placementMatchesEvent(this.placement, event)
          : false;
        return isActiveLocation && !isCurrent;
      });
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
