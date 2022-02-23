<template>
  <div
    v-if="message"
    class="
      z-20
      rounded-md
      py-1
      px-2
      gap-2
      w-fit
      flex
      justify-between
      items-center
      shadow-lg
    "
    :class="typeClasses"
    :role="typeRole"
  >
    <span>{{ message }}</span>
    <button
      ref="action"
      v-if="actionMessage && actionEvent"
      @click="onCallback"
      class="underline"
    >
      {{ actionMessage }}
    </button>
    <button ref="close" @click="onClose" aria-label="Nachricht schliessen">
      <XIcon class="w-5 h-5" aria-hidden="true" />
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
      this.$nextTick(() => {
        if (this.$refs.action) {
          this.$refs.action.focus();
        } else if (this.$refs.close) {
          this.$refs.close.focus();
        }
      });
    },
    onClose() {
      this.type = null;
      this.message = null;
      this.actionMessage = null;
      this.actionEvent = null;
    },
    onCallback() {
      if (this.actionEvent) {
        this.$emitter.emit(this.actionEvent);
        this.onClose();
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
    typeRole() {
      switch (this.type) {
        case flashTypes.ERROR: {
          return "alert";
        }
        default:
          return "status";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>