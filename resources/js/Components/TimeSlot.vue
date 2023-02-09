<template>
  <div
    class="min-h-16 h-full relative p-1 flex flex-col gap-y-2 justify-center"
  >
    <template v-if="placement">
      <button
        ref="placement"
        class="
          placement
          text-sm text-left
          disabled:cursor-default
          w-full
          p-4
          border border-gray-300
          rounded
          'bg-gray-50'
          transition-all
        "
        :class="{
          'slot--invalid': invalidPlacement,
        }"
        @click="onModuleClick"
      >
        <div class="flex items-start">
          <XCircleIcon
            v-if="invalidPlacement"
            class="text-red-600 mr-2 w-5 h-5 shrink-0"
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
        v-if="!readOnly && placement.module.selected"
        :placement="placement"
      />
    </template>
    <div
      v-else-if="!readOnly && filteredEvents.length > 0"
      class="flex flex-wrap gap-2"
    >
      <template v-for="event in filteredEvents" :key="event.id">
        <button
          ref="slot"
          class="
            slot
            text-sm text-left
            disabled:cursor-default
            w-full
            p-4
            border border-gray-300
            rounded
            bg-white
            transition-all
            shadow-inner
            grow-1
            shrink-1
            min-w-content
          "
          :class="event.valid ? 'slot--valid' : 'slot--invalid'"
          @click="onPlaceModule(event)"
        >
          <span class="hfh-sr-only">Modul platzieren</span>
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
    <div
      v-else-if="Object.entries(availableModulesGroupedByLocations).length > 0"
      class="flex justify-center items-center h-full"
    >
      <button
        class="p-2 grid place-items-center gap-1 hover:text-thunderbird-red"
        @click="openDialog"
      >
        <InformationCircleIcon
          class="w-5 h-5 text-gray-600"
          aria-hidden="true"
        />
        <span class="sr-only">Verfügbare Module anzeigen</span>
      </button>
      <HfhDialog
        v-if="isDialogVisible"
        :open="isDialogVisible"
        title="Verfügbare Module"
        @closed="onDialogClosed"
      >
        <div
          v-for="entry in Object.entries(availableModulesGroupedByLocations)"
          :key="entry[0]"
          class="mb-4"
        >
          <h3 class="mb-2">Standort {{ locationById(entry[0]).name }}</h3>
          <ul>
            <li v-for="module in entry[1]" :key="module.id">
              {{ module.id }} {{ module.name }}
            </li>
          </ul>
        </div>
      </HfhDialog>
    </div>
  </div>
</template>

<script>
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/outline";
import { mapActions, mapState } from "pinia";
import { useScheduleStore } from "../Store/schedule";
import { isSameDate } from "../helpers.js";
import HfhDialog from "./HfhDialog.vue";

import ContextMenu from "./ContextMenu.vue";
export default {
  components: {
    ContextMenu,
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    HfhDialog,
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
    availableModulesGroupedByLocations: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isDialogVisible: false,
    };
  },
  methods: {
    ...mapActions(useScheduleStore, [
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
      if (this.$refs.slot) {
        if (Array.isArray(this.$refs.slot) && this.$refs.slot.length > 0) {
          this.$refs.slot[0].focus();
        } else {
          this.$refs.slot.focus();
        }
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
    openDialog() {
      this.isDialogVisible = true;
    },
    onDialogClosed() {
      this.isDialogVisible = false;
    },
  },
  computed: {
    ...mapState(useScheduleStore, ["locations", "readOnly"]),
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
.placement:focus,
.slot:focus {
  outline: 2px solid var(--c-blue);
  outline-offset: 0;
}
</style>
