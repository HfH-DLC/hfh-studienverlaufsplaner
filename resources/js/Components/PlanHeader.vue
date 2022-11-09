<template>
  <HfhHeaderBar class="print:hidden">
    <template v-slot:right>
      <div class="px-4 py-3 leading-4">
        <nav>
          <ul class="flex gap-x-4">
            <li v-if="moduleDirectoryUrl">
              <a
                class="hover:text-thunderbird-red"
                :href="moduleDirectoryUrl"
                rel="noopener noreferer"
                target="_blank"
                >Modulverzeichnis</a
              >
            </li>
            <li v-if="brochureUrl">
              <a
                class="hover:text-thunderbird-red"
                :href="brochureUrl"
                rel="noopener noreferer"
                target="_blank"
                >Studienbroschüre</a
              >
            </li>
            <li>
              <a
                class="hover:text-thunderbird-red"
                href="https://hfh.ch"
                rel="noopener noreferer"
                target="_blank"
                >hfh.ch</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </template>
  </HfhHeaderBar>
  <div class="flex justify-between h-full px-4 pt-4 pb-4">
    <div class="flex gap-x-8 items-center">
      <HfhLogo />
      <div>
        <h1 class="text-2xl m-0">
          Studienverlaufsplaner
          <span v-if="planerName">{{ planerName }}</span>
        </h1>
        <p class="text-sm m-0">(Änderungen vorbehalten)</p>
      </div>
    </div>
    <div class="flex justify-between items-center gap-4 text-base print:hidden">
      <nav class="flex items-center">
        <ul class="flex gap-x-4" v-if="showNavigation">
          <li>
            <Link
              :href="`/${planerSlug}/${planSlug}/zeitplan`"
              class="font-normal hover:text-thunderbird-red"
              :class="{
                active: $page.component === 'Schedule',
              }"
              >Zeitplan</Link
            >
          </li>
          <li>
            <Link
              :href="`/${planerSlug}/${planSlug}/anrechnung`"
              class="font-normal hover:text-thunderbird-red"
              :class="{
                active: $page.component === 'Credit',
              }"
              >Anrechnung</Link
            >
          </li>
        </ul>
      </nav>
      <SaveStatus />
      <button
        v-if="showTour"
        id="start-tour"
        class="flex items-center gap-1 hover:text-thunderbird-red"
        @click="startTour"
      >
        <QuestionMarkCircleIcon class="w-5 h-5" aria-hidden="true" />
        Hilfe
      </button>
      <PrintButton />
    </div>
  </div>
</template>

<script>
import { QuestionMarkCircleIcon } from "@heroicons/vue/outline";
import {
  HfhMenu,
  HfhLink,
  HfhLogo,
  HfhHeaderBar,
} from "@hfh-dlc/hfh-styleguide";
import PrintButton from "./PrintButton.vue";
import SaveStatus from "./SaveStatus.vue";
export default {
  components: {
    HfhHeaderBar,
    HfhLogo,
    HfhLink,
    HfhMenu,
    QuestionMarkCircleIcon,
    PrintButton,
    SaveStatus,
  },
  props: {
    planerSlug: {
      type: String,
      required: true,
    },
    planerName: {
      type: String,
      required: true,
    },
    planSlug: {
      type: String,
      required: true,
    },
    showNavigation: {
      type: Boolean,
      required: true,
    },
    showTour: {
      type: Boolean,
      required: true,
    },
    brochureUrl: {
      type: String,
      required: true,
    },
    moduleDirectoryUrl: {
      type: String,
      required: true,
    },
  },
  methods: {
    startTour() {
      this.$emitter.emit("start-tour", {});
    },
  },
};
</script>

<style lang="scss" scoped>
a.active {
  color: var(--c-thunderbird-red);
}
</style>
