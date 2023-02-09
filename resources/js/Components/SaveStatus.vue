<template>
  <div class="flex gap-1 items-center" :class="messageClass">
    <CheckCircleIcon
      class="inline-block w-5 h-5 shrink-0 text-green-700"
      v-if="saved"
    />
    <XCircleIcon
      class="inline-block w-5 h-5 shrink-0 text-thunderbird-red"
      v-if="error"
    />
    <div
      v-if="saving"
      class="
        w-5
        h-5
        border-2 border-transparent border-t-thunderbird-red
        rounded-full
        animate-spin
      "
    ></div>
    {{ message }}
  </div>
</template>

<script>
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/outline";
import {
  SAVE_STATUS_SAVED,
  SAVE_STATUS_SAVING,
  SAVE_STATUS_ERROR,
} from "../constants";

export default {
  components: {
    CheckCircleIcon,
    XCircleIcon,
  },
  props: {
    saveStatus: {
      type: String,
      required: true,
    },
  },
  computed: {
    saved() {
      return this.saveStatus == SAVE_STATUS_SAVED;
    },
    saving() {
      return this.saveStatus == SAVE_STATUS_SAVING;
    },
    error() {
      return this.saveStatus == SAVE_STATUS_ERROR;
    },
    message() {
      if (this.saving) {
        return "Wird gespeichert...";
      }
      if (this.saved) {
        return "Gespeichert";
      }
      if (this.error) {
        return "Nicht gespeichert";
      }
      return "";
    },
    messageClass() {
      if (this.saving) {
        return "";
      }
      if (this.saved) {
        return "text-green-700";
      }
      if (this.error) {
        return "text-thunderbird-red";
      }
      return "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
