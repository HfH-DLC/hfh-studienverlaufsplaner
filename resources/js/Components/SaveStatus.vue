<template>
  <div class="flex gap-1 items-center" :class="messageClass">
    <CheckCircleIcon
      class="inline-block w-5 h-5 shrink-0 text-green-700"
      v-if="saved"
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
import { mapState } from "pinia";
import { useScheduleStore } from "../Store/schedule";
import { CheckCircleIcon } from "@heroicons/vue/outline";
import {
  SAVE_STATUS_SAVED,
  SAVE_STATUS_SAVING,
  SAVE_STATUS_ERROR,
} from "../constants";

export default {
  components: {
    CheckCircleIcon,
  },
  computed: {
    ...mapState(useScheduleStore, ["saveStatus"]),
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
      return "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
