<template>
  <div
    v-if="message"
    class="rounded-md p-1 w-fit flex justify-between gap-4 items-center"
    :class="typeClasses"
    role="alert"
  >
    <span>{{ message }}</span>
    <button v-if="actionMessage && actionEvent" @click="onCallback">
      {{ actionMessage }}
    </button>
    <button @click="onClose">
      <XIcon class="w-5 h-5" aria-hidden="true" /><span class="sr-only"
        >Nachricht schliessen</span
      >
    </button>
  </div>
</template>

<script>
import flashTypes from "../flashTypes";
import { XIcon } from "@heroicons/vue/outline";
export default {
  components: {
    XIcon,
  },
  created() {
    this.$emitter.on("flash", this.flash);
  },
  beforeDestroy() {
    this.$emitter.off("flash", this.flash);
  },
  data() {
    return {
      type: null,
      message: null,
      actionMessage: null,
      actionEvent: null,
    };
  },
  methods: {
    flash(event) {
      this.type = event.type;
      this.message = event.message;
      this.actionMessage = event.actionMessage;
      this.actionEvent = event.actionEvent;
    },
    onClose() {
      this.type = null;
      this.message = null;
      this.actionMessage = null;
      this.actionEvent = null;
    },
    onCallback() {
      if (this.actionEvent) {
        this.onClose();
        this.$emitter.emit(this.actionEvent);
      }
    },
  },
  computed: {
    typeClasses() {
      switch (this.type) {
        case flashTypes.ERROR: {
          return "bg-red-50 text-red-600 border border-red-300";
        }
        case flashTypes.SUCCESS: {
          return "bg-green-50 text-green-600 border border-green-300";
        }
        default:
          return "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>