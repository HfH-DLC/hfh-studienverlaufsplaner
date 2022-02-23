<template>
  <td>
    <div class="min-h-16 relative p-1">
      <button
        ref="button"
        v-if="placement"
        :id="`module-${placement.moduleId}`"
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
      <button
        v-if="placement && placement.module.selected"
        class="
          -bottom-8
          right-2
          flex
          justify-center
          items-center
          p-2
          rounded-full
          absolute
          z-10
          bg-gray-700
          text-white
          hover:bg-gray-900
          focus:bg-gray-900
          shadow
        "
        @click="removeModule(placement)"
      >
        <div class="sr-only">Modul entfernen</div>
        <TrashIcon class="w-4 h-4" />
      </button>
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
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/vue/outline";
import { mapActions } from "vuex";
export default {
  components: {
    CheckCircleIcon,
    XCircleIcon,
    TrashIcon,
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
    ...mapActions([
      "removeModule",
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