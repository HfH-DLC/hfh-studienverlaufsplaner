<template>
  <td>
    <div v-if="timeSlot" class="min-h-16 relative p-1">
      <button
        ref="button"
        v-if="timeSlot.module"
        :id="`module-${timeSlot.module.id}`"
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
          'slot--invalid': invalid,
        }"
        @click="onModuleClick"
      >
        <span v-if="timeSlot.module">
          <XCircleIcon
            v-if="invalid"
            class="text-red-600 inline-block mr-2 w-5 h-5"
          />
          <span>{{ timeSlot.module.number }} {{ timeSlot.module.name }}</span>
        </span>
      </button>
      <button
        v-if="
          timeSlot.module && timeSlot.module.selected && timeSlot.module.placed
        "
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
        @click="removeModule(timeSlot.id)"
      >
        <div class="sr-only">Modul entfernen</div>
        <TrashIcon class="w-4 h-4" />
      </button>
      <button
        ref="button"
        v-if="timeSlot.selectable"
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
          slot--selectable
        "
        @click="onClick"
      >
        <span>
          <CheckCircleIcon class="text-green-700 w-5 h-5" />
        </span>
      </button>
      <button
        v-if="!timeSlot.module && invalid"
        ref="button"
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
          slot--invalid
        "
        @click="onClick"
      >
        <XCircleIcon class="text-red-600 inline-block mr-2 w-5 h-5" />
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
    timeSlot: {
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
      if (this.timeSlot.module.selected) {
        this.deselectModule();
      } else {
        this.selectModule(this.timeSlot.module.id);
      }
    },
    onClick() {
      this.placeModule(this.timeSlot.id);
    },
    focusButton() {
      this.$refs.button.focus();
    },
  },
  computed: {
    invalid() {
      return (
        (this.timeSlot.errors && this.timeSlot.errors.length > 0) ||
        (this.timeSlot.dateAllowed &&
          !this.timeSlot.module &&
          !this.timeSlot.selectable)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.slot--invalid {
  @apply bg-red-50 text-red-600;
}
.slot--selectable {
  @apply bg-green-50;
}
</style>