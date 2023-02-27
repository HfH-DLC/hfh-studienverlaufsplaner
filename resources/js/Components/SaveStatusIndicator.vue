<template>
  <div class="flex gap-1 items-center" :class="messageClass">
    <CheckCircleIcon class="inline-block w-5 h-5 shrink-0 text-green-700" v-if="saved" />
    <XCircleIcon class="inline-block w-5 h-5 shrink-0 text-thunderbird-red" v-if="error" />
    <div v-if="saving" class="
        w-5
        h-5
        border-2 border-transparent border-t-thunderbird-red
        rounded-full
        animate-spin
      "></div>
    {{ message }}
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import { SaveStatus } from "@/types";

export default {
  components: {
    CheckCircleIcon,
    XCircleIcon,
  },
  props: {
    saveStatus: {
      type: Number as PropType<SaveStatus>,
      required: true,
    },
  },
  computed: {
    saved() {
      return this.saveStatus == SaveStatus.Saved;
    },
    saving() {
      return this.saveStatus == SaveStatus.Saving;
    },
    error() {
      return this.saveStatus == SaveStatus.Error;
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

<style lang="scss" scoped>

</style>
